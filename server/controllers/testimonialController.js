import { Testimonial } from '../models/Testimonial.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(Testimonial);

export const getTestimonials = crud.getAll;
export const getTestimonial = crud.getOne;
export const createTestimonial = crud.create;
export const updateTestimonial = crud.update;
export const deleteTestimonial = crud.delete;

export default {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
