# Proyecto M5 MCP (Model Context Protocol) 🚀

Este proyecto es un servidor/cliente basado en el **Model Context Protocol (MCP)** de Anthropic, integrado con la API de GitHub mediante **Octokit** para permitir que modelos de inteligencia artificial interactúen directamente con repositorios de GitHub.

## 📋 Características actuales

- **Servidor MCP:** Punto de entrada en [server.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/server.ts) que inicializa y conecta el servidor MCP utilizando `StdioServerTransport`.
- **Esquemas de Validación Zod:** Definición en [schemas/index.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/schemas/index.ts) para validar de manera estricta los datos de entrada a las herramientas (listar/crear repositorios, listar/crear issues y realizar commits).
- **Configuración de TypeScript:** Listo para compilar código moderno (`ES2022`, `NodeNext`).
- **Integración con GitHub:** Cliente centralizado en [client.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/github/client.ts) configurado con `@octokit/rest` y autenticación segura.
- **Soporte de Variables de Entorno:** Integración con `dotenv` para gestionar credenciales de manera segura.
- **Infraestructura de Pruebas:** Configurado con `vitest` para ejecutar pruebas rápidas e interactivas.

---

## 🛠️ Tecnologías utilizadas

- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Protocolo:** [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol)
- **Cliente GitHub:** [@octokit/rest](https://github.com/octokit/rest.js)
- **Gestión de variables:** [dotenv](https://github.com/motdotla/dotenv)
- **Validación:** [zod](https://github.com/colinhacks/zod)
- **Testing:** [vitest](https://vitest.dev/)

---

## 📂 Estructura del Proyecto

```text
Proyecto-M5-MCP/
├── src/
│   ├── github/
│   │   └── client.ts      # Inicialización del cliente Octokit de GitHub
│   ├── schemas/
│   │   └── index.ts       # Esquemas de validación Zod para las herramientas
│   └── server.ts          # Servidor principal MCP y punto de entrada
├── tsconfig.json          # Configuración del compilador de TypeScript
├── package.json           # Dependencias y scripts de npm
└── .env.example           # Plantilla para variables de entorno (A crear)
```

---

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- Un token de acceso personal de GitHub (Personal Access Token - PAT) con los permisos necesarios.

---

## 🚀 Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente plantilla:
   ```env
   GITHUB_TOKEN=tu_token_de_acceso_personal_aqui
   ```

---

## 💻 Scripts Disponibles

- **Compilar el proyecto:**
  ```bash
  npx tsc
  ```
  Esto generará los archivos JavaScript en la carpeta `./dist`.

- **Ejecutar pruebas:**
  ```bash
  npx vitest
  ```

---

## 🔮 Próximos Pasos sugeridos

1. Registrar las herramientas (Tools) en el servidor MCP ([server.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/server.ts)), vinculando los esquemas de [schemas/index.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/schemas/index.ts) con las respectivas llamadas a la API de GitHub en [client.ts](file:///c:/Users/Santiago/Proyectos%20integradores/Proyecto-M5-MCP/src/github/client.ts).
2. Desarrollar pruebas unitarias con `vitest` para comprobar el correcto flujo de llamadas a la API y el comportamiento del servidor MCP.
3. Integrar y configurar el servidor local en un cliente MCP (por ejemplo, Claude Desktop) para realizar pruebas reales de extremo a extremo.
