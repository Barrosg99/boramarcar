const https = require("https");
const fs = require("fs");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || process.env.SRV_PORT || 8080;

const useHttps = fs.existsSync(`${__dirname}/../localhost.test.key`) && fs.existsSync(`${__dirname}/../localhost.test.crt`);

const options = useHttps && {
  key: fs.readFileSync(`${__dirname}/../localhost.test.key`),
  cert: fs.readFileSync(`${__dirname}/../localhost.test.crt`),
};

if (useHttps) {
  // eslint-disable-next-line no-console
  https.createServer(options, app).listen(PORT, console.log(`O site está rodando na porta ${PORT}`));
} else {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`O site está rodando na porta ${PORT}`);
  });
}
