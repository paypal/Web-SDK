/* eslint-env node */
module.exports = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/setupJest.js"]  
};
