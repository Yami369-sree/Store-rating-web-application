const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

// Dashboard counts
exports.dashboard = async (req,res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new user (ADMIN)
exports.addUser = async (req,res) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error:'Missing fields' });
    const user = await User.create({ name, email, address, password, role });
    res.json(user);
  } catch(err){
    res.status(500).json({ error: err.message });
  }
};

// List users with optional filters
exports.listUsers = async (req,res) => {
  try {
    const { name, email, address, role } = req.query;
    let where = {};
    if(name) where.name = { [Op.like]: `%${name}%` };
    if(email) where.email = { [Op.like]: `%${email}%` };
    if(address) where.address = { [Op.like]: `%${address}%` };
    if(role) where.role = role.toUpperCase();

    const users = await User.findAll({ where });
    res.json(users);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

// List stores with filters
exports.listStores = async (req,res) => {
  try {
    const { name, email, address } = req.query;
    let where = {};
    if(name) where.name = { [Op.like]: `%${name}%` };
    if(email) where.email = { [Op.like]: `%${email}%` };
    if(address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({ where });
    res.json(stores);
  } catch(err){ res.status(500).json({ error: err.message }); }
};