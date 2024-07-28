declare module "yahoo-finance" {
  export interface HistoricalResult {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }

  export function historical(options: {
    symbol: string;
    from: string;
    to: string;
    period: string;
  }): Promise<HistoricalResult[]>;
}
