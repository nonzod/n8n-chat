<script setup lang="ts">
import Button from '@n8n/chat/components/Button.vue';
import { useI18n } from '@n8n/chat/composables';
import { useOptions } from '@n8n/chat/composables';
import { ref, computed } from 'vue';

const { t, te } = useI18n();
const { options } = useOptions();

const privacyAccepted = ref(false);

// Controlla se è richiesta l'accettazione della privacy policy
const requirePrivacyConsent = computed(() => options.requirePrivacyConsent === true);

// Emette l'evento di click solo se la privacy è stata accettata o non è richiesta
function handleButtonClick() {
  if (!requirePrivacyConsent.value || privacyAccepted.value) {
    emit('click:button');
  }
}

const emit = defineEmits<{
  'click:button': [];
}>();
</script>

<template>
  <div class="chat-get-started">
    <div class="chat-privacy-consent">
      <label class="chat-privacy-label">
        <input
          type="checkbox"
          v-model="privacyAccepted"
          class="chat-privacy-checkbox"
        />
        <span v-if="te('privacyText')" v-html="t('privacyText')"></span>
        <span v-else>
          I accept the 
          <a 
            :href="options.privacyPolicyUrl || '#'"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy policy
          </a>
        </span>
      </label>
    </div>
    
    <Button 
      @click="handleButtonClick"
      :class="{ 'chat-button-disabled': requirePrivacyConsent && !privacyAccepted }"
      :disabled="requirePrivacyConsent && !privacyAccepted"
    >
      {{ t('getStarted') }}
    </Button>
  </div>
</template>

<style lang="scss">
.chat-get-started {
  padding-top: var(--chat--spacing);
  padding-bottom: var(--chat--spacing);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 1rem;
}

.chat-privacy-consent {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--chat--color-dark);
  max-width: 80%;
  text-align: center;
}

.chat-privacy-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.chat-privacy-checkbox {
  margin-top: 0.25rem;
}

.chat-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-privacy-label a {
  color: var(--chat--color-primary);
  text-decoration: underline;
}
</style>