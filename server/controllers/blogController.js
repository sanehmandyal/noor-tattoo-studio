import { BlogPost } from '../models/BlogPost.js';
import { createCrudController } from './crudFactory.js';
import { wrap } from '../middleware/errorHandler.js';

const crud = createCrudController(BlogPost, { publicFilter: { published: true } });

export const getPosts = crud.getAll;
export const getPost = crud.getOne;
export const createPost = crud.create;
export const updatePost = crud.update;
export const deletePost = crud.delete;

// Admin route to retrieve all posts including drafts/unpublished
export const getAdminPosts = wrap(async (req, res) => {
  const items = await BlogPost.find().sort('-createdAt');
  res.json({ items });
});

export default {
  getPosts,
  getPost,
  getAdminPosts,
  createPost,
  updatePost,
  deletePost
};
