import { TradeModel } from "../models/TradeModel";
import { DataModel } from "../models/DataModel";
import fs from "fs";
import path from "path";

jest.mock("fs");
jest.mock("../models/DataModel");

describe("TradeModel", () => {
  beforeEach(() => {
    const mockData = [
      { date: "2021-10-01", close: 40 },
      { date: "2021-10-02", close: 42 },
      { date: "2021-10-03", close: 43 },
      { date: "2021-10-04", close: 41 },
      { date: "2021-10-05", close: 44 },
      { date: "2021-10-06", close: 45 },
      { date: "2021-10-07", close: 46 },
      { date: "2021-10-08", close: 47 },
      { date: "2021-10-09", close: 48 },
      { date: "2021-10-10", close: 49 },
    ];
    (DataModel.getHistoricalData as jest.Mock).mockReturnValue(mockData);
  });

  it("should execute trades based on SMA cross-over strategy", () => {
    const symbol = "SOXL";
    const shortWindow = 3;
    const longWindow = 5;
    const initialBalance = 100000;

    const trades = TradeModel.smaCrossOver(
      symbol,
      shortWindow,
      longWindow,
      initialBalance
    );

    expect(DataModel.getHistoricalData).toHaveBeenCalledWith("SOXL");
    expect(trades.length).toBeGreaterThan(0);
    expect(trades[0]).toHaveProperty("date");
    expect(trades[0]).toHaveProperty("symbol");
    expect(trades[0]).toHaveProperty("action");
    expect(trades[0]).toHaveProperty("price");
    expect(trades[0]).toHaveProperty("amount");
    expect(trades[0]).toHaveProperty("gainLoss");
    expect(trades[0]).toHaveProperty("balance");
  });

  it("should generate a CSV log file", () => {
    const symbol = "SOXL";
    const shortWindow = 3;
    const longWindow = 5;
    const initialBalance = 100000;

    TradeModel.smaCrossOver(symbol, shortWindow, longWindow, initialBalance);

    const logsDir = path.resolve(__dirname, "../../logs");
    const csvFilePath = `${logsDir}/${symbol}_trades.csv`;

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(csvFilePath),
      expect.any(String)
    );
  });
});
