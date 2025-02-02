import mongoose from "mongoose"

// price_history: ID | bookID | date | price
const priceSchema = new mongoose.Schema({
  bookId: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  }, 
  date: 
  { 
    type: Date, 
    default: Date.now 
  },
  price: 
  { 
    type: Number, 
    required: true, 
    min: 0 
  }
});


priceSchema.set('toJSON', {
  versionKey: false,
  transform: (document, returnedBook) =>
  {
    returnedBook.id = returnedBook._id
    delete returnedBook._id
  }
})

const Price = new mongoose.model('Price', priceSchema)

export default Price