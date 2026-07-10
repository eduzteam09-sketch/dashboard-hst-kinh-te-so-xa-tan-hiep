# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Getting Started

To run this project locally, follow these steps:

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env` in the root directory:
```bash
cp .env.example .env
```
Open the `.env` file and enter your Google Gemini API Key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Deploying to Vercel

When deploying this project to Vercel, the Google Gemini API Key must be securely configured on the server-side to prevent exposing it to the browser:

1. **Do NOT configure `VITE_GEMINI_API_KEY` on Vercel.** Keeping it unconfigured tells the React frontend to route requests through the secure proxy serverless function.
2. In the Vercel Dashboard, go to your project **Settings** -> **Environment Variables**.
3. Add a new environment variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API Key.

