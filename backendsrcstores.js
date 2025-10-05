const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { getAllStores, submitRating, getStoreRatings } = require('../controllers/storeController');

router.get('/', auth, getAllStores); // list all stores
router.post('/rating', auth, submitRating); // submit/update rating
router.get('/owner', auth, roles(['OWNER']), getStoreRatings); // owner view ratings

module.exports = router;