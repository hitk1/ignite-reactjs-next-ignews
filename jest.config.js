module.exports = {
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
    setupFilesAfterEnv: [
        "<rootDir>/src/tests/setupTest.ts"
    ],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },
    moduleNameMapper: {
        "\\.(scss|css|sass)$": "identity-obj-proxy"  //Faz uma "tradução" de arquivos de estilização para não gerar problemas com o jest
    },
    testEnvironment: 'jsdom'
}