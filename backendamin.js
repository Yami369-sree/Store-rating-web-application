const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { dashboard, addUser, listUsers, listStores } = require('../controllers/adminController');

router.use(auth, roles(['ADMIN']));

router.get('/dashboard', dashboard);
router.post('/add-user', addUser);
router.get('/users', listUsers);
router.get('/stores', listStores);

module.exports = router;