/**
 * Configuration Jest pour le backend EduKaay
 *
 * - Environnement Node.js (pas de DOM)
 * - Fichiers de tests dans le dossier tests/
 * - Couverture de code sur les controllers, middleware et services
 * - Seuils minimaux de couverture pour proteger les regressions
 */
module.exports = {
  testEnvironment: 'node',

  /** Detecte les fichiers de test dans le dossier tests/ */
  testMatch: ['**/tests/**/*.test.js'],

  /** Fichiers inclus dans le rapport de couverture */
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'services/**/*.js',
    '!**/node_modules/**',
  ],

  /**
   * Seuils minimaux de couverture.
   * En dessous de ces seuils, le pipeline CI echoue.
   */
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 65,
      lines: 65,
      statements: 65,
    },
  },

  /** Timeout par test : 10 secondes */
  testTimeout: 10000,

  /**
   * Supprime les console.error attendus dans les tests de services
   * (erreurs simulees par les mocks Axios)
   */
  silent: false,
};
