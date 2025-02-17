#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

// Obter o diretório atual usando import.meta.url
const TEMPLATE_DIR = path.join(
  new URL(import.meta.url).pathname,
  "../../templates"
);

async function main() {
  console.log(chalk.green("\n🚀 Bem-vindo ao ASYS Init!\n"));

  // Passo 1: Escolher a linguagem
  const languages = fs.readdirSync(TEMPLATE_DIR);
  const { language } = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "Escolha a linguagem do projeto:",
      choices: languages,
    },
  ]);

  // Passo 2: Escolher módulos adicionais
  const modulesPath = path.join(TEMPLATE_DIR, language);
  const availableModules = fs
    .readdirSync(modulesPath)
    .filter((m) => m !== "base");

  const { selectedModules } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedModules",
      message: "Selecione os módulos adicionais:",
      choices: availableModules,
    },
  ]);

  // Passo 3: Nome do projeto
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Digite o nome do projeto:",
      validate: (input) =>
        input ? true : "O nome do projeto não pode estar vazio",
    },
  ]);

  // Criar pasta do projeto
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`\nErro: O diretório '${projectName}' já existe.`));
    return;
  }

  fs.mkdirSync(projectPath);

  // Copiar template base
  console.log(chalk.blue(`\n📂 Criando o projeto base...`));
  fs.copySync(path.join(modulesPath, "base"), projectPath);

  // Copiar módulos adicionais
  if (selectedModules.length > 0) {
    console.log(chalk.blue("\n🔧 Adicionando módulos selecionados..."));
    selectedModules.forEach((mod) => {
      console.log(chalk.yellow(`✅ Adicionando módulo: ${mod}`));
      fs.copySync(path.join(modulesPath, mod), projectPath, {
        overwrite: true,
      });
    });
  }

  console.log(
    chalk.green(`\n✅ Projeto '${projectName}' criado com sucesso!\n`)
  );
  console.log(chalk.blue(`📂 Diretório: ${projectPath}\n`));
}

main().catch((err) => console.error(chalk.red("Erro:"), err));
