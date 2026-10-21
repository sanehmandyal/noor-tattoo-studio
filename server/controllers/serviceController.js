import { Service } from '../models/Service.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(Service);

export const getServices = crud.getAll;
export const getService = crud.getOne;
export const createService = crud.create;
export const updateService = crud.update;
export const deleteService = crud.delete;

export default {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
};
