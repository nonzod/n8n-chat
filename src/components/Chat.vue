<script setup lang="ts">
import Close from 'virtual:icons/mdi/close';
import { computed, nextTick, onMounted } from 'vue';

import GetStarted from '@n8n/chat/components/GetStarted.vue';
import GetStartedFooter from '@n8n/chat/components/GetStartedFooter.vue';
import Input from '@n8n/chat/components/Input.vue';
import Layout from '@n8n/chat/components/Layout.vue';
import MessagesList from '@n8n/chat/components/MessagesList.vue';
import { useI18n, useChat, useOptions } from '@n8n/chat/composables';
import { chatEventBus } from '@n8n/chat/event-buses';
import { hasPrivacyConsent } from '@n8n/chat/utils';

const { t } = useI18n();
const chatStore = useChat();

const { messages, currentSessionId } = chatStore;
const { options } = useOptions();

const showCloseButton = computed(() => options.mode === 'window' && options.showWindowCloseButton);

// Controlla se deve mostrare la schermata di benvenuto
const showWelcomeScreen = computed(() => {
  // Se l'utente ha già fornito il consenso alla privacy, non mostrare mai la schermata di benvenuto
  if (hasPrivacyConsent()) {
    return false;
  }
  
  // Se non è richiesto il consenso alla privacy, rispetta l'impostazione options.showWelcomeScreen
  if (!options.requirePrivacyConsent) {
    return !currentSessionId.value && options.showWelcomeScreen;
  }
  
  // Se è richiesto il consenso e l'utente non l'ha ancora fornito,
  // mostra sempre la schermata di benvenuto per chiedere il consenso
  return !currentSessionId.value;
});

async function getStarted() {
  if (!chatStore.startNewSession) {
    return;
  }
  void chatStore.startNewSession();
  void nextTick(() => {
    chatEventBus.emit('scrollToBottom');
  });
}

async function initialize() {
  if (!chatStore.loadPreviousSession) {
    return;
  }
  await chatStore.loadPreviousSession();
  void nextTick(() => {
    chatEventBus.emit('scrollToBottom');
  });
}

function closeChat() {
  chatEventBus.emit('close');
}

onMounted(async () => {
  await initialize();
  
  // Se esiste già il cookie di consenso alla privacy, avvia automaticamente una nuova sessione
  // anche se showWelcomeScreen è true
  if (!currentSessionId.value && hasPrivacyConsent()) {
    await getStarted();
  }
  // Altrimenti, segui il comportamento standard
  else if (!options.showWelcomeScreen && !currentSessionId.value && 
      (!options.requirePrivacyConsent || hasPrivacyConsent())) {
    await getStarted();
  }
});
</script>

<template>
  <Layout class="chat-wrapper">
    <template #header>
      <div class="chat-heading">
        <h1>
          {{ t('title') }}
        </h1>
        <button
          v-if="showCloseButton"
          class="chat-close-button"
          :title="t('closeButtonTooltip')"
          @click="closeChat"
        >
          <Close height="18" width="18" />
        </button>
      </div>
      <p v-if="t('subtitle')">{{ t('subtitle') }}</p>
    </template>
    <GetStarted v-if="showWelcomeScreen" @click:button="getStarted" />
    <MessagesList v-else :messages="messages" />
    <template #footer>
      <Input v-if="currentSessionId" />
      <GetStartedFooter v-else />
    </template>
  </Layout>
</template>

<style lang="scss">
.chat-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-close-button {
  display: flex;
  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    color: var(--chat--close--button--color-hover, var(--chat--color-primary));
  }
}
</style>