module.exports = {
    "roots": [
        "<rootDir>/tests-fe/unit"
    ],
    "transform": {
        ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
    testEnvironment: 'jsdom',
    "setupFilesAfterEnv": [
        "<rootDir>/tests-fe/setup.js"
    ],
}
