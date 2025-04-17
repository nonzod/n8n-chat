// Aggiungi questo al file src/__stories__/App.stories.ts

import type { StoryObj, Meta } from '@storybook/vue3';
import { onMounted } from 'vue';

import { createChat } from '@n8n/chat/index';
import type { ChatOptions } from '@n8n/chat/types';

const meta: Meta = {
  title: 'Chat/Privacy',
  parameters: {
    layout: 'fullscreen',
  },
  render: (args: Partial<ChatOptions>) => ({
    setup() {
      onMounted(() => {
        createChat(args);
      });

      return {};
    },
    template: '<div id="n8n-chat" style="height: 100vh;" />',
  }),
  tags: ['autodocs'],
};

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;

export const WithPrivacyConsent: Story = {
  name: 'With Privacy Consent',
  args: {
    webhookUrl: 'http://localhost:5678/webhook/f406671e-c954-4691-b39a-66c90aa2f103/chat',
    mode: 'window',
    showWelcomeScreen: true,  // Importante per mostrare la schermata di benvenuto
    requirePrivacyConsent: true,
    privacyPolicyUrl: 'https://example.com/privacy',
    i18n: {
      en: {
        title: 'Test Chat with Privacy',
        subtitle: 'This is a test chat with privacy consent',
        getStarted: 'Start Chat',
        privacyText: 'I accept the <a href="https://example.com/privacy" target="_blank">privacy policy</a> and <a href="https://example.com/terms" target="_blank">terms of service</a>'
      }
    }
  }
};

// Versione senza richiesta di consenso alla privacy per confronto
export const WithoutPrivacyConsent: Story = {
  name: 'Without Privacy Consent',
  args: {
    webhookUrl: 'http://localhost:5678/webhook/f406671e-c954-4691-b39a-66c90aa2f103/chat',
    mode: 'window',
    showWelcomeScreen: true,
    requirePrivacyConsent: false,
    i18n: {
      en: {
        title: 'Test Chat without Privacy',
        subtitle: 'This is a test chat without privacy consent',
        getStarted: 'Start Chat'
      }
    }
  }
};