import Book from "../../models/Book.js"
import Price from "../../models/Price.js"
import errorsNamesConstants from "../../utils/errorsNamesConstants.js"

const getBookWithId = async(request, response, next) =>
{
  const bookId = request.params.id
  
  // find the book
  const book = await Book.findById(bookId)
  if(!book) return next({name: errorsNamesConstants.NOTFOUND, message: `There is no book with ${bookId} id.`})

  // Getting the book price
  const price = await Price.findOne({bookId}).sort({date: -1})

  // responsed data
  const fullBookdata = {
    id: book._id,
    title: book.title,
    description: book.description,
    price: price.price,
    quantity: book.quantity,
    cover: book.cover,
    updatedAt: price.date
  }


  response.json({state: true, data: fullBookdata})
}

export default getBookWithId