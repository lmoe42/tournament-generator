import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,  // Enables Jest-like global functions like describe, it, expect
    environment: 'node',  // Use Node environment for running tests
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],  // Adjust to include all your test files
  },
});