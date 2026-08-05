module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.vue$': '@vue/vue3-jest', '^.+\\.(t|j)sx?$': 'ts-jest' },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
};
