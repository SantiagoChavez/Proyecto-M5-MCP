import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 1. Instanciamos el servidor MCP con un solo objeto limpio y moderno
const server = new McpServer({
    name: "github-mcp-server",
    version: "1.0.0",
});

// Función principal para ejecutar el servidor
async function main() {
    const transport = new StdioServerTransport();

    console.error("[INFO] Conectando el servidor MCP de GitHub a través de stdio... ");

    await server.connect(transport);

    console.error("[SUCCESS] Servidor MCP de GitHub corriendo y conectado.");
}

// Ejecutamos el inicio del servidor atajando cualquier error fatal
main().catch((error) => {
    console.error("[FATAL] Error crítico al iniciar el servidor MCP de GitHub:", error);
    process.exit(1);
});