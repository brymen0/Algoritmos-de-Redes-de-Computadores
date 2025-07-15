import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GraphProvider } from './context/GraphContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GraphProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </GraphProvider>
)
