const express = require("express");
const expressTypes = require("types/express");

const app = express();

import { PostgrestClient } from "@supabase/postgrest-js";

async function func() {
  const { data, error } = await client.from("alliances").select("name");
  console.log(data, error);
}
const client = new PostgrestClient("https://clhiogfbhdkwkomjretd.supabase.co");

await func();
app.get("/", (req: any, res: any) => {
  res
    .status(200)
    .send(
      "Welcome to the Rift API! Documentation can be found here: https://docs.mrvillage.dev/rift"
    )
    .end();
});

exports.request = app;
