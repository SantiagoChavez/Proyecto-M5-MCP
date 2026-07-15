# Historial de Cambios (Changelog) 📝

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

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
