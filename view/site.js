const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/pages/index.html`);
});

const useHttps = fs.existsSync(`${__dirname}/localhost.test.key`) && fs.existsSync(`${__dirname}/localhost.test.crt`);

const options = {
  key: fs.readFileSync(`${__dirname}/localhost.test.key`),
  cert: fs.readFileSync(`${__dirname}/localhost.test.crt`),
};

const PORT = process.env.PORT || 3000;

if (useHttps) {
  // eslint-disable-next-line no-console
  https.createServer(options, app).listen(PORT, console.log(`server runs on port ${PORT}`));
} else {
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("O site está rodando na porta 3000");
  });
}
