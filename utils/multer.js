import multer from "multer"
import path from "node:path"
import { fileURLToPath } from "node:url"

const currentModule = fileURLToPath(import.meta.url)
const currentModuleFolder = path.dirname(currentModule)
const distination = path.join(currentModuleFolder ,'..', 'uploads', 'books-covers')

const diskStorage = multer.diskStorage({
  destination: distination,
  filename: (req, file, cb) =>
  {
    // console.log('From multer, file data:', file)
    const userId = req.authData.id
    const fileType = file.mimetype
    console.log({userId})
    const multerError = new Error('Wrong type, accept just images')
    multerError.name = 'MulterError'
    if(!fileType.startsWith('image')) return cb(multerError)
    return cb(null, `${Date.now()}-${userId}-${file.originalname}`)
  }
})

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 500000
  }
})

export default upload