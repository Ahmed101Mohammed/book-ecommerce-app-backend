import mongoose from "mongoose"

const BlockedAccessTokensSchema = new mongoose.Schema({
  token: {
    type: Map,
    of: String
  },
  hashedToken: {
    type: String
  }
})

BlockedAccessTokensSchema.set('toJSON', {
  versionKey: false,
  transform: (document, reternedUser) =>
  {
    reternedUser.id = reternedUser._id
    delete reternedUser._id
  }
})

const BlockedAccessToken = new mongoose.model('blockedAccessToken', BlockedAccessTokensSchema)

export default BlockedAccessToken