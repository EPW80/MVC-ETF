import fs from "fs";
import path from "path";
import { DataModel } from "./DataModel";

type Trade = {
  date: string;
  symbol: string;
  action: "BUY" | "SELL";
  price: number;
  amount: number;
  gainLoss: number;
  balance: number;
};

type SMAData = number | null;

type Summary = {
  totalGainLoss: number;
  percentageReturn: number;
  finalBalance: number;
};

export class TradeModel {
  static smaCrossOver(
    symbol: string,
    shortWindow: number,
    longWindow: number,
    initialBalance: number = 100000
  ) {
    const data = DataModel.getHistoricalData(symbol);
    const shortSMA: SMAData[] = [];
    const longSMA: SMAData[] = [];
    const trades: Trade[] = [];
    let balance = initialBalance;
    let position = 0;
    let totalGainLoss = 0;

    for (let i = 0; i < data.length; i++) {
      if (i >= shortWindow - 1) {
        const shortSum = data
          .slice(i - shortWindow + 1, i + 1)
          .reduce((acc: number, val: { close: number }) => acc + val.close, 0);
        shortSMA.push(shortSum / shortWindow);
      } else {
        shortSMA.push(null);
      }

      if (i >= longWindow - 1) {
        const longSum = data
          .slice(i - longWindow + 1, i + 1)
          .reduce((acc: number, val: { close: number }) => acc + val.close, 0);
        longSMA.push(longSum / longWindow);
      } else {
        longSMA.push(null);
      }

      if (shortSMA[i] !== null && longSMA[i] !== null) {
        if (shortSMA[i]! > longSMA[i]! && position === 0) {
          position = balance / data[i].close;
          balance = 0;
          trades.push({
            date: data[i].date,
            symbol: symbol,
            action: "BUY",
            price: data[i].close,
            amount: position,
            gainLoss: 0,
            balance: balance,
          });
        } else if (shortSMA[i]! < longSMA[i]! && position > 0) {
          const gainLoss =
            position * (data[i].close - trades[trades.length - 1].price);
          balance = position * data[i].close;
          totalGainLoss += gainLoss;
          trades.push({
            date: data[i].date,
            symbol: symbol,
            action: "SELL",
            price: data[i].close,
            amount: 0,
            gainLoss: gainLoss,
            balance: balance,
          });
          position = 0;
        }
      }
    }

    const summary: Summary = {
      totalGainLoss: totalGainLoss,
      percentageReturn: ((balance - initialBalance) / initialBalance) * 100,
      finalBalance: balance,
    };

    // Generate CSV log
    const csvHeader = "Date,Symbol,Action,Price,Amount,Gain/Loss,Balance\n";
    const csvRows = trades
      .map(
        (trade) =>
          `${trade.date},${trade.symbol},${trade.action},${trade.price},${trade.amount},${trade.gainLoss},${trade.balance}`
      )
      .join("\n");
    const csvSummary = `\nSummary,,Total Gain/Loss,,Percentage Return,Current Balance\n,,${
      summary.totalGainLoss
    },,${summary.percentageReturn.toFixed(2)}%,${summary.finalBalance}\n`;
    const csvContent = csvHeader + csvRows + csvSummary;

    // Ensure the logs directory exists
    const logsDir = path.resolve(__dirname, "../../logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    fs.writeFileSync(`${logsDir}/${symbol}_trades.csv`, csvContent);
    return trades;
  }
}
