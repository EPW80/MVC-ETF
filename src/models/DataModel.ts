import fs from "fs";

export class DataModel {
  static getHistoricalData(symbol: string) {
    const data = fs.readFileSync(`./data/${symbol}.json`, "utf-8");
    return JSON.parse(data);
  }
}
