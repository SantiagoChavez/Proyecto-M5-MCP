import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// 1. Importamos nuestro escáner de Octokit ya autenticado
import { octokit } from "./github/client.js";
// 2. Importamos el molde de Zod para listar repositorios
import { ListRepositoriesSchema } from "./schemas/index.js";

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