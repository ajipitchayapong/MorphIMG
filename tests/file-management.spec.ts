import { test, expect } from "@playwright/test";
import path from "path";

test.describe("File Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should upload multiple images and show them in the list", async ({
    page,
  }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
      path.join(__dirname, "fixtures/test-image-2.png"),
    ]);

    // Verify files appear in the list using 'p' tag to be specific
    await expect(
      page.locator("p").filter({ hasText: "test-image-1.jpg" }),
    ).toBeVisible();
    await expect(
      page.locator("p").filter({ hasText: "test-image-2.png" }),
    ).toBeVisible();

    // Check if the total count in FileList header is updated
    await expect(page.getByText(/2 images ready/i)).toBeVisible();
  });

  test("should remove a file from the list", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
    ]);

    await expect(
      page.locator("p").filter({ hasText: "test-image-1.jpg" }),
    ).toBeVisible();

    // Click remove button (the 'X' button in FileList)
    // Find the container that has the filename, then find the button with X icon inside it
    await page
      .locator("div")
      .filter({ has: page.locator("p", { hasText: "test-image-1.jpg" }) })
      .locator("button")
      .filter({ has: page.locator("svg.lucide-x") })
      .click();

    await expect(
      page.locator("p").filter({ hasText: "test-image-1.jpg" }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Select Images" }),
    ).toBeVisible();
  });

  test("should clear all files", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
      path.join(__dirname, "fixtures/test-image-2.png"),
    ]);

    // Clear all button in FileList header
    await page.getByRole("button", { name: /Clear all/i }).click();

    await expect(page.getByText("test-image-1.jpg")).not.toBeVisible();
    await expect(page.getByText("test-image-2.png")).not.toBeVisible();
  });
});
