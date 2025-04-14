// .storybook/preview.ts
import { setupMockApi } from '../src/__mocks__/api-mock';
import type { Preview } from '@storybook/vue3';

// Configura il mock API all'avvio
setupMockApi();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  // Usa il formato corretto per i decoratori in Vue 3 con Storybook
  decorators: [(story) => ({
    components: { story },
    template: '<story />',
  })],
};

export default preview;