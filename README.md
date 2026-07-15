# Proyecto M5 MCP (Model Context Protocol) 🚀

Este proyecto es un servidor/cliente basado en el **Model Context Protocol (MCP)** de Anthropic, integrado con la API de GitHub mediante **Octokit** para permitir que modelos de inteligencia artificial interactúen directamente con repositorios de GitHub.

## 📋 Características actuales

- **Configuración de TypeScript:** Listo para compilar código moderno (`ES2022`, `NodeNext`).
- **Integración con GitHub:** Cliente centralizado configurado con `@octokit/rest` y autenticación segura mediante variables de entorno.
- **Soporte de Variables de Entorno:** Integración con `dotenv` para gestionar credenciales de manera segura.
- **Validación de Datos:** Incluye `zod` para validación de esquemas y tipos en tiempo de ejecución.
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
│   └── github/
│       └── client.ts      # Inicialización del cliente Octokit de GitHub
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

1. Implementar los esquemas de herramientas (Tools) de MCP para GitHub (ej. buscar repositorios, listar issues, crear pull requests).
2. Crear el punto de entrada del servidor MCP (`src/index.ts`) para inicializar el transporte y registrar las herramientas.
3. Crear pruebas unitarias con `vitest` en `src/github/client.test.ts` para verificar la conexión con GitHub.
