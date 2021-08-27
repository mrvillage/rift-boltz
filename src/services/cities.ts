import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

const supabase = createClient(
  "https://clhiogfbhdkwkomjretd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAzMjQ0MCwiZXhwIjoxOTM4NjA4NDQwfQ.Y77HcMFE1RoMsAcEgNd8iUpOaqkJ3-JBKSoU9U9ZUJ0"
);

type City = {
  id: number;
  nation_id: number;
  name: string;
  capital: boolean;
  infrastructure: number;
  max_infra: number;
  land: number;
};

const cities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from<City>("cities").select();
    if (error) {
      console.error(error);
      throw Error("500");
    }
    if (data) {
      res.status(200).json({ success: true, data });
    }
    throw Error("500");
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export default cities;
