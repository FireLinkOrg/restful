export default {
    preset: 'ts-jest',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    transform: {
      "^.+\\.(ts|tsx)?$": "ts-jest"
    }
  };