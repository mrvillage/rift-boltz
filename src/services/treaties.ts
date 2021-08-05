import { createClient } from "@supabase/supabase-js";
import { resolveTxt } from "dns";
import { Request, Response } from "express";
import { type } from "os";

const supabase = createClient(
  "https://clhiogfbhdkwkomjretd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAzMjQ0MCwiZXhwIjoxOTM4NjA4NDQwfQ.Y77HcMFE1RoMsAcEgNd8iUpOaqkJ3-JBKSoU9U9ZUJ0"
);
type Treaty = {
  started: string;
  stopped: string | null;
  from_: number;
  from: number;
  to_: number;
  to: number;
  treaty_type: string;
};

exports.request = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    if (!id) {
      throw Error("Missing alliance ID");
    }
    if (isNaN(Number(id))) {
      throw Error("Invalid alliance ID");
    }
    const { data, error } = await supabase
      .from<Treaty>("treaties")
      .select()
      .or(`from_.eq.${id},to_.eq.${id}`);
    if (error) {
      throw Error("Error fetching treaty data");
    }
    if (!data) {
      res.status(200).json({ success: true, data });
    } else {
      for (let treaty of data) {
        treaty.from = treaty.from_;
        treaty.to = treaty.to_;
        // @ts-ignore
        delete treaty.from_;
        // @ts-ignore
        delete treaty.to_;
      }
      res.status(200).json({ success: true, data });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
