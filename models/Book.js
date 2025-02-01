import mongoose from "mongoose"

// books: ID | title | description | cover | quantity
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  cover: {
    type: String,
    default: 'default-book-cover.jpeg'
  },
  quantity: {
    type: Number,
    default: 0
  }
})

bookSchema.set('toJSON', {
  versionKey: false,
  transform: (document, returnedBook) =>
  {
    returnedBook.id = returnedBook._id
    delete returnedBook._id
  }
})

const Book = new mongoose.model('Book', bookSchema)

export default Book