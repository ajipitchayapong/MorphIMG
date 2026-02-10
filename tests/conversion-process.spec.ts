import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Conversion Process", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should complete full conversion and show download options", async ({
    page,
  }) => {
    // page.on("console", (msg) => console.log(`BROWSER: ${msg.text()}`));

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
    ]);

    // Verify upload success (Use 'p' to avoid matching the 'span' in config panel)
    await expect(
      page.locator("p").filter({ hasText: "test-image-1.jpg" }),
    ).toBeVisible();

    // Click Convert (matches "Convert to WEBP", "Convert to PNG", etc.)
    await page.getByRole("button", { name: /Convert/i }).click();

    // Wait for completion (using regex to ignore whitespace/newlines from source)
    // Wait for EITHER success OR error
    const successLocator = page.getByText(/Success! Conversion Complete/i);
    const errorLocator = page.getByText(/Error/i);

    // Increase timeout for slow CI environments if needed
    await Promise.race([
      successLocator.waitFor({ state: "visible", timeout: 30000 }),
      errorLocator.waitFor({ state: "visible", timeout: 30000 }),
    ]);

    if (await errorLocator.isVisible()) {
      const errorText = await errorLocator.innerText();
      throw new Error(`Conversion failed with error: ${errorText}`);
    }

    await expect(successLocator).toBeVisible();

    // Verify download buttons appear
    await expect(page.getByRole("button", { name: /Download/i })).toBeVisible();

    // Verify file status badge in list (Exact text from FileList.tsx)
    await expect(page.getByText("Done", { exact: true })).toBeVisible();
  });

  test("should reset status when settings change after completion", async ({
    page,
  }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
    ]);

    await expect(
      page.locator("p").filter({ hasText: "test-image-1.jpg" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Convert/i }).click();
    await expect(page.getByText(/Success! Conversion Complete/i)).toBeVisible({
      timeout: 20000,
    });
    await expect(page.getByText("Done", { exact: true })).toBeVisible();

    // Change format via Select component
    // 1. Click the Select Trigger (shows current format, e.g., WebP)
    await page.getByRole("combobox").click();
    // 2. Click the PNG option
    await page.getByRole("option", { name: "PNG" }).click();

    // Verify status changed back to "Pending"
    await expect(page.getByText("Pending", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Convert/i })).toBeVisible();
  });

  test("should trigger ZIP download for multiple files", async ({ page }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Select Images" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "fixtures/test-image-1.jpg"),
      path.join(__dirname, "fixtures/test-image-2.png"),
    ]);

    await page.getByRole("button", { name: /Convert/i }).click();
    await expect(page.getByText(/Success! Conversion Complete/i)).toBeVisible({
      timeout: 30000,
    });

    // Monitor download
    const downloadPromise = page.waitForEvent("download");
    // Should show "Download ZIP" for multiple files
    await page.getByRole("button", { name: "Download ZIP" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain(".zip");
  });
});
