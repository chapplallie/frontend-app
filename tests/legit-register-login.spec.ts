import { test, expect } from "@playwright/test";

// todo : variable localhost (redux)

// Définition des variables en dehors des tests pour les partager
const uniqueId = Date.now();
const testUsername = `Bernard${uniqueId}`;
const testEmail = `beber${uniqueId}@OM.jtm`;

// Tests généraux qui ne dépendent pas de l'état
test("has title", async ({ page }) => {
  await page.goto("http://localhost:3001");

  // Vérifie que le titre de la page contient "Frontend App"
  await expect(page).toHaveTitle(/Frontend App/);
});

// Tests d'authentification qui doivent s'exécuter en séquence
test.describe.serial("Authentication flow", () => {
  test("get registration link", async ({ page }) => {
    await page.goto("http://localhost:3001");

    // Clic sur le lien "Inscription"
    await page.getByRole("button", { name: "Inscription" }).click();

    // Vérifie que la page a un en-tête avec le nom "Inscription"
    await expect(
      page.getByRole("heading", { name: "Inscription" })
    ).toBeVisible();
  });

  test("register with valid credentials", async ({ page }) => {
    await page.goto("http://localhost:3001/register");

    // Remplir le formulaire d'inscription
    await page.fill("input#pseudo", testUsername);
    await page.fill("input#email", testEmail);
    await page.fill("input#password", "Argent");

    // Surveillance des requêtes réseau - mettre en place avant de cliquer sur le bouton
    const responsePromise = page.waitForResponse(
      (response) => 
        (response.url().includes("/users") || response.url().includes("/api/auth/register")) && 
        (response.status() === 201 || response.status() === 200)
    );

    // Click le bouton inscription
    await page.click('button[type="submit"]');

    // Attendre que la requête se termine
    const response = await responsePromise;

    // Vérifier que la réponse est correcte
    expect(response.ok()).toBeTruthy();
  });

  test("get connexion link", async ({ page }) => {
    await page.goto("http://localhost:3001");

    // Clic sur le lien "Connexion"
    await page.getByRole("button", { name: "Connexion" }).click();

    // Vérifie que la page a un en-tête avec le nom "Connexion"
    await expect(
      page.getByRole("heading", { name: "Connexion" })
    ).toBeVisible();
  });

  test("login with valid credentials", async ({ page }) => {
    await page.goto("http://localhost:3001/login");

    // Remplir le formulaire de connexion
    await page.fill("input#pseudo", testUsername);
    await page.fill("input#password", "Argent");

    // Clic sur le bouton de connexion
    await page.click('button[type="submit"]');

    // Attendre que la page se redirige vers le profil
    await page.waitForURL("http://localhost:3001/profile");

    // Vérifie que l'URL est correcte
    expect(page.url()).toBe("http://localhost:3001/profile");
  });
});

