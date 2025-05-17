module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', "@testing-library/jest-dom"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};
