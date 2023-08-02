require('dotenv').config();
const { URL } = require("url");
const dns = require("dns");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
app.use(bodyParser.urlencoded({ extended: false }));
// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
const shortenedURLS = {};
app.post("/api/shorturl", (req, res) => {
  const originalURL = req.body.url;
  const urlObject = new URL(originalURL);
  dns.lookup(urlObject.hostname, (err, address, family) => {
    if (err) {
      res.json({
        originalURL: originalURL,
        shortenedURL: "Invalid URL",
      });
    } else {
      var shortenedURL = Math.floor(Math.random() * 100000).toString();
      shortenedURLS[shortenedURL] = originalURL;
      res.json({
        originalURL: originalURL,
        shortenedURL: shortenedURL,
      });
    }
  });
});
app.get("/api/shorturl/:url", (req, res) => {
  console.log(req.params, shortenedURLS[req.params.url]);
  const to = shortenedURLS[req.params.url];
  res.redirect(to);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
