const express = require("express");
const axios = require("axios");

const app = express();

app.set("trust proxy", true);

app.get("/", (_, res) => {
  var str = "hello world!";
  res.json(str);
});

app.get("/locations", async (req, res) => {
  //   var ip = req.headers["x-forwarded-for"] || req.connection.localAddress;
  const ip_1 = req.ip.replace("::ffff:", "");
  try {
    const token = "bf659e5b6f895e";
    const url = "http://ipinfo.io/" + ip_1 + "?token=" + token;

    const ipres = await axios.get(url);
    console.log(ipres);
    res.json(ipres.data);
  } catch (error) {
    console.log(error);
  }
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
