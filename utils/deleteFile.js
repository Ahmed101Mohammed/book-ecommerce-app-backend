import fs from 'fs/promises'
import filesTypesConstatns from './filesTypesConstatnts.js'
const bookCoversFolderPath = './uploads/books-covers/'
const userAvatarsFolderPath = './uploads/users/'
const defaultBookCoverFileName = 'default-book-cover.jpeg'
const deleteFile = async (fileName, fileType)=>
{
  if(fileName === defaultBookCoverFileName) return
  const filePath = fileType === filesTypesConstatns.BOOK_COVER ? bookCoversFolderPath : userAvatarsFolderPath
  try {
    await fs.unlink(`${filePath}${fileName}`);
    console.log(`File deleted successfully: ${filePath}${fileName}`);
  } catch (err) {
    console.error(`Error deleting file: ${err.message}`);
  }
}

export const deleteFileFromRequest = async(request, fileType) =>
{
  const file = request.file
  if(!file) return

  const fileName = file.filename
  await deleteFile(fileName, fileType)
}
export default deleteFile
