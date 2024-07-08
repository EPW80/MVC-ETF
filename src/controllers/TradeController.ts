import { Request, Response } from "express";
import { TradeModel } from "../models/TradeModel";

export class TradeController {
  static async runStrategy(req: Request, res: Response) {
    const { symbol, shortWindow, longWindow, initialBalance } = req.body;
    const trades = TradeModel.smaCrossOver(
      symbol,
      shortWindow,
      longWindow,
      initialBalance
    );
    res.json(trades);
  }
}
