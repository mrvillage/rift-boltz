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
    market_index: number;
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

exports.request = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from<Price>("prices")
      .select()
      .order("datetime", { ascending: false })
      .limit(1);
    if (error) {
      console.error(error);
      throw Error("Error fetching alliance data");
    }
    if (data) {
      const keys = Object.keys(data[0]);
      const final: Price = { ...data[0] };
      // @ts-ignore
      final.market_index = Number(data[0].credit.market_index.replace(",", ""));
      for (const key of keys) {
        // @ts-ignore
        const res = JSON.parse(data[0][key]);
        final[key] = {
          // @ts-ignore
          avg_price: res.avg_price,
          highest_buy: {
            date: res.highest_buy.date,
            nation_id: Number(res.highest_buy.nation_id),
            amount: Number(res.highest_buy.amount),
            price: Number(res.highest_buy.price),
            total_value: res.highest_buy.total_value,
          },
          lowest_buy: {
            date: res.lowest_buy.date,
            nation_id: Number(res.lowest_buy.nation_id),
            amount: Number(res.lowest_buy.amount),
            price: Number(res.lowest_buy.price),
            total_value: res.lowest_buy.total_value,
          },
        };
      }
      res.status(200).json({ success: true, data: final });
    }
    throw Error("Error fetching alliance data");
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
