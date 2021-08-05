import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";
import { type } from "os";

const supabase = createClient(
  "https://clhiogfbhdkwkomjretd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAzMjQ0MCwiZXhwIjoxOTM4NjA4NDQwfQ.Y77HcMFE1RoMsAcEgNd8iUpOaqkJ3-JBKSoU9U9ZUJ0"
);

type Link = {
  id: number;
  nation: number;
};

exports.request = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    if (!id) {
      throw Error("Missing nation or user ID");
    }
    if (isNaN(Number(id))) {
      throw Error("Invalid nation or user ID");
    }
    const { data, error } = await supabase
      .from<Link>("links")
      .select()
      .or(`eq.${id},to.eq.${id}`);
    if (error) {
      throw Error("Error fetching link data");
    }
    if (data) {
      const user = { user_id: data[0].id, nation_id: data[0].nation };
      res.status(200).json({ success: true, data: user });
    } else {
      throw Error("Error fetching link data");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
