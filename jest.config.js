module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  transform: {
    '^.+\\.[jt]s$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }]
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'core/server.js',
    'middleware/alumno-validator.middleware.js',
    'models/alumno.model.ts',
    'models/persona.model.ts'
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      functions: 90
    }
  }
}
