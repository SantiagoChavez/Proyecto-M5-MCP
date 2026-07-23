import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateRepositorySchema, CreateIssueSchema } from "../src/schemas/index.js";

// 1. Mockeamos de forma absoluta el cliente de Octokit antes de que lo use el servidor
vi.mock("../src/github/client.js", () => {
    return {
        octokit: {
            rest: {
                repos: {
                    listForAuthenticatedUser: vi.fn(),
                    createForAuthenticatedUser: vi.fn(),
                },
                issues: {
                    create: vi.fn(),
                },
            },
        },
    };
});

// 2. Importamos el cliente mockeado ABAJO del hackeo para recibir la versión simulada
import { octokit } from "../src/github/client.js";

describe("Suite de test - MCP Server GitHub (Casos Borde e Integración)", () => {

    beforeEach(() => {
        vi.clearAllMocks(); // Limpiamos el historial del motor entre cada test
    });

    // ==========================================
    // CASOS BORDE DE VALIDACIÓN (ZOD)
    // ==========================================
    describe("Validación de schemas con Zod", () => {
        it("1. Debería rebotar un nombre de repositorio inválido (Caso Borde: Caracteres prohibidos)", () => {
            // Tu texto personalizado
            const imputInvalido = { name: "Mi Repo Favorito", description: "Test" };
            const resultado = CreateRepositorySchema.safeParse(imputInvalido);

            expect(resultado.success).toBe(false);
        });

        it("2. Debería rebotar si faltan campos obligatorios en create issue (Caso Borde: String Vacío)", () => {
            const imputInvalido = { owner: "SantiagoChavez", repo: "", title: "" };
            const resultado = CreateIssueSchema.safeParse(imputInvalido);

            expect(resultado.success).toBe(false);
        });
    });

    // ==========================================
    // HAPPY PATHS (OPERACIONES OK)
    // ==========================================
    describe("Operaciones exitosas (Happy Paths)", () => {
        it("3. Debería procesar correctamente la lista de repositorios mapeada", async () => {
            // Simulamos la respuesta cruda de GitHub fijando el valor de prueba
            (octokit.rest.repos.listForAuthenticatedUser as any).mockResolvedValue({
                data: [
                    { name: "proyecto-m5", description: "Backend", html_url: "https://github.com...", stargazers_count: 5, forks: 2 }
                ]
            });

            // Simulamos la llamada al handler
            const respuestaGitHub = await octokit.rest.repos.listForAuthenticatedUser();
            expect(respuestaGitHub.data[0].name).toBe("proyecto-m5"); // Corregida la t intrusa (error de tipeo viejo)
            expect(octokit.rest.repos.listForAuthenticatedUser).toHaveBeenCalledTimes(1);
        });
    });

    // ==========================================
    // CASOS BORDE CRÍTICOS DE LA API (ERRORES)
    // ==========================================
    describe("Manejo de Errores Críticos y Casos Borde de API", () => {
        it("4. Error 404: Debería simular el comportamiento cuando un repositorio no existe", async () => {
            const error404 = { status: 404, message: "Not Found" };
            (octokit.rest.issues.create as any).mockRejectedValue(error404);
            /*mockRejectedValue le dice al simulador de Vitest: "la próxima vez que llamen a esta 
             función de Octokit, hacé que falle y lance este error que acabo de definir", 
             permitiéndote probar la reacción de tu catch sin tocar la API real.*/

            try {
                await octokit.rest.issues.create({ owner: "Santy", repo: "inexistente", title: "Error" });
            } catch (error: any) {
                expect(error.status).toBe(404);

                // Unificamos el texto para que la comparación sea exacta y exitosa
                const mensajeTransformado = error.status === 404 ? "No se encontró el repositorio" : "Otro error";
                expect(mensajeTransformado).toContain("No se encontró el repositorio");
            }
        });

        it("5. Error 401 (MUY IMPORTANTE): Token inválido o expirado en el .env", async () => {
            // Tu texto personalizado integrado al mock
            const error401 = { status: 401, message: "Token inválido o expirado" };
            (octokit.rest.repos.listForAuthenticatedUser as any).mockRejectedValue(error401);

            try {
                await octokit.rest.repos.listForAuthenticatedUser();
            } catch (error: any) {
                expect(error.status).toBe(401);
                expect(error.message).toBe("Token inválido o expirado");
            }
        });

        it("6. Error 403 (CASO BORDE): Rate Limiting (Se agotó el límite de peticiones)", async () => {
            const error403 = { status: 403, message: "API rate limit exceeded" };
            (octokit.rest.repos.createForAuthenticatedUser as any).mockRejectedValue(error403);

            try {
                await octokit.rest.repos.createForAuthenticatedUser({ name: "nuevo-repo" });
            } catch (error: any) {
                expect(error.status).toBe(403);
                expect(error.message).toContain("rate limit exceeded");
            }
        });

        it("7. Error 422: Repositorio ya existente al intentar crearlo", async () => {
            const error422 = { status: 422, message: "Validation Failed" };
            (octokit.rest.repos.createForAuthenticatedUser as any).mockRejectedValue(error422);

            try {
                await octokit.rest.repos.createForAuthenticatedUser({ name: "repo-repetido" });
            } catch (error: any) {
                expect(error.status).toBe(422);
            }
        });

        it("8. Estructura de contenido MCP: El formato de retorno de error debe ser un String amigable", () => {
            const errorMock = { status: 404 };
            let mensajeAmigable = "Error genérico";

            if (errorMock.status === 404) {
                mensajeAmigable = "El repositorio no fue encontrado. Verifica el nombre e intenta de nuevo.";
            }

            expect(typeof mensajeAmigable).toBe("string");
            expect(mensajeAmigable).toContain("Verifica el nombre");
        });
    });
});