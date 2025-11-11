import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

async function bootstrap() {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  try {
    // load App dynamically to surface import/runtime errors
    const { default: App } = await import('./App');
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    // Log and show error in the page so it isn't a silent blank screen
    // eslint-disable-next-line no-console
    console.error('Failed to mount app:', err);
    rootEl.innerHTML = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial; padding:24px;">
        <h2 style="color:#b91c1c">App failed to start</h2>
        <pre style="white-space:pre-wrap;color:#111; background:#fee2e2; padding:12px; border-radius:6px;">${String(err)}</pre>
        <p>Revisa la consola para más detalles.</p>
      </div>
    `;
  }
}

bootstrap();
