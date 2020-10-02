const express = require("express");
const axios = require("axios");
const AWS = require("aws-sdk");

// connect to dynamoDB
AWS.config.update({ region: "us-east-1" });
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const app = express();

app.set("trust proxy", true);

app.get("/", (_, res) => {
  var str = "hello world!";
  res.json(str);
});

app.get("/locations", async (req, res) => {
  //   var ip = req.headers["x-forwarded-for"] || req.connection.localAddress;
  const ip_1 = req.ip.replace("::ffff:", "");
  var url = "";

  try {
    const token = "bf659e5b6f895e";
    url = "http://ipinfo.io/" + ip_1 + "?token=" + token;

    const ipres = await axios.get(url);
    console.log(ipres);
    res.json(ipres.data);
    loc = ipres.data.loc;
    lat = loc.split(",")[0];
    long = loc.split(",")[1];
    // Call DynamoDB to add the item to the table
    var params = {
      TableName: "esri_demp",
      Item: {
        ip_addr: { N: ip_1 },
        ISP: { S: ipres.data.org },
        VisitorCount: { N: "1" },
        Lat: { N: lat },
        Long: { N: long },
        LastVisitTime: { N: "1" },
      },
    };

    ddb.putItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Service Error");
  }
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
