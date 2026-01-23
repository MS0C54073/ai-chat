import { test, expect } from "@playwright/test";

test("loads chat UI with threads and input", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("History", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "New" })).toBeVisible();

  await expect(page.getByPlaceholder("Send a message...")).toBeVisible();
  await expect(page.getByText("muzoGPT")).toBeVisible();
});
