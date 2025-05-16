module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	moduleFileExtensions: ['js'],
	testMatch: ['**/*.test.js'],
	verbose: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['src/**/*.js'],
};
