// @ts-check
const { defineConfig } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.E2E_BASE_URL || 'http://localhost:7456/';
const defaultChromePath = 'C:\\Users\\Administrator\\Downloads\\chrome-win64\\chrome.exe';
const chromiumExecutablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (fs.existsSync(defaultChromePath) ? defaultChromePath : undefined);
const launchOptions = {
  args: ['--use-gl=swiftshader'],
  ...(chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : {})
};

module.exports = defineConfig({
  testDir: './tests/playwright',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    launchOptions
  },
  reporter: [['list']]
});
