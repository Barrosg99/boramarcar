const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/pages/index.html`);
});

app.get("/:page", (req, res) => {
  const { page } = req.params;
  const fileExists = fs.existsSync(`${__dirname}/pages/${page}`);
  if (!fileExists) res.status(404).send("<h1>Essa página não existe!</h1>");
  res.sendFile(`${__dirname}/pages/${page}`);
});

app.use((err, req, res) => {
  if (err.message) res.status(404).send("<h1>Essa página não existe!</h1>");
});

const useHttps = fs.existsSync(`${__dirname}/../localhost.test.key`) && fs.existsSync(`${__dirname}/../localhost.test.crt`);

const options = useHttps && {
  key: fs.readFileSync(`${__dirname}/../localhost.test.key`),
  cert: fs.readFileSync(`${__dirname}/../localhost.test.crt`),
};

const PORT = process.env.PORT || 3000;

if (useHttps) {
  // eslint-disable-next-line no-console
  https.createServer(options, app).listen(PORT, console.log(`O site está rodando na porta ${PORT}`));
} else {
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log(`O site está rodando na porta ${PORT}`);
  });
}
