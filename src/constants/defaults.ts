import type { ChatOptions } from '@n8n/chat/types';

export const defaultOptions: ChatOptions = {
  webhookUrl: 'http://localhost:5678',
  webhookConfig: {
    method: 'POST',
    headers: {},
  },
  target: '#n8n-chat',
  mode: 'window',
  loadPreviousSession: true,
  chatInputKey: 'chatInput',
  chatSessionKey: 'sessionId',
  defaultLanguage: 'en',
  showWelcomeScreen: false,
  initialMessages: [],
  i18n: {
		it: {
      title: 'Ciao! 👋',
      subtitle: "Come posso aiutarti?",
      footer: '',
      getStarted: 'Inizia conversazione',
      inputPlaceholder: 'Scrivi la tua domanda..',
      closeButtonTooltip: 'Chiudi chat',
      privacyText: 'Ho letto e accetto la <a href="#" target="_blank" rel="noopener noreferrer">privacy policy</a>',
    },
    en: {
      title: 'Hi there! 👋',
      subtitle: "Start a chat. We're here to help you 24/7.",
      footer: '',
      getStarted: 'New Conversation',
      inputPlaceholder: 'Type your question..',
      closeButtonTooltip: 'Close chat',
      privacyText: 'I accept the <a href="#" target="_blank" rel="noopener noreferrer">privacy policy</a>',
    },
  },
  theme: {},
  requirePrivacyConsent: true,
  privacyPolicyUrl: 'https://tourtools.office.tourtools.eu/privacy-policy',
};

export const defaultMountingTarget = '#n8n-chat';