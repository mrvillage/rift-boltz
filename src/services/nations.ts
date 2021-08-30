import { Request, Response } from "express";
import supabase from "../supabase";

type Nation = {
  id: number;
  name: string;
  leader: string;
  continent: number;
  war_policy: number;
  domestic_policy: number;
  color: number;
  alliance_id: number;
  alliance: string | null;
  alliance_position: number;
  cities: number;
  offensive_wars: number;
  defensive_wars: number;
  score: number;
  v_mode: boolean;
  v_mode_turns: number;
  beige_turns: number;
  last_active: string;
  founded: string;
  soldiers: number;
  tanks: number;
  aircraft: number;
  ships: number;
  missiles: number;
  nukes: number;
};

const nations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from<Nation>("nations").select();
    if (error) {
      console.error(error.toString());
      throw Error("500");
    }
    if (data) {
      for (const nation of data) {
        if (nation.alliance == "None") {
          nation.alliance = null;
        }
      }
      res.status(200).json({ success: true, data });
      return;
    }
    throw Error("500");
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export default nations;
