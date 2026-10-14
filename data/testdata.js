// testdata.js
const currentDate = () => new Date().toISOString().split('T')[0];

module.exports = {
   currentDate: new Date().toLocaleDateString('en-US', { minIntegerDigits: 2 })
};

console.log(`Current date: ${currentDate()}`);