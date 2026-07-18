import { z } from "zod";

// 1. Esquema para listar repositorios (no requiere parámetros de entrada)
export const ListRepositoriesSchema = z.object({});

// 2. Esquema para crear un repositorio (valida nombre y descripción)
export const CreateRepositorySchema = z.object({
    name: z
        .string()
        .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
        .max(100, "El nombre del repositorio no puede superar los 100 caracteres")
        .regex(
            /^[a-zA-Z0-9._-]+$/,
            "El nombre solo puede contener letras, números, puntos, guiones y guiones bajos"
        )
        .describe("El nombre del nuevo repositorio a crear en GitHub"),

    description: z
        .string()
        .optional()
        .describe("Una descripción opcional para el repositorio"),
});

// 3. Esquema para listar issues de un repositorio específico
export const ListIssuesSchema = z.object({
    owner: z
        .string()
        .min(1, "El propietario del repositorio es requerido")
        .describe("El nombre de usuario u organización dueño del repositorio"),

    repo: z
        .string()
        .min(1, "El nombre del repositorio es requerido")
        .describe("El nombre del repositorio del cual listar los issues"),
});

// 4. Esquema para crear un issue
export const CreateIssueSchema = z.object({
    owner: z
        .string()
        .min(1, "El propietario del repositorio es requerido")
        .describe("El nombre de usuario u organización dueño del repositorio"),

    repo: z
        .string()
        .min(1, "El nombre del repositorio es requerido")
        .describe("El nombre del repositorio donde se creará el issue"),

    title: z
        .string()
        .min(1, "El título del issue no puede estar vacío")
        .max(256, "El título del issue es demasiado largo")
        .describe("El título descriptivo del issue"),

    body: z
        .string()
        .optional()
        .describe("El cuerpo o descripción detallada del problema o tarea del issue"),
});

// 5. Esquema para crear un commit (agregar o modificar un archivo)
export const CreateCommitSchema = z.object({
    owner: z
        .string()
        .min(1, "El propietario del repositorio es requerido")
        .describe("El nombre de usuario u organización dueño del repositorio"),

    repo: z
        .string()
        .min(1, "El nombre del repositorio es requerido")
        .describe("El nombre del repositorio donde se realizará el commit"),

    path: z
        .string()
        .min(1, "La ruta del archivo es requerida")
        .regex(/^[a-zA-Z0-9._\-/]+$/, "La ruta del archivo contiene caracteres inválidos")
        .describe("La ruta completa del archivo dentro del repositorio (ej: src/index.js o README.md)"),

    message: z
        .string()
        .min(1, "El mensaje de commit es requerido")
        .describe("El mensaje descriptivo para el commit (ej: feat: agregar validador)"),

    content: z
        .string()
        .describe("El contenido en texto plano que se escribirá en el archivo"),

    branch: z
        .string()
        .optional()
        .default("main")
        .describe("La rama en la que se realizará el commit. Si no se especifica, se usará 'main'"),
});















