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
      slug: { type: String, unique: true, sparse: true, index: true },
      ...schemaDef
    },
    timestampOpts
  );

  schema.pre('validate', async function () {
    if (!this.slug && this[slugSourceField]) {
      const baseSlug = slugify(this[slugSourceField]) || 'item';
      let candidate = baseSlug;
      let counter = 1;
      const Model = this.constructor;
      try {
        while (await Model.exists({ slug: candidate, _id: { $ne: this._id } })) {
          candidate = `${baseSlug}-${counter++}`;
        }
      } catch {
        // If DB query fails during validation, fallback to timestamp suffix
        candidate = `${baseSlug}-${Date.now().toString(36)}`;
      }
      this.slug = candidate;
    }
  });

  return schema;
};

export const seoSchemaDef = {
  title: String,
  description: String,
  canonical: String
};
