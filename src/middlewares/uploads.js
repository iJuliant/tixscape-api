const multer = require('multer')
const wrapper = require('../helpers/wrapper')
const path = require('path')

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },

  filename: function (req, file, cb) {
    console.log(`file >>> ${file}`)
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }

})

const fileFilter = (req, file, cb) => {
  const extensions = ['.jpg', '.jpeg', '.png']
  const ext = path.extname(file.originalname).toLowerCase()

  if (extensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`${ext} not supported`), false)
  }
}

const upload = multer({ storage, fileFilter }).single('image')

const filterUpload = (req, res, next) => {
  upload(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      console.log('Multer error')

      return wrapper.response(res, 401, error.message, null)
    } else if (error) {
      console.log(error)

      return wrapper.response(res, 401, error.message, null)
    }
    next()
  })
}

module.exports = filterUpload
