import yahooFinance from "yahoo-finance2";
import fs from "fs";
import path from "path";

type HistoricalDataItem = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

async function fetchHistoricalData(symbol: string, startDate: string) {
  const period1 = new Date(startDate).getTime() / 1000;
  const period2 = Math.floor(Date.now() / 1000); // Current date in seconds

  const queryOptions = {
    period1,
    period2,
    interval: "1d" as "1d", // explicitly typing interval
  };

  const data: any = await yahooFinance.historical(symbol, queryOptions);

  const formattedData: HistoricalDataItem[] = data.map((item: any) => ({
    date: new Date(item.date).toISOString().split("T")[0],
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
  }));

  // Ensure the data directory exists
  const dataDir = path.resolve(__dirname, "../data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(
    `${dataDir}/${symbol}.json`,
    JSON.stringify(formattedData, null, 2)
  );
}

// Fetch data starting from January 1, 2021, until the current date
fetchHistoricalData("SOXL", "2021-01-01");
fetchHistoricalData("SOXS", "2021-01-01");
