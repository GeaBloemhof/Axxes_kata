module.exports = {
  preset: 'ts-jest',
  testMatch: ["**/*.spec.ts"],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  }
};