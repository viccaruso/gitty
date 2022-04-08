const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('Should redirect to the github oauth page', async () => {
    const res = await request(app).get('/api/v1/github/auth');

    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/auth\/callback/i
    );
  });

  it('Should login and redirect users to /api/v1/posts', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/auth/callback?code=42')
      .redirects(1);

    expect(res.req.path).toEqual('/api/v1/posts');
  });

  it('Should return 401 Unauthorized if a user tries to view posts while not logged in', async () => {
    const res = await request(app).get('/api/v1/posts');

    expect(res.body).toEqual({
      message: 'You must be signed in to continue.',
      status: 401
    });
  });

  it('Should return 401 Unauthorized if a user tries to create a post while not logged in', async () => {
    const res = await request(app).post('/api/v1/posts').send({ post: 'This is a test.' });
    expect(res.body).toEqual({
      message: 'You must be signed in to continue.',
      status: 401
    });
  });

  it('Should return a list of all posts as long as a user is logged in', async () => {
    const agent = await request.agent(app);
    await agent.get('/api/v1/github/auth/callback?code=42').redirects(1);
    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual(
      [
        { id: '1', post: 'This is a post.' }, { id: '2', post: 'This is another post.' }
      ]
    );
  });

  it('Should allow a user to create a post as long as a user is logged in', async () => {
    const agent = await request.agent(app);
    await agent.get('/api/v1/github/auth/callback?code=42').redirects(1);
    const res = await agent.post('/api/v1/posts').send({ post: 'This is a test.' });
    expect(res.body).toEqual({ id: expect.any(String), post: 'This is a test.' });
  });

  it('Should sign a user out', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/auth/callback?code=42').redirects(1);
    const res = await agent.delete('/api/v1/github/auth');
    expect(res.body).toEqual({
      message: 'You have logged out.'
    });
  });

  it('Should GET three random authors/quotes', async () => {
    const expected = [
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) }
    ];

    const res = await request(app).get('/api/v1/quotes');
    expect(res.body).toEqual(expected);
    
  });
});
