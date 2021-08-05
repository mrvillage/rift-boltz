import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

const supabase = createClient(
  "https://clhiogfbhdkwkomjretd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAzMjQ0MCwiZXhwIjoxOTM4NjA4NDQwfQ.Y77HcMFE1RoMsAcEgNd8iUpOaqkJ3-JBKSoU9U9ZUJ0"
);

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

exports.request = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from<Nation>("nations").select();
    if (error) {
      console.error(error);
      throw Error("Error fetching nation data");
    }
    if (data) {
      for (const nation of data) {
        if (nation.alliance == "None") {
          nation.alliance = null;
        }
      }
      res.status(200).json({ success: true, data });
    }
    throw Error("Error fetching nation data");
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};