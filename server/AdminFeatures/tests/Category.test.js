const mockingoose = require('mockingoose');
const Category = require('../models/Category');
const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());

const { getCategories, createCategory, deleteCategory } = require('../controllers/CategoryController');

// Testing on save category
app.post('/api/categories/save', createCategory);
describe('POST /api/categories/save', () => {
  it('should return mocked Category', async () => {
    const mockCategory = { title: 'Test', image: 'image' };
    mockingoose(Category).toReturn(mockCategory, 'save');

    const res = await request(app)
      .post('/api/categories/save')
      .send({ title: 'Test', image: 'image' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test');
    expect(res.body.image).toBe('image');
  });
});

// Testing on get category
app.get('/api/categories/get', getCategories);
describe('GET /api/categories/get', () => {
  it('should return mocked Categories', async () => {
    const mockData = [{ _id: '1', title: 'Test', image: 'image' }];
    mockingoose(Category).toReturn(mockData, 'find');

    const res = await request(app).get('/api/categories/get');

    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe('Test');
  });
});


// Testing on Delete Category
app.delete('/category/:id', deleteCategory);
describe('DELETE /category/:id', () => {
    it('should delete a category and return success message', async () => {
        const mockCategoryId = '1';

        mockingoose(Category).toReturn({ _id: mockCategoryId }, 'findOneAndDelete');

        const res = await request(app).delete(`/category/${mockCategoryId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Successfully Deleted');
    });
});
