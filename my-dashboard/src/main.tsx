import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (window.location.hostname === "my-dashboard-1qh.pages.dev") {
  window.location.replace("https://sander-dashboard.no")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
