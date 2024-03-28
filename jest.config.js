module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "json", "ts", "node"],
  transformIgnorePatterns: ["/node_modules/(?!(DEPENDENCY_NAME)/)"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "tsconfig.json",
      allowSyntheticDefaultImports: true,
    },
  },
};
