import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: Map,
      of: String
    },
    email: {
      type: Map,
      of: String
    },
    hash_email: {
      type: String,
      require: true
    },
    password: {
      type: String
    },
    role: {
      type: Map,
      of: String
    },
    avatar: {
      type: Map,
      of: String
    },
    address: {
      type: Map,
      of: String
    },
    refreachToken: {
      type: String
    }
  }
)
userSchema.set('toJSON', {
  versionKey: false,
  transform: (document, reternedUser) =>
  {
    reternedUser.id = reternedUser._id
    delete reternedUser._id
  }
})
const User = new mongoose.model("User", userSchema)


export default User