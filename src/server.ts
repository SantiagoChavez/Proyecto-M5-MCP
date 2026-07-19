import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { octokit } from "./github/client.js";
import { ListRepositoriesSchema } from "./schemas/index.js";
import { CreateRepositorySchema } from "./schemas/index.js";
import { CreateIssueSchema } from "./schemas/index.js";
import { ListIssuesSchema } from "./schemas/index.js";
import { CreateCommitSchema } from "./schemas/index.js";

// Instanciamos el servidor MCP moderno
const server = new McpServer({
    name: "github-mcp-server",
    version: "1.0.0",
});

// 3. REGISTRO DE LA TOOL: Le enseñamos al servidor a listar repositorios
server.tool(
    "list-repositories",
    ListRepositoriesSchema.shape,                  // El molde de Zod (¡Acá es donde se usa!)
    async () => {                            // La función ejecutora (callback)
        try {
            console.error("[INFO] La IA solicitó listar los repositorios de GitHub...");

            // Llamamos a Octokit para traer los repositorios del usuario autenticado
            const response = await octokit.rest.repos.listForAuthenticatedUser({
                sort: "updated", // Los ordena por última actualización
                per_page: 50     // Nos trae hasta 50 repositorios
            });

            // Mapeamos la respuesta para mandarle a la IA solo los datos limpios que necesita
            const repoList = response.data.map((repo) => ({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
            }));

            // Retornamos el resultado en el formato estricto que exige el protocolo MCP
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(repoList, null, 2),
                    },
                ],
            };
        } catch (error: any) {
            console.error("[ERROR] Falló la comunicación con la API de GitHub:", error);
            return {
                content: [
                    {
                        type: "text",
                        text: `Error al listar los repositorios: ${error.message || error}`,
                    },
                ],
                isError: true, // Le avisamos a la IA que la operación falló
            };
        }
    }
);

// REGISTRO DE LA TOOL: Le enseñamos al servidor a crear un repositorio nuevo
server.tool(
    "create-repository",
    CreateRepositorySchema.shape,
    async (args) => {
        try {
            //Desectructuramos los parámetros que vienen del LLM clasificados por el molde
            const { name, description } = args;

            console.error(`[INFO] La IA solicitó crear el repositorio: "${name}"...`);

            //Llamamos a Octokit para crear el repositorio en la cuenta del usuario autenticado
            const response = await octokit.rest.repos.createForAuthenticatedUser({
                name,
                description: description || "Repositorio creado automaticamente por el agente",
                private: false, //publico por defecto
            });

            //Retornamos el exito en el formato estricto del protocolo MCP
            return {
                content: [
                    {
                        type: "text",
                        text: `Repositorio creado con éxito \nNombre: ${response.data.name}\nURL: ${response.data.html_url}`,
                    },
                ],
            };
        } catch (error: any) {
            console.error("[ERROR] Falló la creación del repositorio en GitHub:", error);


            //Transformación de error técnico a lenguaje natural
            let mensajeAmigable = `Error al crear el repositorio: ${error.message || error}`;

            if (error.status === 422) {
                mensajeAmigable = `El repositorio "${args.name}" ya existe en tu cuenta de GitHub. Elegí otro nombre o intenta de nuevo.`;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: mensajeAmigable,
                    },
                ],
                isError: true, //Le avisa al LLM que la operacion falló
            };
        }
    }
);

//REGISTRO DE LA TOOL: Le enseñamos al servidor a crear issues en un repositorio
server.tool(
    "create-issue",
    CreateIssueSchema.shape, //Volvemos a usar .shape para desempaquetar el molde de zod
    async (args) => {
        try {
            //Desestructuramos los parámetros obligatorios que nos pasa el LLM
            const { owner, repo, title, body } = args;

            console.error(`[INFO] La IA solicitó crear un nuevo issue en "${owner}/${repo}" con el título: "${title}"`);
            // Llamamos a Octokit para impactar el issue en la API de GitHub
            const response = await octokit.rest.issues.create({
                owner,
                repo,
                title,
                body: body || "Issue creado automáticamente por el Agente",
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `Issue creado con éxito\nNúmero: ${response.data.number}\nTítulo: ${response.data.title}\nURL: ${response.data.html_url}`,
                    },
                ],
            };
        } catch (error: any) {
            console.error("[ERROR] Falló la creación del issue en GitHub:", error);

            let mensajeAmigable = `Error al crear el issue: ${error.message || error}`;

            if (error.status === 404) {
                mensajeAmigable = `No se encontró el repositorio"${args.owner}/${args.repo}". Verificá que el dueño y el nombre esten bien escritos`;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: mensajeAmigable,
                    },
                ],
                isError: true,
            };
        }
    }
);

