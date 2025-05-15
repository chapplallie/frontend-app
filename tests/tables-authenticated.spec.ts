import { test, expect } from "@playwright/test";

// Variables partagées pour les tests
const testUsername = "lallie";
const testPassword = "test1234";

// Tests de tables
test("display tables page", async ({ page }) => {
  await page.goto('http://localhost:3001');

  // Clic le bouton "Tables"
  await page.getByRole('button', { name: 'Tables' }).click();

  // Vérifie que l'URL est correcte
  expect(page.url()).toBe("http://localhost:3001/tables");
});

// Tests d'affichage et d'interaction avec les tables qui nécessitent une authentification
test.describe.serial("Tables with authentication", () => {
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
  
  test("join a table as authenticated user", async ({ page }) => {
    // Aller à la page des tables
    await page.goto("http://localhost:3001/tables");
    
    // Trouver le premier bouton "Rejoindre" et cliquer dessus
    const joinButton = page.getByRole("button", { name: /Rejoindre/ }).first();
    if (await joinButton.isVisible()) {
      await joinButton.click();
      
      // Attendre la redirection vers le profil
      await page.waitForTimeout(2000);

      // Vérifier que nous sommes sur une page de jeu
      const currentUrl = page.url();
      expect(currentUrl).toContain("game");

    } else {
      console.log("Aucun bouton pour rejoindre une table n'a été trouvé");
    }
  });
});

// Test pour vérifier que les actions réservées aux utilisateurs authentifiés sont protégées
test("redirect to login when trying to join a table as unauthenticated user", async ({ page }) => {
  // Aller à la page des tables
  await page.goto("http://localhost:3001/tables");
  
  // Attendre que la page soit chargée
  await page.waitForLoadState("networkidle");
  
  // Trouver le premier bouton "Rejoindre" et cliquer dessus
  const joinButton = page.getByRole("button", { name: /Rejoindre/ }).first();
  if (await joinButton.isVisible()) {
    await joinButton.click();
    
    // Vérifier que nous sommes redirigés vers la page de connexion
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toContain("login");
  } else {
    console.log("Aucun bouton pour rejoindre une table n'a été trouvé");
  }
});
