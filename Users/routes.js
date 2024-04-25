import * as userDao from './dao.js';

export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    try {
      const user = await userDao.createUser(req.body);
      res.json(user);
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  const deleteUser = async (req, res) => {
    const status = await userDao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findAllUsers = async (req, res) => {
    const users = await userDao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await userDao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await userDao.updateUser(userId, req.body);
    const currentUser = await userDao.findUserById(userId);
    req.session['currentUser'] = currentUser;
    res.json(status);
  };

  const signup = async (req, res) => {
    const user = await userDao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: 'Username already taken' });
      return;
    }
    const currentUser = await userDao.createUser(req.body);
    req.session['currentUser'] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await userDao.findUserByCredentials(username, password);

    if (currentUser) {
      req.session['currentUser'] = currentUser;
      res.json(currentUser);
    } else {
      res.sendStatus(401);
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.json(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    res.json(currentUser);
  };

  app.post('/api/users', createUser);
  app.get('/api/users', findAllUsers);
  app.get('/api/users/:userId', findUserById);
  app.put('/api/users/:userId', updateUser);
  app.delete('/api/users/:userId', deleteUser);
  app.post('/api/users/signup', signup);
  app.post('/api/users/signin', signin);
  app.post('/api/users/signout', signout);
  app.post('/api/users/profile', profile);
}
