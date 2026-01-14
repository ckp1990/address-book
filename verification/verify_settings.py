from playwright.sync_api import sync_playwright, expect

def test_settings_modal(page):
    # 1. Login
    page.goto("http://localhost:5173/address-book/")

    # Fill username
    # Placeholder from Login.jsx: "admin or user"
    page.get_by_placeholder("admin or user").fill("user")

    # Fill password
    # Placeholder from Login.jsx: "••••••••"
    # But checking by label might be safer if characters are special.
    # Label is "Password".
    page.get_by_label("Password").fill("CWS$2025")

    # Click Login
    page.get_by_role("button", name="Sign in").click()

    # Expect to see the main app (e.g. "Search contacts...")
    expect(page.get_by_placeholder("Search contacts...")).to_be_visible()

    # 2. Open Settings
    # Clicking the button with the Settings icon.
    page.locator("button:has(svg.lucide-settings)").first.click()

    # 3. Verify Modal Open
    expect(page.get_by_text("Database Settings")).to_be_visible()

    # 4. Check Config Tab
    expect(page.get_by_text("Enter your Firebase Project configuration.")).to_be_visible()
    expect(page.get_by_text("API Key *")).to_be_visible()

    # 5. Check Migration Tab
    page.get_by_text("Migration Tool").click()
    expect(page.get_by_text("Old Supabase URL")).to_be_visible()

    # 6. Screenshot
    page.screenshot(path="verification/settings_migration.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_settings_modal(page)
            print("Test passed!")
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
