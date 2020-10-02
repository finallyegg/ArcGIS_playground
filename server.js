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

    var getParam = {
      TableName: "esri_demo",
      Key: {
        ip_addr: { S: ip_1 },
      },
    };
    var result = await ddb.getItem(getParam).promise();
    // console.log(JSON.stringify(result));
    console.log(typeof result.Item);
    if (typeof result.Item != "undefined") {
      var params = {
        TableName: "esri_demo",
        Key: {
          VisitorCount: { N: String(result.Item.VisitorCount + 1) },
          LastVisitTime: { N: String(Date.now()) },
        },
      };
      ddb.updateItem(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
    } else {
      const ipres = await axios.get(url);
      // console.log(ipres);
      loc = ipres.data.loc;
      lat = loc.split(",")[0];
      long = loc.split(",")[1];
      // Call DynamoDB to add the item to the table
      var params = {
        TableName: "esri_demo",
        Item: {
          ip_addr: { S: ip_1 },
          ISP: { S: ipres.data.org },
          VisitorCount: { N: "1" },
          Lat: { N: lat },
          Long: { N: long },
          LastVisitTime: { N: String(Date.now()) },
        },
      };

      ddb.putItem(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
      res.status(200).json("Success!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Service Error");
  }
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
