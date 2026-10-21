import { FAQ } from '../models/FAQ.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(FAQ, { publicFilter: { published: true } });

export const getFAQs = crud.getAll;
export const getFAQ = crud.getOne;
export const createFAQ = crud.create;
export const updateFAQ = crud.update;
export const deleteFAQ = crud.delete;

export default {
  getFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
