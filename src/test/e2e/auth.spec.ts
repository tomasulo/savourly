import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto("/en");
  });

  test("should navigate to register page from navigation", async ({ page }) => {
    await page.click('text="Register"');
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator("h1")).toContainText("Create account");
  });

  test("should navigate to login page from navigation", async ({ page }) => {
    await page.click('text="Log in"');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("h1")).toContainText("Welcome back");
  });

  test("should show validation error for password mismatch on register", async ({
    page,
  }) => {
    await page.goto("/en/register");

    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");

    const inputs = await page.locator('input[type="password"]').all();
    await inputs[1].fill("differentpassword");

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Passwords do not match")).toBeVisible();
  });

  test("should redirect to login when accessing protected route without auth", async ({
    page,
  }) => {
    await page.goto("/en/recipes/new");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should navigate between login and register pages", async ({ page }) => {
    await page.goto("/en/login");
    await page.click('text="Register"');
    await expect(page).toHaveURL(/\/register/);

    await page.click('text="Log in"');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Authenticated User Flow", () => {
  test("should allow user to register, create recipe, and logout", async ({
    page,
  }) => {
    // Register a new user
    await page.goto("/en/register");

    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;

    await page.fill('input[type="email"]', testEmail);
    const passwordInputs = await page.locator('input[type="password"]').all();
    await passwordInputs[0].fill("testpassword123");
    await passwordInputs[1].fill("testpassword123");

    await page.click('button[type="submit"]');

    // Should redirect to recipes page after successful registration
    await expect(page).toHaveURL(/\/recipes/, { timeout: 10000 });

    // Navigate to create a new recipe
    await page.goto("/en/recipes/new");

    // Fill out the recipe form
    await page.fill('input[name="title"]', "Test Recipe");
    await page.fill('textarea[name="description"]', "A test recipe");

    // Add an ingredient
    await page.fill('input[name="ingredient_name"]', "Test Ingredient");

    // Add an instruction
    await page.fill('textarea[name="instruction"]', "Test instruction");

    // Submit the form
    await page.click('button[type="submit"]');

    // Should redirect to the recipe detail page
    await expect(page.locator("h1")).toContainText("Test Recipe", {
      timeout: 10000,
    });

    // Logout
    await page.click('text="Log out"');

    // Should show login/register buttons again
    await expect(page.locator('text="Log in"')).toBeVisible();
  });
});
