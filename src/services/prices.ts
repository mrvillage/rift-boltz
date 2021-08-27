import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

const supabase = createClient(
  "https://clhiogfbhdkwkomjretd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAzMjQ0MCwiZXhwIjoxOTM4NjA4NDQwfQ.Y77HcMFE1RoMsAcEgNd8iUpOaqkJ3-JBKSoU9U9ZUJ0"
);

type Trade = {
  date: string;
  nation_id: number;
  amount: number;
  price: number;
  total_value: number;
};
type Resource = {
  avg_price: number;
  market_index: string;
  highest_buy: Trade;
  lowest_buy: Trade;
};
interface Price {
  [key: string]: {
    datetime: string;
    market_index: string;
    resource: Resource;
    credit: Resource;
    coal: Resource;
    oil: Resource;
    uranium: Resource;
    lead: Resource;
    iron: Resource;
    bauxite: Resource;
    gasoline: Resource;
    munitions: Resource;
    steel: Resource;
    aluminum: Resource;
    food: Resource;
  };
}

const prices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from<Price>("prices")
      .select()
      .order("datetime", { ascending: false })
      .limit(1);
    if (error) {
      console.error(error);
      throw Error("Internal Server Error");
    }
    if (data) {
      const keys = Object.keys(data[0]);
      const final: Price = { ...data[0] };
      delete keys[0];
      for (const key of keys) {
        if (!key) {
          continue;
        }
        // @ts-ignore
        const res = JSON.parse(data[0][key]);
        final[key] = {
          // @ts-ignore
          avg_price: Number(res.avgprice),
          highest_buy: {
            date: res.highestbuy.date,
            nation_id: Number(res.highestbuy.nationid),
            amount: Number(res.highestbuy.amount),
            price: Number(res.highestbuy.price),
            total_value: Number(res.highestbuy.totalvalue),
          },
          lowest_buy: {
            date: res.lowestbuy.date,
            nation_id: Number(res.lowestbuy.nationid),
            amount: Number(res.lowestbuy.amount),
            price: Number(res.lowestbuy.price),
            total_value: Number(res.lowestbuy.totalvalue),
          },
        };
      }
      // @ts-ignore
      final.market_index = Number(
        // @ts-ignore
        JSON.parse(data[0].credit).marketindex.replace(",", "")
      );
      res.status(200).json({ success: true, data: final });
    }
    throw Error("Internal Server Error");
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    throw error;
  }
};

export default prices;
