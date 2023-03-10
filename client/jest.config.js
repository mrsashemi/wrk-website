//jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    //provide path to app to load next.config.js and .env file in your test environment
    dir: './'
});;

//add any custom config to be passed to jest
// @type {import('jest').Config}
const customJestConfig = {
    // add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        //handle module aliases 
        '^@/src/pages/(.*)$': '<rootDir>/src/pages/$1',
    },
    testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);