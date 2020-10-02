const express = require("express");

const app = express();

app.set("trust proxy", true);

app.get("/", (_, res) => {
  var str = "hello world!";
  res.json(str);
});

app.get("/locations", async (req, res) => {
  //   var ip = req.headers["x-forwarded-for"] || req.connection.localAddress;
  const ip_1 = req.ip.replace("::ffff:", "");

  const token = "bf659e5b6f895e";
  const url = "http://ipinfo.io/";
  const ipres = await fetch(url, {
    method: "GET",
    mode: "cors",
    body: ip_1,
  });
  res.json(ipres);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
