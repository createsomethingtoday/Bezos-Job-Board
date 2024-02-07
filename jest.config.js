module.exports = {
    testEnvironment: 'node',
    transform: {
      // Use SWC for both TypeScript and JavaScript files
      '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  