import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupDynamicFavicon } from './lib/favicon'

setupDynamicFavicon()

createRoot(document.getElementById("root")!).render(<App />);
