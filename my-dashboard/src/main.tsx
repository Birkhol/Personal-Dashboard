import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const redirectUrl = import.meta.env.DOMAIN_REDIRECT_URL

if (window.location.hostname === redirectUrl) {
  window.location.replace("https://sander-dashboard.no")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
