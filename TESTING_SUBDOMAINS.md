# Testing Subdomain Implementation

This guide explains how to test the new subdomain resolution feature locally.

## Prerequisites

- You need `sudo` access to edit your `/etc/hosts` file.
- The API server must be running on port `9999`.

## Step 1: Configure Local Domains

To simulate subdomains locally, you need to map them to `127.0.0.1` in your hosts file.

1.  Open your terminal.
2.  Edit the hosts file:
    ```bash
    sudo nano /etc/hosts
    ```
3.  Add the following lines at the bottom:
    ```
    127.0.0.1   store1.localhost
    127.0.0.1   store2.localhost
    127.0.0.1   my-test-store.localhost
    ```
4.  Save and exit (Ctrl+O, Enter, Ctrl+X).

## Step 2: Seed Data (Optional)

Ensure you have stores in your database with these subdomains.

1.  Check your database or use the admin panel to create a store.
2.  Set the subdomain to `store1` (for `store1.localhost`).
3.  Note: The system automatically handles the `.localhost` part for local testing logic if you implemented it that way, but usually the `subdomain` field in DB is just the prefix (e.g., `store1`).

## Step 3: Test API Resolution

Now you can test if the API correctly resolves the store.

1.  **Start the API server**:
    ```bash
    cd apps/api
    npm run dev
    ```

2.  **Make a Request**:
    Open a new terminal and use `curl` to test:

    ```bash
    # Test Store 1
    curl -v http://store1.localhost:9999/api/products
    ```

    **Expected Result**:
    - You should see products belonging to Store 1.
    - If you check the server logs, you might see the resolved store ID.

    ```bash
    # Test Default Store (fallback)
    curl -v http://unknown.localhost:9999/api/products
    ```

    **Expected Result**:
    - You should see products for the default store (or empty if default store has no products).

## Step 4: Test Storefront (If applicable)

If your storefront is also running locally:

1.  Start the storefront:
    ```bash
    cd apps/storefront
    npm run dev
    ```
    (Assume it runs on port 3000)

2.  Visit `http://store1.localhost:3000` in your browser.
    - Note: You might need to configure the storefront to pass the `Host` header to the API if it's doing server-side rendering.
    - If the storefront calls the API from the client (browser), the browser will send the `Origin` header, but the API request URL will be `http://localhost:9999/...`.
    - **Crucial**: For local development with separate ports (3000 vs 9999), the browser calls `localhost:9999`. The API sees `localhost:9999` as the host, NOT `store1.localhost`.
    - **Workaround**: To fully test this end-to-end with a frontend, you often need a proxy (like Nginx) or ensure your API calls use the subdomain URL (e.g., `http://store1.localhost:9999/api/...`).

    **Recommended Browser Test**:
    - Visit `http://store1.localhost:9999/api/products` directly in your browser to verify the JSON response.

## Troubleshooting

- **"Host not found"**: Did you edit `/etc/hosts`?
- **"Connection refused"**: Is the API server running?
- **Always getting default store**:
    - Check if the store exists in the DB with the correct subdomain.
    - Check the internal API route logs.
