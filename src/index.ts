// src/index.ts (aggiornato)
import './main.scss';

import { createApp } from 'vue';

import { defaultMountingTarget, defaultOptions } from '@n8n/chat/constants';
import { ChatPlugin } from '@n8n/chat/plugins';
import type { ChatOptions } from '@n8n/chat/types';
import { createDefaultMountingTarget } from '@n8n/chat/utils';

import App from './App.vue';

export function createChat(options?: Partial<ChatOptions>) {
  // Log per debug
  console.log('Options provided by user:', options);
  
  const resolvedOptions: ChatOptions = {
    ...defaultOptions,
    ...options,
    webhookConfig: {
      ...defaultOptions.webhookConfig,
      ...options?.webhookConfig,
    },
    i18n: {
      ...defaultOptions.i18n,
      ...options?.i18n,
      en: {
        ...defaultOptions.i18n?.en,
        ...options?.i18n?.en,
      },
    },
    theme: {
      ...defaultOptions.theme,
      ...options?.theme,
    },
    // Assicuriamoci che le nuove opzioni siano incluse
    requirePrivacyConsent: options?.requirePrivacyConsent ?? defaultOptions.requirePrivacyConsent,
    privacyPolicyUrl: options?.privacyPolicyUrl ?? defaultOptions.privacyPolicyUrl,
  };

  // Log per debug
  console.log('Resolved options:', resolvedOptions);

  const mountingTarget = resolvedOptions.target ?? defaultMountingTarget;
  if (typeof mountingTarget === 'string') {
    createDefaultMountingTarget(mountingTarget);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const app = createApp(App);
  app.use(ChatPlugin, resolvedOptions);
  app.mount(mountingTarget);
  return app;
}