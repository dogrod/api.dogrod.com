import * as mongoose from 'mongoose'
import updateTime from '../utils/update-time'

export type UserModel = mongoose.Document & {
  name: string,
  username: string,
  password: string,
  email: string,
  admin: string,
  location: string,
  age: string,
  sex: string,
  create_at: Date,
  update_at: Date,
}

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
  email: { type: String },
  admin: { type: Boolean },
  location: { type: String },
  age: { type: Number },
  sex: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

userSchema.index({ username: 1}, { unique: true })

userSchema.pre('save', updateTime)

// create a model using schema
const User = mongoose.model('User', userSchema)

export default User