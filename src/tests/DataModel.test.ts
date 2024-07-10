import { DataModel } from "../models/DataModel";
import fs from "fs";

jest.mock("fs");

describe("DataModel", () => {
  it("should read and parse the JSON data file for a given symbol", () => {
    const mockData = JSON.stringify([
      { date: "2021-01-01", close: 100 },
      { date: "2021-01-02", close: 101 },
    ]);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockData);

    const result = DataModel.getHistoricalData("SOXL");

    expect(fs.readFileSync).toHaveBeenCalledWith("./data/SOXL.json", "utf-8");
    expect(result).toEqual([
      { date: "2021-01-01", close: 100 },
      { date: "2021-01-02", close: 101 },
    ]);
  });
});
