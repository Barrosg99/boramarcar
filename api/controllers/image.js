const fs = require("fs");
const path = require("path");
const imageRepositories = require("../repositories/image");

const getImage = async (req, res) => {
  try {
    const image = await imageRepositories.findImageById(req.params.id);
    const imagePath = path.resolve(`${__dirname}/../static/temp/${image.nome}`);
    fs.writeFileSync(imagePath, image.arquivo);
    res.sendFile(imagePath);
    setTimeout(() => {
      if (fs.existsSync(imagePath)) {
        fs.rmSync(imagePath);
      }
    }, 2000);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
module.exports = {
  getImage,
};
