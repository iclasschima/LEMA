module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", // Use Node.js environment for backend tests
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"], // Look for .ts test files
  moduleFileExtensions: ["ts", "js", "json", "node"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json", // Path to your backend tsconfig.json
    },
  },
};
