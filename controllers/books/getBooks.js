import Book from '../../models/Book.js'
import Price from '../../models/Price.js'

const getBooks = async(request, response) =>
{
  const page = Math.max(0, request.query.page)
  const limit = Math.max(1, request.query.limit)
  const allBooks = await Book
    .find({})
    .skip(limit * page)
    .limit(limit)

  const allPrices = []
  for(let book of allBooks)
  {
    const bookId = book._id
    const latestPrice = await Price.findOne({bookId}).sort({date: -1})
    allPrices.push(latestPrice)
  }

  // respond data
  const allBooksWithFullData = []
  for(let i = 0; i < allBooks.length; i++)
  {
    const book = allBooks[i]
    const price = allPrices[i]
    const fullBookData = {
      id: book._id,
      title: book.title,
      description: book.description,
      price: price.price,
      quantity: book.quantity,
      cover: book.cover,
      updatedAt: price.date
    }

    allBooksWithFullData.push(fullBookData)
  }

  return response.status(200).json({state: true, data: allBooksWithFullData}).end()
}

export default getBooks