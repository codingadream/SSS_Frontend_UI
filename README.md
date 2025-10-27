# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


Project overview
This is a React + TypeScript single-page application implementing a banking/dashboard UI. The app uses Material-UI (MUI) for UI components and Firebase Authentication for email/password sign-in.
Tech stack
React (v18+) + TypeScript
Material UI (MUI)
react-router-dom for client routing
Firebase (auth)
Build: Create React App / Vite (project already scaffolded — confirm package.json)
Project layout (important files)
src/index.tsx — app entry, ReactDOM.render
App.tsx — top-level router (react-router-dom)
src/firebase/firebase.ts — firebase app and auth exports (auth, firebaseConfig)
LoginPage.tsx — login screen (current file)
HomePage.tsx — dashboard landing page (new file to add)
src/components/... — shared UI widgets (icons, PrivateRoute, header, sidebar)
Routing & navigation
Use react-router-dom BrowserRouter with routes:
"/" or "/login" → LoginPage
"/home" → HomePage (protected)
Protect /home with a simple auth check (PrivateRoute or useAuth hook reading Firebase auth state).
Authentication flow (current logic)
LoginPage collects email + password in local state.
On submit handleLogin calls Firebase signInWithEmailAndPassword(auth, email, password).
On success, currently shows alert + console.log.
Required change: after successful sign-in, navigate to /home using react-router-dom's useNavigate.
HomePage responsibilities
Serve as the landing dashboard after login.
Display user greeting (with displayName or email), account summary (total balance), quick action cards, chart placeholders, recent transactions list, and a left navigation drawer similar to screenshot.
Use responsive layout: left persistent drawer on desktop, temporary drawer on small screens.
Data & state
For now HomePage can use mocked data (or read from a /api endpoint later).
Keep wallet/accounts/transactions typed with TypeScript interfaces.
Protecting routes
Implement a PrivateRoute component or a useAuth hook that subscribes to Firebase onAuthStateChanged and blocks navigation until auth state resolved.
Testing
Unit test pages/components with React Testing Library + Jest.
Test login flow: mock Firebase auth response and ensure navigate called on success.
Run & debug
npm install
npm start (or npm run dev if Vite)
Open http://localhost:3000 (or dev port)
Deployment
Build with npm run build and deploy static build to Netlify/Vercel/Static hosting; ensure environment variables for Firebase are provided via CI secrets.
Next steps / TODO
Implement PrivateRoute and global auth context.
Replace mocked HomePage data with real endpoints or Firestore reads.
Add unit/integration tests for auth flows and dashboard rendering.
Add logout, token refresh, and role-based access if needed.