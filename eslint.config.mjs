import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

// Les mêmes règles qu'avec ESLint 7 : eslint:recommended et l'essentiel de Vue 3, pour le navigateur et Node
export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      // ESLint 9 signale aussi les erreurs attrapées inutilisées (`catch (error) {}`) ; ESLint 7 ne le faisait pas
      'no-unused-vars': ['error', { caughtErrors: 'none' }]
    }
  }
];
