// src/plugins/chat.ts
import { v4 as uuidv4 } from 'uuid';
import type { Plugin } from 'vue';
import { computed, nextTick, ref } from 'vue';

import * as api from '@n8n/chat/api';
import { ChatOptionsSymbol, ChatSymbol, localStorageSessionIdKey } from '@n8n/chat/constants';
import { chatEventBus } from '@n8n/chat/event-buses';
import type { ChatMessage, ChatOptions } from '@n8n/chat/types';
import { hasPrivacyConsent } from '@n8n/chat/utils';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ChatPlugin: Plugin<ChatOptions> = {
  install(app, options) {
    // Log per debug
    console.log('ChatPlugin received options:', options);
    
    // Controlla se il consenso alla privacy è già stato fornito
    // e imposta requirePrivacyConsent a false se il cookie è presente
    if (options.requirePrivacyConsent && hasPrivacyConsent()) {
      console.log('Privacy consent already given, skipping consent request');
      options.requirePrivacyConsent = false;
    }
    
    app.provide(ChatOptionsSymbol, options);

    const messages = ref<ChatMessage[]>([]);
    const currentSessionId = ref<string | null>(null);
    const waitingForResponse = ref(false);

    const initialMessages = computed<ChatMessage[]>(() =>
      (options.initialMessages ?? []).map((text) => ({
        id: uuidv4(),
        text,
        sender: 'bot',
        createdAt: new Date().toISOString(),
      })),
    );

    async function sendMessage(text: string, files: File[] = []) {
      const sentMessage: ChatMessage = {
        id: uuidv4(),
        text,
        sender: 'user',
        files,
        createdAt: new Date().toISOString(),
      };

      messages.value.push(sentMessage);
      waitingForResponse.value = true;

      void nextTick(() => {
        chatEventBus.emit('scrollToBottom');
      });

      const sendMessageResponse = await api.sendMessage(
        text,
        files,
        currentSessionId.value as string,
        options,
      );

      let textMessage = sendMessageResponse.output ?? sendMessageResponse.text ?? '';

      if (textMessage === '' && Object.keys(sendMessageResponse).length > 0) {
        try {
          textMessage = JSON.stringify(sendMessageResponse, null, 2);
        } catch (e) {
          // Failed to stringify the object so fallback to empty string
        }
      }

      const receivedMessage: ChatMessage = {
        id: uuidv4(),
        text: textMessage,
        sender: 'bot',
        createdAt: new Date().toISOString(),
      };
      messages.value.push(receivedMessage);

      waitingForResponse.value = false;

      void nextTick(() => {
        chatEventBus.emit('scrollToBottom');
      });
    }

    async function loadPreviousSession() {
      if (!options.loadPreviousSession) {
        return;
      }

      const sessionId = localStorage.getItem(localStorageSessionIdKey) ?? uuidv4();
      const previousMessagesResponse = await api.loadPreviousSession(sessionId, options);
      const timestamp = new Date().toISOString();

      messages.value = (previousMessagesResponse?.data || []).map((message, index) => ({
        id: `${index}`,
        text: message.kwargs.content,
        sender: message.id.includes('HumanMessage') ? 'user' : 'bot',
        createdAt: timestamp,
      }));

      if (messages.value.length) {
        currentSessionId.value = sessionId;
      }

      return sessionId;
    }

    async function startNewSession() {
      currentSessionId.value = uuidv4();

      localStorage.setItem(localStorageSessionIdKey, currentSessionId.value);
    }

    const chatStore = {
      initialMessages,
      messages,
      currentSessionId,
      waitingForResponse,
      loadPreviousSession,
      startNewSession,
      sendMessage,
    };

    app.provide(ChatSymbol, chatStore);
    app.config.globalProperties.$chat = chatStore;
  },
};