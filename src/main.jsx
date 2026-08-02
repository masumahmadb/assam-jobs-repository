
import React from 'react'
import ReactDOM from 'react-dom/client'

const rootEl = document.getElementById('root')

window.addEventListener('error', (e) => {
  rootEl.innerHTML = `<pre style="white-space:pre-wrap;padding:16px;color:#900;font-family:monospace;font-size:12px;">Error:\n${e.message}\n${e.filename}:${e.lineno}</pre>`
})

async function boot() {
  try {
    const { BrowserRouter } = await import('react-router-dom')
    const { default: App } = await import('./App.jsx')
    const { AuthProvider } = await import('./contexts/AuthContext.jsx')
    const { LanguageProvider } = await import('./contexts/LanguageContext.jsx')
    await import('./index.css')

    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </React.StrictMode>
    )
  } catch (err) {
    console.error(err)
    rootEl.innerHTML = `<pre style="white-space:pre-wrap;padding:16px;color:#900;font-family:monospace;font-size:12px;">Startup Error:\n${err.message}\n\n${err.stack || ''}</pre>`
  }
}

boot()








    
      
        
    
        
      
    



































































