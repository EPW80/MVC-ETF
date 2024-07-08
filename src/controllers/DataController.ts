import { Request, Response } from "express";
import { DataModel } from "../models/DataModel";

type DataItem = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export class DataController {
  static async getHistoricalData(req: Request, res: Response) {
    const { symbol, startDate, endDate } = req.query;

    if (
      !symbol ||
      typeof symbol !== "string" ||
      !startDate ||
      typeof startDate !== "string" ||
      !endDate ||
      typeof endDate !== "string"
    ) {
      res
        .status(400)
        .json({
          error:
            "symbol, startDate, and endDate are required and must be strings",
        });
      return;
    }

    const data: DataItem[] = DataModel.getHistoricalData(symbol);
    const filteredData = data.filter(
      (item) => item.date >= startDate && item.date <= endDate
    );
    res.json(filteredData);
  }
}
