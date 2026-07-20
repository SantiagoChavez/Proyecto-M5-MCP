# Historial de Cambios (Changelog) 📝

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2026-07-20

### Modificado
- **README.md:** Añadida sección explicativa de Pureza JSON-RPC y Aislamiento del Canal Stdio en [README.md](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/README.md).
- **Resolución de problemas:** Incorporada fila a la tabla de Troubleshooting en [README.md](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/README.md) cubriendo el error de inicialización `invalid character 'â' looking for beginning of value`.

## [1.2.0] - 2026-07-19

### Añadido
- **Registro de Herramientas (Tools):** Implementación e integración en [server.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/server.ts) de las 5 herramientas MCP: `list-repositories`, `create-repository`, `create-issue`, `list-issues` y `create-commit` usando validación Zod y Octokit.
- **Suite de Pruebas Unitarias:** Creación de [tests/github.test.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/tests/github.test.ts) con Vitest para validar esquemas Zod, flujos de éxito y simular respuestas de error HTTP (401, 403, 404, 422).
- **Scripts de NPM:** Configuración de scripts `"build"`, `"dev"` y `"test"` en `package.json` para facilitar compilación, arranque local y pruebas.
- **Documentación de Proyecto:** Refactorización total de [README.md](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/README.md) bajo la consigna de entrega de la Etapa 7, incluyendo diagrama de arquitectura Mermaid, pasos para token de GitHub, guía de integración en Antigravity, ejemplos detallados de prompts para cada herramienta y resolución de problemas comunes (troubleshooting).

## [1.1.0] - 2026-07-18

### Añadido
- **Servidor MCP:** Creación de [server.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/server.ts) que inicializa y configura el servidor MCP (`McpServer`) para conectarse mediante `StdioServerTransport`.
- **Esquemas de Validación:** Creación de [schemas/index.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/schemas/index.ts) con esquemas de validación Zod para herramientas de GitHub (listar y crear repositorios, listar y crear issues, y realizar commits).

### Modificado
- **Cliente GitHub:** Mejora en [client.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/github/client.ts) corrigiendo un error ortográfico en el mensaje de error fatal y agregando comentarios sobre la validación del token.

## [1.0.0] - 2026-07-14

### Añadido
- **Estructura del Proyecto:** Inicialización del proyecto de TypeScript con carpeta `src` organizada.
- **Configuración de TypeScript:** Archivo `tsconfig.json` configurado para compilar a `ES2022` con soporte de módulos `NodeNext` y modo estricto.
- **Dependencias de MCP & GitHub:**
  - `@modelcontextprotocol/sdk` para el soporte del protocolo Model Context Protocol.
  - `@octokit/rest` para interactuar con la API REST de GitHub.
  - `dotenv` para cargar variables de entorno desde un archivo `.env`.
  - `zod` para validación estricta de esquemas de datos.
- **Cliente de GitHub:** Creación de `src/github/client.ts` para inicializar y exportar de manera centralizada una instancia de `Octokit` autenticada con la variable de entorno `GITHUB_TOKEN`.
- **Framework de Pruebas:** Configuración e integración inicial de `vitest` para pruebas unitarias.
- **Documentación:**
  - Archivo `README.md` con descripción del proyecto, tecnologías, estructura y guía de inicio rápido.
  - Archivo `.env.example` como plantilla para configurar la variable de entorno `GITHUB_TOKEN`.
