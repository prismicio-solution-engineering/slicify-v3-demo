import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Helper — fails the test and prints a readable violation summary
async function expectNoViolations(page: any, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  if (results.violations.length > 0) {
    const summary = results.violations
      .map(
        (v) =>
          `\n[${v.impact?.toUpperCase()}] ${v.id} — ${v.description}\n` +
          `  WCAG: ${v.tags.filter((t) => t.startsWith("wcag")).join(", ")}\n` +
          `  Elements affected: ${v.nodes.length}\n` +
          `  Fix: ${v.nodes[0]?.failureSummary?.split("\n")[0]}`
      )
      .join("\n");
    console.log(`\n=== Accessibility violations on ${label} ===\n${summary}`);
  }

  expect(
    results.violations,
    `Found ${results.violations.length} WCAG violation(s) on ${label}`
  ).toHaveLength(0);
}

test.describe("Accessibility — WCAG 2.1 AA", () => {
  test("Homepage has no violations", async ({ page }) => {
    await page.goto("http://localhost:3000/en-us");
    await expectNoViolations(page, "Homepage /en-us");
  });

  test("Slice library has no violations", async ({ page }) => {
    await page.goto("http://localhost:3000/slice-library");
    await expectNoViolations(page, "Slice library");
  });

  test("Keyboard navigation — homepage is fully navigable", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/en-us");
    // Tab through the first 15 interactive elements — none should get stuck
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
    }
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement).not.toBe("BODY"); // focus moved — keyboard works
  });

  test("All images have alt text", async ({ page }) => {
    await page.goto("http://localhost:3000/en-us");
    const imagesWithoutAlt = await page.$$eval("img", (imgs) =>
      imgs
        .filter(
          (img) => !img.getAttribute("alt") && img.getAttribute("alt") !== ""
        )
        .map((img) => img.src)
    );
    expect(
      imagesWithoutAlt,
      `Images missing alt attribute: ${imagesWithoutAlt.join(", ")}`
    ).toHaveLength(0);
  });

  test("Page has a unique, descriptive title", async ({ page }) => {
    await page.goto("http://localhost:3000/en-us");
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
    expect(title).not.toBe("Slicify"); // too generic
  });

  test("HTML lang attribute is set", async ({ page }) => {
    await page.goto("http://localhost:3000/en-us");
    const lang = await page.$eval("html", (el) => el.getAttribute("lang"));
    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^[a-z]{2}/); // at least 'en', 'fr', etc.
  });
});
