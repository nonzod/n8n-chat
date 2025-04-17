// src/utils/cookie.ts
export const PRIVACY_CONSENT_COOKIE = 'n8n-chat-privacy-consent';

/**
 * Imposta un cookie con un nome, valore e scadenza
 * @param name Nome del cookie
 * @param value Valore del cookie
 * @param days Giorni di validità del cookie
 */
export function setCookie(name: string, value: string, days = 7): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

/**
 * Ottiene il valore di un cookie
 * @param name Nome del cookie
 * @returns Valore del cookie o stringa vuota se non esiste
 */
export function getCookie(name: string): string {
  const nameEq = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
  }
  return '';
}

/**
 * Controlla se il consenso alla privacy è stato già dato
 * @returns true se il consenso è stato dato, false altrimenti
 */
export function hasPrivacyConsent(): boolean {
  return getCookie(PRIVACY_CONSENT_COOKIE) === 'true';
}

/**
 * Salva il consenso alla privacy in un cookie
 */
export function savePrivacyConsent(): void {
  setCookie(PRIVACY_CONSENT_COOKIE, 'true', 7);
}