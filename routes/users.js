const { register } = require('../controllers/users');
const { login } = require('../controllers/users');
const { getAllUsers } = require('../controllers/users');
const { deleteUsers } = require('../controllers/users');
const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/deleteUsers', deleteUsers);

router.get('/allUsers/:id', getAllUsers);

module.exports = router;
