const fs = require('fs')
const path = require('path')

module.exports = {

  deletePoster: (poster) => {
    console.log()
    console.log(fs.existsSync(path.join(__dirname, '../uploads/', poster)))

    fs.unlinkSync(path.join(__dirname, '../uploads', poster))
  }
}
