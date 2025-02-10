require('dotenv').config();

const currency = {
  name: process.env.POINTS_NAME || 'pizza', // Default currency name
  symbol: process.env.POINTS_SYMBOL || '🍕', // Default symbol
  helpCommand: process.env.HELP_COMMAND || 'help' // Default help command
};

function formatCurrency(amount) {
  return `${amount} ${currency.symbol}`;
}

module.exports = { currency, formatCurrency };
