import { Request, Response } from "express";
import supabase from "../supabase";

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
