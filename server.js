const express = require("express");

const app = express();

app.set("trust proxy", true);

app.get("/", (_, res) => {
  var str = "hello world!";
  res.json(str);
});

app.get("/locations", (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.connection.localAddress;
  var ip_1 = req.ip;

  r = { ip: ip, ip_1: ip_1 };
  //   var str = "hello";
  res.json(r);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
