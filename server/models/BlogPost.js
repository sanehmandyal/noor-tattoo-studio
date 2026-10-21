import mongoose from 'mongoose';
import { withSlug, seoSchemaDef } from './helpers.js';

const { model } = mongoose;

const blogPostSchema = withSlug({
  title: { type: String, required: true },
  excerpt: String,
  content: String,
  featuredImage: String,
  author: String,
  category: String,
  tags: [String],
  published: { type: Boolean, default: false },
  publishedAt: Date,
  seo: seoSchemaDef
});

export const BlogPost = mongoose.models.BlogPost || model('BlogPost', blogPostSchema);
export default BlogPost;
