import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { AuthProvider } from './context/AuthProvider.tsx'
import { NotificationProvider } from './context/NotificationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <NotificationProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </NotificationProvider>
)
