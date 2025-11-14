This project uses `npm workspaces` to manage a monorepo containing:
- `packages/client`: The React (Vite) frontend.
- `packages/server`: The Node.js (Apollo GraphQL) backend.
- `packages/common`: Shared TypeScript types for both `client` and `server`.

## Requirements

- Node.js (v18+)
- npm (v7+ , required for workspaces)

## Running in Development Mode

1.  **Install Dependencies:**
    From the root `FORMAPP` folder, run:
    ```bash
    npm install
    ```
    (This command will install dependencies for *all* packages at once).

2.  **Run the Project:**
    From the root `FORMAPP` folder, run:
    ```bash
    npm run dev
    ```
    This command will simultaneously run:
    - `packages/common` in `--watch` mode.
    - `packages/server` (dev server).
    - `packages/client` (Vite dev server).

## Access

- **Client (React):** `http://localhost:5173/` (or port shown by Vite)
- **Server (GraphQL):** `http://localhost:4000/` (Apollo Studio)