import Book from "../../models/Book.js"
import errorsNamesConstants from "../../utils/errorsNamesConstants.js"
import deleteFile, { deleteFileFromRequest } from "../../utils/deleteFile.js"
import filesTypesConstatns from "../../utils/filesTypesConstatnts.js"
import Price from "../../models/Price.js"

const deleteBookWithId = async (request, response, next) =>
{
  const bookId = request.params.id

  // Delete the book data
  const deletedBook = await Book.findOneAndDelete({_id: bookId})
  if(!deletedBook)
  {
    return next({name: errorsNamesConstants.NOTFOUND, message: `There are no book with ${bookId} id, or Maybe it delete before`})
  }

  // Latest book price
  const price = await Price.findOne({bookId}).sort({date: -1})

  // Delet all book prices
  await Price.deleteMany({bookId})

  // Delete the old book cover if it updated
  if(deletedBook)
  {
    await deleteFile(deletedBook.cover, filesTypesConstatns.BOOK_COVER)
  }

  // responsed data
  const fullBookdata = {
    id: deletedBook._id,
    title: deletedBook.title,
    description: deletedBook.description,
    price: price.price,
    quantity: deletedBook.quantity,
    cover: deletedBook.cover,
    updatedAt: price.date
  }

  response.status(200).json({state: true, data: fullBookdata}).end()
}

export default deleteBookWithId