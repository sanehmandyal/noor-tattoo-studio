import mongoose from 'mongoose';
import { withSlug, seoSchemaDef } from './helpers.js';

const { model } = mongoose;

const serviceSchema = withSlug({
  title: { type: String, required: true },
  description: String,
  price: Number,
  duration: String,
  image: String,
  faqs: [{ q: String, a: String }],
  seo: seoSchemaDef
});

export const Service = mongoose.models.Service || model('Service', serviceSchema);
export default Service;
