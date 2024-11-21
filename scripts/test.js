const { input, select } = require("@inquirer/prompts");
const chalk = require("chalk");

console.log(chalk.bold.blue("Création d'un compte utilisateur"));

async function createUserAccount() {
  try {
    // Username prompt
    const username = await input({
      message: "Quel est le nom d'utilisateur?",
      validate: (input) => {
        if (!input) {
          return "Le nom d'utilisateur ne peut pas être vide!";
        }
        return true;
      },
    });

    // Email prompt
    const email = await input({
      message: "Quel est le mail de l'utilisateur?",
      validate: (input) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!input.match(emailRegex)) {
          return "Veuillez entrer une adresse email valide!";
        }
        return true;
      },
    });

    // Role selection
    const role = await select({
      message: "Quel rôle souhaitez-vous attribuer à ce compte?",
      choices: [
        {
          name: "Administrateur - Accès complet au système",
          value: "ADMIN",
        },
        {
          name: "Gestionnaire - Gestion des utilisateurs et contenus",
          value: "MANAGER",
        },
        {
          name: "Editeur - Création et modification de contenus",
          value: "EDITOR",
        },
        {
          name: "Utilisateur - Accès limité aux fonctionnalités de base",
          value: "USER",
        },
      ],
    });

    // Affichage des résultats
    console.log(chalk.green("\nCompte créé avec succès"));
    console.log(chalk.white("--------------------------------"));
    console.log(chalk.white(`Nom d'utilisateur: ${chalk.blue(username)}`));
    console.log(chalk.white(`Email: ${chalk.blue(email)}`));
    console.log(chalk.white(`Rôle: ${chalk.blue(role)}`));
    console.log(chalk.white("--------------------------------"));
    console.log(
      chalk.cyan(
        "\nUn email d'invitation sera envoyé à l'utilisateur pour la connexion OAuth"
      )
    );
  } catch (error) {
    if (error.name === "CLIExitError") {
      console.log(chalk.yellow("\nCréation de compte annulée"));
      process.exit(0);
    } else {
      console.error(
        chalk.red("\nErreur lors de la création du compte:"),
        error
      );
      process.exit(1);
    }
  }
}

process.on("SIGINT", () => {
  console.log(chalk.yellow("\nCréation de compte annulée"));
  process.exit(0);
});

createUserAccount();
