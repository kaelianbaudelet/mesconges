const { input, select } = require("@inquirer/prompts");
const chalk = require("chalk");
const prisma = require("@prisma/client"); // Assurez-vous d'avoir configuré Prisma
const minimist = require("minimist"); // Pour analyser les arguments de ligne de commande

const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

console.log(chalk.bold.blue("Modification du rôle d'un utilisateur"));

// Analyser les arguments de ligne de commande
const args = minimist(process.argv.slice(2));

async function modifyUserRole() {
  try {
    // Si l'argument --mail est fourni, on l'utilise
    let email = args.mail;

    // Si aucun mail n'est fourni en argument, on le demande à l'utilisateur
    if (!email) {
      email = await input({
        message: "Quel est le mail de l'utilisateur ?",
        validate: (input) => {
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          if (!input.match(emailRegex)) {
            return "Veuillez entrer une adresse email valide !";
          }
          return true;
        },
      });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(chalk.red("Utilisateur non trouvé avec cet email."));
      return;
    }

    // Sélectionner le rôle à attribuer
    const newRole = await select({
      message: "Quel rôle souhaitez-vous attribuer à cet utilisateur ?",
      choices: [
        {
          name: "Administrateur - Accès complet, peu gérer les utilisateurs et lancer des campagnes de voeux",
          value: "admin",
        },
        {
          name: "Utilisateur - Accès limité aux fonctionnalités de base, peut envoyer des voeux",
          value: "user",
        },
      ],
    });

    // Mettre à jour le rôle de l'utilisateur dans la base de données
    await prismaClient.user.update({
      where: { email },
      data: { role: newRole },
    });

    // Afficher un message de succès
    console.log(chalk.green("\nRôle modifié avec succès"));
    console.log(chalk.white("--------------------------------"));
    console.log(chalk.white(`Email : ${chalk.blue(email)}`));
    console.log(chalk.white(`Nouveau rôle : ${chalk.blue(newRole)}`));
    console.log(chalk.white("--------------------------------"));
  } catch (error) {
    if (error.name === "CLIExitError") {
      console.log(chalk.yellow("\nModification annulée"));
      process.exit(0);
    } else {
      console.error(
        chalk.red("\nErreur lors de la modification du rôle:"),
        error
      );
      process.exit(1);
    }
  } finally {
    await prismaClient.$disconnect();
  }
}

process.on("SIGINT", () => {
  console.log(chalk.yellow("\nModification annulée"));
  process.exit(0);
});

modifyUserRole();
