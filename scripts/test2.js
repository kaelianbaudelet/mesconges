const chalk = require("chalk");
const fs = require("fs").promises;
const csv = require("csv-parse");

console.log(chalk.bold.blue("Import en masse d'utilisateurs"));

async function readCSVFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return new Promise((resolve, reject) => {
      csv.parse(
        fileContent,
        {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        },
        (error, records) => {
          if (error) reject(error);
          else resolve(records);
        }
      );
    });
  } catch (error) {
    throw new Error(`Erreur lors de la lecture du fichier: ${error.message}`);
  }
}

async function validateUsers(users) {
  let validCount = 0;
  let invalidCount = 0;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  users.forEach((user) => {
    const errors = [];

    // Validation du username
    if (!user.username || user.username.trim() === "") {
      errors.push("Le nom d'utilisateur est manquant");
    }

    // Validation de l'email
    if (!user.email || !emailRegex.test(user.email)) {
      errors.push("L'email est invalide");
    }

    if (errors.length > 0) {
      invalidCount++;
    } else {
      validCount++;
    }

    // Affichage en temps réel du nombre d'utilisateurs valides et invalides
    process.stdout.write(
      `\r${chalk.green(
        `${validCount} utilisateurs importés avec succès`
      )} | ${chalk.red(`${invalidCount} utilisateurs non importés`)}`
    );
  });

  return { validCount, invalidCount };
}

async function importUsers() {
  try {
    const csvPath = process.argv[2];
    if (!csvPath) {
      console.error(
        chalk.red("Erreur: Veuillez spécifier le chemin du fichier CSV")
      );
      console.log(
        chalk.yellow("Usage: node import-users.js <chemin-du-fichier-csv>")
      );
      process.exit(1);
    }

    console.log(chalk.cyan(`\nLecture du fichier: ${csvPath}`));
    const users = await readCSVFile(csvPath);

    // Validation et importation des utilisateurs
    const { validCount, invalidCount } = await validateUsers(users);

    // Résumé final
    console.log(chalk.cyan("\n\nRésumé de l'importation:"));
    console.log(
      chalk.green(`Utilisateurs importés avec succès: ${validCount}`)
    );
    console.log(chalk.red(`Utilisateurs non importés: ${invalidCount}`));
  } catch (error) {
    console.error(chalk.red("\nErreur lors de l'importation:"), error.message);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  console.log(chalk.yellow("\nImportation annulée"));
  process.exit(0);
});

importUsers();
