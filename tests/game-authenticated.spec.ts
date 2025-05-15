import { test, expect } from "@playwright/test";

// Variables partagées pour les tests
const testUsername = "lallie";
const testPassword = "test1234";

// Tests d'affichage et d'interaction avec les tables qui nécessitent une authentification
test.describe.serial("Start a game", () => {
  // Cette fonction s'exécute avant chaque test pour assurer l'authentification
  test.beforeEach(async ({ page }) => {    
    // Connexion
    await page.goto("http://localhost:3001/login");
    
    // Remplir le formulaire de connexion
    await page.fill("input#pseudo", testUsername);
    await page.fill("input#password", testPassword);
    
    // Cliquer sur le bouton de connexion
    await page.click('button[type="submit"]');
    
    // Attendre la redirection vers le profil
    await page.waitForTimeout(2000);
  });
  
  test("start a game", async ({ page }) => {
    // Aller à la page des tables
    await page.goto("http://localhost:3001/tables");
    
    // Trouver le premier bouton "Rejoindre" et cliquer dessus
    const joinButton = page.getByRole("button", { name: /Rejoindre/ }).first();

    await joinButton.click();
    
    // Attendre
    await page.waitForTimeout(2000);

    // Vérifier que nous sommes sur une page de jeu
    const currentUrl = page.url();
    expect(currentUrl).toContain("game");

    // Trouver le premier bouton "Démarrer" et cliquer dessus
    const startButton = page.getByRole("button", { name: "Démarrer" });

    await startButton.click();
    
    // Attendre
    await page.waitForTimeout(2000);

    const foldButton = page.getByRole("button", { name: "Se coucher" });

    expect(foldButton).toBeVisible();
  });
});

