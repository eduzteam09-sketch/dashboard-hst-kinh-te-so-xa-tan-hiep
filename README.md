# Dashboard Hệ Sinh Thái Kinh Tế Số Xã Tân Hiệp

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
Open the `.env` file and enter your API keys (Google Gemini & Firebase):
```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
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

## Data Architecture

The application uses **Firebase Firestore** as its real-time database. All data that was previously hardcoded (Zones, Periodic Data, Commune Data) has been migrated to Firestore.
- **Real-time Synchronization**: The UI automatically updates across all connected clients via `onSnapshot` listeners when data is modified in Firestore.
- **Dynamic AI PDF Ingestion**: The system uses Google Gemini AI to dynamically extract both the digital transformation metrics and the **Reporting Month/Year** from uploaded PDFs. It then automatically creates a new independent reporting period in Firestore (e.g., `T08/2026`) if it doesn't exist, preventing data accumulation and allowing seamless transition to new months.
- **Security**: The database uses standard Firebase Security Rules. In development, it defaults to Test Mode. Before production deployment, strict rules based on Firebase Authentication must be implemented to prevent unauthorized write access.

## Deploying to Vercel

When deploying this project to Vercel, the Google Gemini API Key must be securely configured on the server-side to prevent exposing it to the browser:

1. **Do NOT configure `VITE_GEMINI_API_KEY` on Vercel.** Keeping it unconfigured tells the React frontend to route requests through the secure proxy serverless function.
2. In the Vercel Dashboard, go to your project **Settings** -> **Environment Variables**.
3. Add a new environment variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API Key.
4. **Configure Firebase on Vercel:** Unlike the Gemini key, Firebase requires its keys to be exposed to the frontend. Add all your `VITE_FIREBASE_*` variables directly in the Vercel Environment Variables settings exactly as they appear in your `.env` file.

