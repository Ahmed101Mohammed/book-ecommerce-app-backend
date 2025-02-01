import Book from "../../models/Book.js"
import Joi from "joi"
import { deleteFileFromRequest } from "../../utils/deleteFile.js"
import Price from "../../models/Price.js"
import filesTypesConstatns from "../../utils/filesTypesConstatnts.js"

const createBook = async(request, response, next) =>
{
  const { title, description, quantity, price } = request.body
  
  // Validate data
  const schema = Joi.object({
    title: Joi
      .string()
      .required()
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
      .required()
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
  if(book)
  {
    // Delete book cover if it stored in uploads
    await deleteFileFromRequest(request, filesTypesConstatns.BOOK_COVER)

    return next({name: 'DublicatedData', message: `Book with ${title} title is already exist`})
  } 
    

  // Create the book
  const file = request.file
  const newBook = new Book({title, description, quantity, cover: file?.filename})
  await newBook.save()

  // Create the book price
  const bookId = newBook._id
  const bookPrice = new Price({bookId, price})
  await bookPrice.save()

  // reponsed data
  const fullBookData = {
    id: newBook._id,
    title: newBook.title,
    description: newBook.description,
    price: bookPrice.price,
    quantity: newBook.quantity,
    cover: newBook.cover,
    updatedAt: bookPrice.date
  }

  response.status(201).json({state: true, data: fullBookData}).end()
}

export default createBook