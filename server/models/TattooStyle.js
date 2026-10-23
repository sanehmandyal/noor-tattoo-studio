import mongoose from 'mongoose';
import { withSlug, seoSchemaDef } from './helpers.js';

const { Schema, model } = mongoose;

const specsSchema = new Schema(
  {
    needles: { type: String, default: '' },
    healingTime: { type: String, default: '' },
    painLevel: { type: String, default: '' },
    bestPlacements: { type: String, default: '' }
  },
  { _id: false }
);

const tattooStyleSchema = withSlug(
  {
    name: { type: String, required: true },
    tag: { type: String, required: true },
    badge: { type: String, default: '' },
    image: { type: String, required: true },
    lead: { type: String, default: '' },
    description: { type: String, default: '' },
    specs: { type: specsSchema, default: () => ({}) },
    technique: [{ type: String }],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    seo: seoSchemaDef
  },
  'name'
);

export const TattooStyle = mongoose.models.TattooStyle || model('TattooStyle', tattooStyleSchema);
export default TattooStyle;
