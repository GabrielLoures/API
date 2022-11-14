const path = require('path'); // path está presente dentro do próprio node.js
const multer = require('multer'); // chamamos a biblioteca multer
const crypto = require('crypto');

const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp') // criamos uma pasta temporária dentro da pasta raiz do projeto (por isso os 2 "..")

const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, 'uploads') // pasta onde de fato os arquivos irão ficar

const MULTER = {

  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex"); // criamos um Hash para cada arquivo para não termos arquivos de nomes iguais
      const fileName = `${fileHash}-${file.originalname}`; // o nome do arquivo vira o Hash criado acima, traço, o nome do arquivo original

      return callback(null, fileName);
    },
  }),

}

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER
}