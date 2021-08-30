import { Request, Response } from "express";
import supabase from "../supabase";

type Treaty = {
  started: string;
  stopped: string | null;
  from_: number;
  from: number;
  to_: number;
  to: number;
  treaty_type: string;
};

const treaties = async (req: Request, res: Response): Promise<void> => {
  try {
    let { id } = req.query;
    if (!id) {
      throw Error("400");
    }
    if (isNaN(Number(id))) {
      throw Error("400");
    }
    const { data, error } = await supabase
      .from<Treaty>("treaties")
      .select()
      .or(`from_.eq.${id},to_.eq.${id}`);
    if (error) {
      throw Error("500");
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
    if (error.message == "400") {
      res
        .status(400)
        .json({ success: false, error: "Invalid or no alliance ID specified" });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};

export default treaties;
