import * as bcrypt from 'bcrypt-nodejs'
import * as mongoose from 'mongoose'
import updateTime from '../utils/update-time'

export type User = mongoose.Document & {
  name: string,
  username: string,
  password: string,
  email: string,
  admin: string,
  location: string,
  age: string,
  avatar: string,
  website: string,
  gender: string,
  create_at: Date,
  update_at: Date,

  generateHash: (password: string) => string,
  validPassword: (password: string) => boolean,
}

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
  email: { type: String },
  admin: { type: Boolean },
  location: { type: String },
  age: { type: Number },
  avatar: String,
  website: String,
  gender: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

userSchema.index({ username: 1}, { unique: true })

userSchema.pre('save', updateTime)

// hash the password
userSchema.methods.generateHash = (password: string) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

// checking if password is valid
userSchema.methods.validPassword = function(password: string) {
  return bcrypt.compareSync(password, this.password)
}

// create a model using schema
const User = mongoose.model('User', userSchema) as mongoose.Model<User>

export default User