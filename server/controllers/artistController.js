import { Artist } from '../models/Artist.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(Artist);

export const getArtists = crud.getAll;
export const getArtist = crud.getOne;
export const createArtist = crud.create;
export const updateArtist = crud.update;
export const deleteArtist = crud.delete;

export default {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist
};
