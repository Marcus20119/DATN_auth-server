'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.RefreshToken, {
        foreignKey: 'user_id',
      });
      this.belongsTo(models.Project, {
        foreignKey: 'project_id',
      });
    }
  }
  User.init(
    {
      user_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      gender: DataTypes.INTEGER,
      avatar: DataTypes.TEXT,
      role_id: DataTypes.INTEGER,
      is_deleted: DataTypes.BOOLEAN,
      is_activated: DataTypes.BOOLEAN,
      project_id: DataTypes.INTEGER,
      project_key: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return User;
};
