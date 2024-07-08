import fs from "fs";
import { DataModel } from "./DataModel";

type Trade = {
  date: string;
  symbol: string;
  action: string;
  price: number;
  amount: number;
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
    initialBalance: number
  ) {
    const data = DataModel.getHistoricalData(symbol);
    const shortSMA: SMAData[] = [];
    const longSMA: SMAData[] = [];
    const trades: (Trade | Summary)[] = [];
    let balance = initialBalance;
    let position = 0;

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
            balance: balance,
          });
        } else if (shortSMA[i]! < longSMA[i]! && position > 0) {
          balance = position * data[i].close;
          position = 0;
          trades.push({
            date: data[i].date,
            symbol: symbol,
            action: "SELL",
            price: data[i].close,
            amount: position,
            balance: balance,
          });
        }
      }
    }

    const summary: Summary = {
      totalGainLoss: balance - initialBalance,
      percentageReturn: ((balance - initialBalance) / initialBalance) * 100,
      finalBalance: balance,
    };

    trades.push(summary);
    fs.writeFileSync(
      `./trades/${symbol}_trades.csv`,
      trades.map((trade) => Object.values(trade).join(",")).join("\n")
    );
    return trades;
  }
}
