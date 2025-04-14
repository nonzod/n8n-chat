// Versione semplificata di src/__mocks__/api-mock.ts

// Simula le risposte del server per il testing locale
export function setupMockApi() {
  // Salva la versione originale di fetch
  const originalFetch = window.fetch;
  
  // Sovrascrive il fetch globale
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : input.url;
    
    // Se la richiesta è per il webhook del chat
    if (url.includes('/webhook/') && url.includes('/chat')) {
      console.log('Intercepting webhook request:', { url, body: init?.body });
      
      // Simula un ritardo di rete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Determina il tipo di azione dalla richiesta
      let action = 'unknown';
      let response = {};
      
      if (init?.body) {
        try {
          if (init.body instanceof FormData) {
            // Per le richieste con files
            action = 'sendMessage';
            response = { output: "Grazie per il messaggio! Questa è una risposta simulata." };
          } else {
            // Per le richieste JSON
            const body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
            action = body.action;
            
            if (action === 'loadPreviousSession') {
              response = { data: [] }; // Sessione vuota
            } else if (action === 'sendMessage') {
              response = { output: `Risposta simulata al messaggio: "${body.chatInput}"` };
            }
          }
        } catch (e) {
          console.error('Error parsing request body:', e);
        }
      }
      
      console.log('Responding with mock data for action:', action);
      
      // Restituisce una risposta simulata
      return {
        ok: true,
        status: 200,
        json: async () => response
      } as Response;
    }
    
    // Per tutte le altre richieste, usa il fetch originale
    return originalFetch(input, init);
  };
  
  console.log('Mock API setup completed');
  
  // Funzione per ripristinare il fetch originale (non la utilizzeremo in questo caso)
  return function cleanup() {
    window.fetch = originalFetch;
    console.log('Mock API cleaned up');
  };
}