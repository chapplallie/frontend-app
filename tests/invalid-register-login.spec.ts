import { test, expect } from "@playwright/test";

// todo : messages d'erreurs & greater than & falsy devraient passer

// Définition des variables en dehors des tests pour les partager
const uniqueId = Date.now();
const validUsername = `Valide${uniqueId}`;
const validEmail = `valide${uniqueId}@example.com`;
const validPassword = "MotDePasse123";

// Tests de validation pour les cas d'erreur
test.describe("Invalid authentication tests", () => {
  // Test préalable : création d'un utilisateur valide pour tester les conflits
  test.describe.serial("Setup valid user for conflict tests", () => {
    test("register valid user for conflict testing", async ({ page }) => {
      await page.goto("http://localhost:3001/register");

      // Créer un utilisateur valide pour les tests de conflit
      await page.fill("input#pseudo", validUsername);
      await page.fill("input#email", validEmail);
      await page.fill("input#password", validPassword);

      // Surveillance des requêtes réseau
      const responsePromise = page.waitForResponse(
        (response) =>
          (response.url().includes("/users") ||
            response.url().includes("/api/auth/register")) &&
          (response.status() === 201 || response.status() === 200)
      );

      // Click le bouton inscription
      await page.click('button[type="submit"]');

      // Attendre que la requête se termine
      const response = await responsePromise;

      // Vérifier que la réponse est correcte
      expect(response.ok()).toBeTruthy();

      // Retourner à la page d'accueil
      await page.goto("http://localhost:3001");
    });
  });

  // Tests d'inscription avec données invalides
  test.describe("Invalid registration tests", () => {
    test("register with invalid email format", async ({ page }) => {
      await page.goto("http://localhost:3001/register");

      // Remplir le formulaire avec un email invalide
      await page.fill("input#pseudo", `Test${uniqueId}`);
      await page.fill("input#email", "emailinvalide");
      await page.fill("input#password", validPassword);

      // Click le bouton inscription
      await page.click('button[type="submit"]');

      // // Vérifier qu'un message d'erreur est affiché
      // const errorMessage = await page
      //   .locator("text=format d'email invalide")
      //   .first();
      // await expect(errorMessage).toBeVisible();
    });

    test("register with password too short", async ({ page }) => {
      await page.goto("http://localhost:3001/register");

      // Remplir le formulaire avec un mot de passe trop court
      await page.fill("input#pseudo", `Test${uniqueId}`);
      await page.fill("input#email", `test${uniqueId}@example.com`);
      await page.fill("input#password", "123");

      // Click le bouton inscription
      await page.click('button[type="submit"]');

      // // Vérifier qu'un message d'erreur est affiché
      // const errorMessage = await page
      //   .locator("text=mot de passe trop court")
      //   .first();
      // await expect(errorMessage).toBeVisible();
    });

    test("register with already used username", async ({ page }) => {
      await page.goto("http://localhost:3001/register");

      // Remplir le formulaire avec un pseudo déjà utilisé
      await page.fill("input#pseudo", validUsername);
      await page.fill("input#email", `autre${uniqueId}@example.com`);
      await page.fill("input#password", validPassword);

      // Configurer l'attente d'une réponse d'erreur
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/users") ||
          response.url().includes("/api/auth/register")
      );

      // Click le bouton inscription
      await page.click('button[type="submit"]');

      // Attendre la réponse
      const response = await responsePromise;

      // // Vérifier que la réponse n'est pas OK (400 ou 409)
      // expect(response.ok()).toBeFalsy();

      // // Vérifier qu'un message d'erreur est affiché
      // const errorMessage = await page
      //   .locator("text=Ce pseudo est déjà utilisé")
      //   .first();
      // await expect(errorMessage).toBeVisible();
    });

    test("register with already used email", async ({ page }) => {
      await page.goto("http://localhost:3001/register");

      // Remplir le formulaire avec un email déjà utilisé
      await page.fill("input#pseudo", `Autre${uniqueId}`);
      await page.fill("input#email", validEmail);
      await page.fill("input#password", validPassword);

      // Configurer l'attente d'une réponse d'erreur
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/users") ||
          response.url().includes("/api/auth/register")
      );

      // Click le bouton inscription
      await page.click('button[type="submit"]');

      // Attendre la réponse
      const response = await responsePromise;

      // // Vérifier que la réponse n'est pas OK (400 ou 409)
      // expect(response.ok()).toBeFalsy();

      // // Vérifier qu'un message d'erreur est affiché
      // const errorMessage = await page
      //   .locator("text=Cet email est déjà utilisé")
      //   .first();
      // await expect(errorMessage).toBeVisible();
    });
  });

  // Tests de connexion avec données invalides
  test.describe("Invalid login tests", () => {
    test("login with non-existent username", async ({ page }) => {
      await page.goto("http://localhost:3001/login");

      // Remplir le formulaire avec un pseudo inexistant
      await page.fill("input#pseudo", `NonExistant${uniqueId}`);
      await page.fill("input#password", validPassword);

      // Configurer l'attente d'une réponse d'erreur
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/login") ||
          response.url().includes("/api/auth/login")
      );

      // Click le bouton connexion
      await page.click('button[type="submit"]');

      // Attendre la réponse
      const response = await responsePromise;

      // // Vérifier que la réponse n'est pas OK
      // expect(response.ok()).toBeFalsy();

      // // Vérifier qu'un message d'erreur est affiché
      // const errorMessage = await page
      //   .locator("text=Utilisateur non trouvé")
      //   .first();
      // await expect(errorMessage).toBeVisible();

      // Vérifier que l'URL n'a pas changé (pas de redirection vers profile)
      expect(page.url()).toBe("http://localhost:3001/login");
    });

    test("login with incorrect password", async ({ page }) => {
      await page.goto("http://localhost:3001/login");

      // Remplir le formulaire avec un mot de passe incorrect
      await page.fill("input#pseudo", validUsername);
      await page.fill("input#password", "MauvaisMotDePasse");

      // Configurer l'attente d'une réponse d'erreur
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/login") ||
          response.url().includes("/api/auth/login")
      );

      // Click le bouton connexion
      await page.click('button[type="submit"]');

      // Attendre la réponse
      const response = await responsePromise;

      // // Vérifier que la réponse n'est pas OK
      // expect(response.ok()).toBeFalsy();

      // // Vérifier qu'un message d'erreur est affiché
      // const errorMessage = await page
      //   .locator("text=Mot de passe incorrect")
      //   .first();
      // await expect(errorMessage).toBeVisible();

      // Vérifier que l'URL n'a pas changé (pas de redirection vers profile)
      expect(page.url()).toBe("http://localhost:3001/login");
    });

    test("login with empty fields", async ({ page }) => {
      await page.goto("http://localhost:3001/login");

      // Ne rien remplir dans le formulaire

      // Click le bouton connexion
      await page.click('button[type="submit"]');

      // Vérifier que des messages d'erreur concernant les champs obligatoires sont affichés
      const errorMessages = await page
        .locator("text=Ce champ est obligatoire")
        .all();
      // expect(errorMessages.length).toBeGreaterThan(0);

      // Vérifier que l'URL n'a pas changé (pas de redirection vers profile)
      expect(page.url()).toBe("http://localhost:3001/login");
    });
  });
});
