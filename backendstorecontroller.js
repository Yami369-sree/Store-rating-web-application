const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

// Get all stores (for users)
exports.getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    let where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          where: { user_id: req.user.id },
          required: false
        }
      ]
    });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit or update rating
exports.submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    const existing = await Rating.findOne({ where: { user_id: req.user.id, store_id } });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: 'Rating updated' });
    }

    const newRating = await Rating.create({ user_id: req.user.id, store_id, rating });
    return res.json(newRating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// For store owner: get ratings for their store
exports.getStoreRatings = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    const avgRating = ratings.reduce((sum,r)=>sum+r.rating,0)/Math.max(ratings.length,1);
    res.json({ store, ratings, averageRating: avgRating.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};