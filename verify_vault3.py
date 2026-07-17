import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 800})

        print("Navigating to dashboard...")
        await page.goto("http://localhost:5173")
        await page.wait_for_load_state("networkidle")

        print("Injecting mock local storage data...")
        await page.evaluate("""() => {
            const mockDocs = [
                {
                    id: "12345",
                    templateId: "statutory-notice",
                    title: "STATUTORY_DEMAND_NOTICE",
                    content: "LEGAL NOTICE From: John Doe 123 Street To: Corp Inc. Subject: Unpaid Dues.",
                    timestamp: "2026-07-17T12:00:00Z"
                }
            ];
            window.localStorage.setItem('justice_ai_documents', JSON.stringify(mockDocs));
        }""")

        print("Navigating to documents page...")
        await page.goto("http://localhost:5173/documents")
        await page.wait_for_load_state("networkidle")

        print("Waiting for vault to render...")
        await page.wait_for_selector("text=SECURE_VAULT", timeout=5000)

        # Take screenshot
        screenshot_path = "/home/jules/verification/document_vault3.png"
        await page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
