import { Request, Response } from "express";
import supabase from "../supabase";

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

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from<Alliance>("alliances").select();
    if (error) {
      console.error(error.toString());
      throw Error("500");
    }
    if (data) {
      for (const alliance of data) {
        alliance.leader_ids = JSON.parse(alliance.leader_ids);
        alliance.officer_ids = JSON.parse(alliance.officer_ids);
        alliance.heir_ids = JSON.parse(alliance.heir_ids);
      }
      res.status(200).json({ success: true, data });
      return;
    }
    throw Error("500");
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
