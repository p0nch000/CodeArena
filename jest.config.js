const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 👈 Aquí ajustamos el alias @
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  testEnvironment: 'node',
};

module.exports = createJestConfig(customJestConfig);

