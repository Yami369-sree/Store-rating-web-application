const jwt = require('jsonwebtoken');
const { User } = require('../models');

const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    if (name.length < 20 || name.length > 60) return res.status(400).json({ error: 'Name must be 20-60 chars' });
    if (!passwordRegex.test(password)) return res.status(400).json({ error: 'Password policy fail' });
    const user = await User.create({ name, email, address, password, role: 'USER' });
    return res.json({ id: user.id, email: user.email });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await user.validPassword(password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    if (!await user.validPassword(currentPassword)) return res.status(400).json({ error: 'Current password wrong' });
    if (!passwordRegex.test(newPassword)) return res.status(400).json({ error: 'Password policy fail' });
    user.password = newPassword;
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};