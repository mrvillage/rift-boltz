import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

const supabase = createClient(
  "https://clhiogfbhdkwkomjretd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAzMjQ0MCwiZXhwIjoxOTM4NjA4NDQwfQ.Y77HcMFE1RoMsAcEgNd8iUpOaqkJ3-JBKSoU9U9ZUJ0"
);

type Nation = {
  id: number;
  war_policy: number;
};

async function spiesRequest(
  targetId: number,
  numSpies: number,
  safety: number
): Promise<boolean> {
  // Returns true if odds are greater than 50%, returns false if odds are less than 50%
  const response = await fetch(
    `https://politicsandwar.com/war/espionage_get_odds.php?id1=251584&id2=${targetId}&id3=0&id4=${safety}&id5=${numSpies}`
  );
  const text = await response.text();
  if (text.indexOf("Lower") + 1) {
    return false;
  } else if (text.indexOf("Greater") + 1) {
    return true;
  }
  throw Error(`Received invalid response of ${text}`);
}

async function getSpies(target: Nation, safety: number): Promise<number> {
  let fetchAmount = 30;
  let last;
  let next;
  let second;
  if (await spiesRequest(target.id, fetchAmount, safety)) {
    fetchAmount -= 5;
    last = true;
  } else {
    fetchAmount += 5;
    last = false;
  }
  while (true) {
    next = await spiesRequest(target.id, fetchAmount, safety);
    if (last != next) {
      break;
    }
    if (next) {
      fetchAmount -= 5;
      last = true;
    } else {
      fetchAmount += 5;
      last = false;
    }
    if (fetchAmount < 0 || fetchAmount > 60) {
      throw Error(`Could not calculate spies for ${target.id}`);
    }
  }
  if (next) {
    while (true) {
      second = await spiesRequest(target.id, fetchAmount, safety);
      if (next != second) {
        break;
      }
      fetchAmount -= 1;
      if (fetchAmount < 0 || fetchAmount > 60) {
        throw Error(`Could not calculate spies for ${target.id}`);
      }
    }
  } else {
    while (true) {
      second = await spiesRequest(target.id, fetchAmount, safety);
      if (next != second) {
        break;
      }
      fetchAmount += 1;
      if (fetchAmount < 0 || fetchAmount > 60) {
        throw Error(`Could not calculate spies for ${target.id}`);
      }
    }
  }
  let odds = 50;
  let mod;
  if (target.war_policy == 10) {
    mod = 0.82;
  } else if (target.war_policy == 7) {
    mod = 0.88;
  } else {
    mod = 1;
  }
  let num: number = ((100 * fetchAmount) / (odds * mod - 25 * safety) - 1) / 3;
  if (num < 0) {
    num *= -1;
  }
  if (num < 30) {
    if (target.war_policy == 10) {
      mod = 0.8;
    } else if (target.war_policy == 7) {
      mod = 0.9;
    } else {
      mod = 1;
      if (num > 20) {
        if (second) {
          odds = 51;
        } else {
          odds = 49;
        }
      }
      num = ((100 * fetchAmount) / (odds * mod - 25 * safety) - 1) / 3;
      if (num > 0) {
        return num;
      } else {
        return num * -1;
      }
    }
  }
  return num;
}

async function calculateSpies(id: number): Promise<number> {
  const { data, error } = await supabase
    .from<Nation>("nations")
    .select("id, war_policy")
    .match({ id });
  let nation;
  if (error) {
    throw Error("404");
  } else if (data) {
    nation = data[0];
  }
  if (!nation) {
    throw Error("404");
  }
  let safetyLevels;
  if (nation.war_policy == 10 || nation.war_policy == 7) {
    safetyLevels = [3, 2, 1];
  } else {
    safetyLevels = [1, 2, 3];
  }
  let num;
  try {
    num = await getSpies(nation, safetyLevels[0]);
  } catch (e) {
    try {
      num = await getSpies(nation, safetyLevels[1]);
    } catch (e) {
      try {
        num = await getSpies(nation, safetyLevels[2]);
      } catch (e) {
        return 0;
      }
    }
  }
  if (num > 30) {
    return Math.round(num);
  } else {
    return Math.floor(num);
  }
}

const spies = async (req: Request, res: Response): Promise<void> => {
  try {
    let { id } = req.query;
    if (!id) {
      throw Error("400");
    }
    if (isNaN(Number(id))) {
      throw Error("400");
    }
    const num = await calculateSpies(Number(id));
    res.json({
      success: true,
      data: { id: id, spies: num },
      margin: 2,
    });
  } catch (error) {
    if (error.message === "400") {
      res.json({
        success: false,
        error: "Invalid or no nation ID specified",
      });
    } else if (error.message === "404") {
      res.json({
        success: false,
        error: "Nation not found",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
};

export default spies;
