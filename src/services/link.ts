import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

const supabase = createClient(
  "https://clhiogfbhdkwkomjretd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAzMjQ0MCwiZXhwIjoxOTM4NjA4NDQwfQ.Y77HcMFE1RoMsAcEgNd8iUpOaqkJ3-JBKSoU9U9ZUJ0"
);

type Link = {
  id: number;
  nation: number;
};

const link = async (req: Request, res: Response) => {
  try {
    let { id } = req.query;
    if (!id) {
      throw Error("400");
    }
    if (isNaN(Number(id))) {
      throw Error("400");
    }
    const { data, error } = await supabase
      .from<Link>("links")
      .select()
      .or(`id.eq.${id},nation.eq.${id}`);
    if (error) {
      console.error(error.toString());
      throw Error("500");
    }
    if (data) {
      if (!data[0]) {
        throw Error("404");
      }
      const user = { user_id: String(data[0].id), nation_id: data[0].nation };
      res.status(200).json({ success: true, data: user });
      return;
    } else {
      throw Error("500");
    }
  } catch (error) {
    if (error.message == "400") {
      res.status(400).json({
        success: false,
        error: "Invalid or no nation or user ID specified",
      });
    } else if (error.message === "404") {
      res
        .status(404)
        .json({ success: true, data: { user_id: null, nation_id: null } });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};

export default link;
