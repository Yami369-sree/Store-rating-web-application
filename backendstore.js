module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
    name: { type: DataTypes.STRING(150), allowNull:false },
    email: { type: DataTypes.STRING, validate:{ isEmail:true } },
    address: { type: DataTypes.STRING(400) },
    owner_id: { type: DataTypes.INTEGER, allowNull:true }
  }, { tableName: 'stores' });

  return Store;
};