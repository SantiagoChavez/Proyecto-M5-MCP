import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

// Desactivamos temporalmente el console.log para que dotenv no imprima mensajes gráficos en stdio
const originalLog = console.log;
console.log = () => { };
dotenv.config();
console.log = originalLog; // Restablecemos console.log normalmente

const token = process.env.GITHUB_TOKEN;

//Validación de Token
if (!token) {
    console.error("[FATAL] GITHUB_TOKEN no está definido en las variables de entorno");
    process.exit(1);
}

// Inicializamos la instancia de Octokit de forma centralizada
export const octokit = new Octokit({
    auth: token,
});

