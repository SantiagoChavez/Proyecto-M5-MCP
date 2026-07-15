import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.GITHUB_TOKEN;

if (!token) {
    console.error("[FATAL] GITHUB_TOKEN no etsá definido en las variables de entorno");
    process.exit(1);
}

// Inicializamos la instancia de Octokit de forma centralizada
export const octokit = new Octokit({
    auth: token,
});

