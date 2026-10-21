import { wrap, httpErr } from '../middleware/errorHandler.js';

export const createCrudController = (Model, { publicFilter = {}, populate = '' } = {}) => {
  return {
    getAll: wrap(async (req, res) => {
      const { page = 1, limit = 12, q, ...filters } = req.query;
      const filter = { ...publicFilter };

      for (const k of ['style', 'artist', 'category', 'placement', 'featured']) {
        if (typeof filters[k] === 'string') filter[k] = filters[k];
      }

      if (typeof q === 'string' && q) {
        filter.$or = ['title', 'name', 'question'].map(k => ({
          [k]: new RegExp(q.slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        }));
      }

      const parsedLimit = Math.min(+limit || 12, 50);
      const parsedPage = Math.max(+page || 1, 1);

      const [items, total] = await Promise.all([
        Model.find(filter)
          .populate(populate || [])
          .sort('-createdAt')
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        Model.countDocuments(filter)
      ]);

      res.json({
        items,
        total,
        pages: Math.ceil(total / parsedLimit),
        currentPage: parsedPage
      });
    }),

    getOne: wrap(async (req, res) => {
      const key = req.params.key;
      const query = /^[a-f\d]{24}$/i.test(key) ? { _id: key } : { slug: key };
      const doc = await Model.findOne({ ...query, ...publicFilter }).populate(populate || []);
      if (!doc) throw httpErr(404, 'Not found');
      res.json(doc);
    }),

    create: wrap(async (req, res) => {
      const created = await Model.create(req.body);
      res.status(201).json(created);
    }),

    update: wrap(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) throw httpErr(404, 'Not found');
      doc.set(req.body);
      await doc.save();
      res.json(doc);
    }),

    delete: wrap(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw httpErr(404, 'Not found');
      res.json({ ok: true });
    })
  };
};