//REGISTRO DE LA TOOL: Le enseñamos a la tool a listar issues abiertos
server.tool(
    "list-issues",
    ListIssuesSchema.shape,
    async (args) => {
        try {
            const { owner, repo } = args;

            console.error(`[INFO]  La IA solicitó listar los  issues abiertos de "${owner}/${repo}"...`);

            //Llamamos a Octokit para mandar solo la información limpia y útil al LLM
            const response = await octokit.rest.issues.listForRepo({
                owner,
                repo,
                state: "open", //Traemos únicamente los que están abiertos
                per_page: 30, //Límite razonable por página
            });

            //Mapeamos para mandar solo la información limpia y útil al LLM
            const issueList = response.data.map((issue) => ({
                number: issue.number,
                title: issue.title,
                state: issue.state,
                author: issue.user?.login,
                url: issue.html_url,
            }));
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(issueList, null, 2),
                    },
                ],
            };

        } catch (error: any) {
            console.error("[ERROR] Falló la lectura de issues en Github:", error);

            let mensajeAmigable = `Error al listar los issues: ${error.message || error}`;

            if (error.status === 404) {
                mensajeAmigable = `No se encontró el repositorio "${args.owner}/${args.repo}". Verificá los datos e intenta de nuevo.`;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: mensajeAmigable,
                    },
                ],
                isError: true,
            };
        }
    }
);

// REGISTRO DE LA TOOL: Le enseñamos al servidor a realizar commits en un archivo
// REGISTRO DE LA TOOL: Le enseñamos al servidor a realizar commits en un archivo
server.tool(
    "create-commit",
    CreateCommitSchema.shape, // Usamos .shape para desempaquetar el molde de Zod
    async (args) => {
        try {
            const { owner, repo, path, message, content, branch } = args;

            console.error(`[INFO] La IA solicitó crear un commit en "${owner}/${repo}" para el archivo "${path}"...`);

            // 1. Intentamos obtener el archivo por si ya existe (necesitamos su SHA para actualizarlo)
            let sha: string | undefined = undefined;
            try {
                const fileRes = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path,
                    ref: branch || "main",
                });

                if (!Array.isArray(fileRes.data) && fileRes.data.type === "file") {
                    sha = fileRes.data.sha; // Si el archivo ya existía, guardamos su firma SHA
                }
            } catch (e) {
                // Si tira error 404 significa que el archivo es nuevo, ignoramos el error de forma controlada
            }

            // 2. Creamos o actualizamos el archivo con un commit en GitHub
            const response = await octokit.rest.repos.createOrUpdateFileContents({
                owner,
                repo,
                path,
                message,
                content: Buffer.from(content).toString("base64"), // GitHub exige el contenido codificado en Base64
                branch: branch || "main",
                sha, // Si es undefined crea el archivo; si tiene el SHA lo actualiza
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `¡Commit realizado con éxito!\nMensaje: ${response.data.commit.message}\nSHA: ${response.data.commit.sha}\nArchivo: ${response.data.content?.html_url}`,
                    },
                ],
            };
        } catch (error: any) {
            console.error("[ERROR] Falló la creación del commit en GitHub:", error);

            let mensajeAmigable = `Error al realizar el commit: ${error.message || error}`;

            if (error.status === 404) {
                mensajeAmigable = `No se encontró el repositorio o la rama especificada para "${args.owner}/${args.repo}".`;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: mensajeAmigable,
                    },
                ],
                isError: true,
            };
        }
    }
);

// Función principal para ejecutar el servidor
async function main() {
    const transport = new StdioServerTransport();

    console.error("[INFO] Conectando el servidor MCP de GitHub a través de stdio... ");

    await server.connect(transport);

    console.error("[SUCCESS] Servidor MCP de GitHub corriendo y conectado.");
}

main().catch((error) => {
    console.error("[FATAL] Error crítico al iniciar el servidor MCP de GitHub:", error);
    process.exit(1);
});

