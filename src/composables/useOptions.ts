// src/composables/useOptions.ts (debug)
import { inject } from 'vue';

import { ChatOptionsSymbol } from '@n8n/chat/constants';
import type { ChatOptions } from '@n8n/chat/types';

export function useOptions() {
  const options = inject(ChatOptionsSymbol) as ChatOptions;
  
  // Log per debug
  console.log('useOptions accessing options:', options);
  
  return {
    options,
  };
}