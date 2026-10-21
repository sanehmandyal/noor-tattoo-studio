import mongoose from 'mongoose';
const { Schema } = mongoose;

export const timestampOpts = { timestamps: true };

export const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const withSlug = (schemaDef, slugSourceField = 'title') => {
  const schema = new Schema(
    {
      slug: { type: String, unique: true, sparse: true },
      ...schemaDef
    },
    timestampOpts
  );

  schema.pre('validate', function () {
    if (!this.slug && this[slugSourceField]) {
      this.slug = slugify(this[slugSourceField]);
    }
  });

  return schema;
};

export const seoSchemaDef = {
  title: String,
  description: String,
  canonical: String
};
