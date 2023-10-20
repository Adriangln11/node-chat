import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
    socketId: { type: String },
  },
  { versionKey: false }
)

export default mongoose.model('users', UserSchema)
