import { TradeModel } from './models/TradeModel';

async function runBacktest(symbols: string[]) {
  const shortWindow = 50;
  const longWindow = 200;
  const initialBalance = 100000;

  symbols.forEach(symbol => {
    const trades = TradeModel.smaCrossOver(symbol, shortWindow, longWindow, initialBalance);
    console.log(`Backtesting complete for ${symbol}. Trades:`, trades);
  });
}

// Add more symbols as needed
runBacktest(['SOXL', 'SOXS']);
