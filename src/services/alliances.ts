import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

const supabase = createClient(
  "https://clhiogfbhdkwkomjretd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAzMjQ0MCwiZXhwIjoxOTM4NjA4NDQwfQ.Y77HcMFE1RoMsAcEgNd8iUpOaqkJ3-JBKSoU9U9ZUJ0"
);

type Alliance = {
  id: number;
  found_date: string;
  name: string;
  acronym: string;
  color: string;
  rank: number;
  members: number;
  score: number;
  leader_ids: string;
  officer_ids: string;
  heir_ids: string;
  avg_score: number;
  flag_url: string;
  forum_url: string;
  irrchan: string;
};

const alliances = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from<Alliance>("alliances").select();
    if (error) {
      console.error(error);
      throw Error("500");
    }
    if (data) {
      for (const alliance of data) {
        alliance.leader_ids = JSON.parse(alliance.leader_ids);
        alliance.officer_ids = JSON.parse(alliance.officer_ids);
        alliance.heir_ids = JSON.parse(alliance.heir_ids);
      }
      res.status(200).json({ success: true, data });
    }
    throw Error("500");
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
export default alliances;
