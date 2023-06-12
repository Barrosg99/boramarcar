const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || process.env.SRV_PORT || 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
