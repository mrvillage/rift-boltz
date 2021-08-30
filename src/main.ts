const express = require("express");
const services = require("./services").default;

const app = express();

app.get("/", (req: any, res: any) => {
  res
    .status(200)
    .send(
      "Welcome to the Rift API! Documentation can be found here: https://docs.mrvillage.dev/rift"
    )
    .end();
});

app.get("/alliances", services.alliances);
// app.get("/cities", services.cities);
app.get("/link", services.link);
app.get("/nations", services.nations);
app.get("/prices", services.prices);
app.get("/spies", services.spies);
app.get("/treaties", services.treaties);

// exports.request = app;

app.listen(80);
