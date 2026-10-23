import { TattooStyle } from '../models/TattooStyle.js';
import { createCrudController } from './crudFactory.js';
import { wrap } from '../middleware/errorHandler.js';

const crud = createCrudController(TattooStyle, { publicFilter: { published: true } });

export const getStyles = crud.getAll;
export const getStyle = crud.getOne;
export const createStyle = crud.create;
export const updateStyle = crud.update;
export const deleteStyle = crud.delete;

// Admin route to retrieve all styles including drafts
export const getAdminStyles = wrap(async (req, res) => {
  const items = await TattooStyle.find().sort('order -createdAt');
  res.json({ items });
});

export default {
  getStyles,
  getStyle,
  getAdminStyles,
  createStyle,
  updateStyle,
  deleteStyle
};
