import { Gallery } from '../models/Gallery.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(Gallery, { populate: 'artist' });

export const getGallery = crud.getAll;
export const getGalleryItem = crud.getOne;
export const createGalleryItem = crud.create;
export const updateGalleryItem = crud.update;
export const deleteGalleryItem = crud.delete;

export default {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
