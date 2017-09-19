import * as mongoose from 'mongoose'
import updateTime from '../utils/update-time'

export type ArticleModel = mongoose.Document & {
  title: string,
  label: string[],
  title_image: string, // title image url
  description: string,
  field: string,
  author: string,
  isPublished: boolean,
  create_at: Date,
  update_at: Date,
}

const articleSchema = new mongoose.Schema({
  title: String,
  label: Array,
  title_image: String,
  description: String,
  field: String,
  author: String,
  isPublished: Boolean,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

articleSchema.pre('save', updateTime)

const Article = mongoose.model('Article', articleSchema)

export default Article