import * as mongoose from 'mongoose'

export default function(next: (err?: mongoose.Error) => void) {
  const currentDate = new Date()
  
  this.updated_at = currentDate

  if (!this.created_at) {
    this.created_at = currentDate
  }

  next()
}