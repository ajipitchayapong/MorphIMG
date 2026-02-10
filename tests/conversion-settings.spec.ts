import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Conversion Settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should allow changing global quality", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
    ]);

    // Open settings if needed (assuming it might be collapsed or in a different tab)
    await page.getByRole("tab", { name: "Convert" }).click();

    const qualitySlider = page.getByRole("slider");
    await qualitySlider.fill("50");

    // Verify individual file settings or store update
    await expect(page.getByText("50%")).toBeVisible();
  });

  test("should change output format in batch mode", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
      path.join(__dirname, "fixtures/test-image-2.png"),
    ]);

    // Change format via Select component
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "PNG" }).click();

    // Verify all files in list show 'png' extension badge
    const pngBadges = page.getByText("png", { exact: true });
    await expect(pngBadges).toHaveCount(2);
  });

  test("should toggle individual file settings", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
      path.join(__dirname, "fixtures/test-image-2.png"),
    ]);

    // Click the first file to select it individually
    await page.getByText("test-image-1.jpg").click();

    // Verify settings panel header or indicator shows the file name
    await expect(page.locator("aside, .col-span-1")).toContainText(
      "test-image-1.jpg",
    );

    // Change quality for this file only
    await page.getByRole("tab", { name: "Convert" }).click();
    await page.getByRole("slider").fill("30");

    // Click the second file
    await page.getByText("test-image-2.png").click();
    // Second file should still have default (85%)
    await expect(page.getByText("85%")).toBeVisible();

    // First file should still have 30%
    await page.getByText("test-image-1.jpg").click();
    await expect(page.getByText("30%")).toBeVisible();
  });
});
