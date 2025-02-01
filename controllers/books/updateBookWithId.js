import Joi from "joi"
import Book from "../../models/Book.js"
import errorsNamesConstants from "../../utils/errorsNamesConstants.js"
import deleteFile, { deleteFileFromRequest } from "../../utils/deleteFile.js"
import filesTypesConstatns from "../../utils/filesTypesConstatnts.js"
import Price from "../../models/Price.js"

const updateBookWithId = async (request, response, next) =>
{
  const bookId = request.params.id
  const newBookVersion = request.body
  const {title, description, quantity, price} = newBookVersion

  // Validate data
    const schema = Joi.object({
      title: Joi
        .string()
        .min(10)
        .max(100),
      description: Joi
        .string()
        .min(50)
        .max(1000),
      quantity: Joi
        .number()
        .integer()
        .min(0),
      price: Joi
        .number()
        .min(0)
    })

  const validationResponse = await schema.validate({ title, description, quantity, price })
  if(validationResponse.error)
  {
    // Delete book cover if it stored in uploads
    await deleteFileFromRequest(request, filesTypesConstatns.BOOK_COVER)

    return next(validationResponse.error)
  }
  
  // No 2 books have same title
  const book = await Book.findOne({title})
  if(book && toString(book.id) !== bookId)
  {
    // Delete book cover if it stored in uploads
    await deleteFileFromRequest(request, filesTypesConstatns.BOOK_COVER)

    return next({name: errorsNamesConstants.DublicatedData, message: `Book with ${title} title is already exists`})
  } 
  const bookData = validationResponse.value

  // Check if the cover was updated
  let oldCoverName = ''
  const cover = request.file
  if(cover) 
  {
    bookData.cover = cover.filename
    const book = await Book.findById(bookId)
    oldCoverName = book.cover
  }
  // Update the book data
  const updatedBook = await Book.findOneAndUpdate({_id: bookId}, bookData, {new: true})
  if(price)
  {
    const newPrice = new Price({bookId, price})
    await newPrice.save()
  }

  // Delete the old book cover if it updated
  if(oldCoverName !== '')
  {
    await deleteFile(oldCoverName, filesTypesConstatns.BOOK_COVER)
  }

  // responsed data
  const lastPricing = await Price.findOne({bookId})
    .sort({date: -1})

  const fullBookdata = {
    id: updatedBook._id,
    title: updatedBook.title,
    description: updatedBook.description,
    price: lastPricing.price,
    quantity: updatedBook.quantity,
    cover: updatedBook.cover,
    updatedAt: lastPricing.date
  }
  
  response.status(200).json({state: true, data: fullBookdata}).end()
}

export default updateBookWithId