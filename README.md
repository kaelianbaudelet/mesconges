# E.Leclerc SCAPARTOIS MesCongés - Logiciel Interne

**E.Leclerc SCAPARTOIS MesCongé** est une application web interne créer en **[NextJS](https://nextjs.org/)** dédiée à la gestion des vœux de congés des employés au sein de l'entreprise. Conçue pour simplifier et optimiser le processus de demande de congés, cette application permet aux collaborateurs de soumettre leurs préférences et vœux de congés directement en ligne, de manière rapide, intuitive et sécurisée.

L'application permet aux salariés de consulter et gérer leurs demandes de congés, tout en offrant aux administrateurs un outil centralisé pour visualiser les vœux de congés. Grâce à son interface simple et ergonomique, MesCongé assure une gestion fluide des demandes de congés, facilitant ainsi la planification des ressources humaines au sein de l'entreprise.

## Mise en Production

### Prérequis

- Docker à la dernière version installée sur un serveur

## Installation de l'image Docker

### 1. Cloner/Télécharger le répertoire

Téléchargez le répertoire du dépôt GitHub

**OU**

Clonez le dépôt contenant le code de l'application :

```
git clone https://github.com/afi-dev/scapartois-mesconges.git
```

### 2. Construire l'image Docker

Dans le répertoire de l'application, exécutez la commande suivante pour construire l'image Docker :

```
docker build -t mesconges .
```

Cette commande crée une image Docker nommée mesconge à partir du Dockerfile présent dans le répertoire.

Vous pouvez vérifier que l'image Docker est bien installée en tapant la commande :

```
docker images
```

## Lancer un Conteneur Docker

### 1. Démarrer le conteneur

### Avant de démarrer le conteneur

### Configurer votre domaine

Si vous utilisez un domaine, avant d'installer et de déployer le conteneur Docker, assurez-vous d'avoir défini une redirection DNS sur un domaine (par exemple example.com vers 174.85.18.145 de type A) vers l'adresse de votre serveur hébergeant Docker.

### Configurer Google SignIn

L'application nécessite l'utilisation du service OAuth Google SignIn pour fonctionner. Pour cela, il vous faut des identifiants afin que l'application puisse communiquer avec l'API de Google.

Suivez ces étapes pour obtenir vos identifiants Google SignIn :

1. Accédez à la **Google Cloud Platform** avec un **compte administrateur**.
2. Une fois connecté, suivez le guide de Google pour déployer une nouvelle application OAuth : [Guide Google pour obtenir un Client ID](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid?hl=fr)
3. Cliquez sur `Configurer un Projet`.
4. Sélectionnez dans le menu déroulant "+ Créer un nouveau projet", donnez-lui un nom (par exemple : `GoogleSignInMesConges`), puis cliquez sur `Suivant`.
5. Dans l'étape suivante, choisissez `Web Server` dans le menu déroulant. Un champ `Authorized redirect URIs` apparaîtra.
6. Dans ce champ, entrez l'URL suivante : `https://[VotreDomaine]/api/auth/callback/google`
   Remplacez `[VotreDomaine]` par votre domaine réel. (Mettre `localhost` si pas de nom de domaine)
7. Cliquez sur Suivant. Vous serez ensuite redirigé vers une page contenant vos identifiants d'application `Client ID` et `Client Secret`
   Copiez ces identifiants et définissez-les dans les variables d'environnement associées lors du lancement de votre conteneur Docker.

### Déploiement

Pour déployer et lancer l'application dans un conteneur Docker, vous devrez au préalable définir certaines variables d'environnement nécessaires.

```
docker run -d -p 8080:80 --name mesconge \
 -e NEXT_PUBLIC_SITE_URL=https://votredomaine.com \
 -e DB_HOST=localhost \
 -e DB_USER=mesconges \
 -e DB_PASSWORD=<MOT DE PASSE> \
 -e DB_NAME=mesconges \
 -e GOOGLE_CLIENT_ID=<CLIENT ID> \
 -e GOOGLE_CLIENT_SECRET=<CLIENT SECRET> \
 mesconge
```

### Détails des variables :

- `NEXT_PUBLIC_SITE_URL` : L'URL publique sous laquelle l'application sera accessible (par exemple `https://votredomaine.com`). Cela est nécessaire pour générer automatiquement un certificat SSL avec OpenSSL. Si un domaine n'est pas disponible et que l'application doit tourner en local, vous pouvez remplacer cette variable par l'adresse IP locale (par exemple `http://127.0.0.1`), mais aucun certificat SSL ne sera généré dans ce cas.
- `DB_HOST` : L'hôte de la base de données. Par défaut, l'application crée une base de données automatiquement si elle n'existe pas, laissez localhost dans ce cas.
- `DB_USER` : L'utilisateur pour se connecter à la base de données. Vous pouvez définir un nom d'utilisateur en particulier.
- `DB_PASSWORD` : Le mot de passe pour l'utilisateur de la base de données. Pensez à définir un mot de passe sécurisé.
- `DB_NAME` : Le nom de la base de données.
- `GOOGLE_CLIENT_ID`: L'identifiant Client d'application Google Sign-In permet la connexion des utilisateurs a travers le "Connexion avec Google", Pour obtenir une ID client, regarder la section [Obtention d'identifiant d'application OAuth Google SignIn](#google-signin-oauth)
- `GOOGLE_CLIENT_SECRET`: L'identifiant Secret Client d'application Google Sign-In permet la connexion des utilisateurs a travers le "Connexion avec Google", Pour obtenir une ID client, suivez le guide: https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid?hl=fr

Lors du démarrage du conteneur, **E. Leclerc SCAPARTOIS MesCongé** va automatiquement :

- Installer tous les éléments nécessaires (par exemple, les dépendances de l'application).
- Créer la base de données si elle n'existe pas.
- Générer un certificat SSL OpenSSL en fonction du domaine renseigné dans `NEXT_PUBLIC_SITE_URL`.

## 3. Vérification de la mise en production

Pour vérifier que le conteneur fonctionne correctement, vous pouvez exécuter :

```
docker ps
```

## 4. Accéder à l'application

L'application devrait maintenant être accessible à l'adresse suivante dans votre navigateur :

```
https://<NOMDEDOMAINE>:80
```
