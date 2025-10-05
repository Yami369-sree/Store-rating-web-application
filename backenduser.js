const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(60), allowNull:false, validate:{ len: [20,60] } },
    email: { type: DataTypes.STRING, allowNull:false, unique:true, validate:{ isEmail:true } },
    address: { type: DataTypes.STRING(400) },
    password: { type: DataTypes.STRING, allowNull:false },
    role: { type: DataTypes.ENUM('ADMIN','USER','OWNER'), defaultValue: 'USER' }
  }, { tableName: 'users' });

  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};