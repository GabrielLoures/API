const fs = require('fs'); // biblioteca do próprio node.js para lidar com manipulação de arquivos
const path = require('path');
const uploadConfig = require('../configs/upload')

class DiskStorage {

  async saveFile(file) {

    await fs.promises.rename( // o rename não muda o nome do arquivo (foto do upload), ele muda o arquivo de pasta (mudamos da pasta temporária para a de uploads)
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    )

    return file

  }

  async deleteFile(file) {

    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

    try {

      await fs.promises.stat(filePath); // verifica qual o estado do arquivo (se o arquivo não estiver disponível por qualquer motivo, ele para a aplicação no return do catch)

    } catch {

      return;

    }

    await fs.promises.unlink(filePath) // remove o arquivo da pasta

  }

}

module.exports = DiskStorage;