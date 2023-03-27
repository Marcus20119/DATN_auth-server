'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  RefreshToken.init(
    {
      user_id: DataTypes.INTEGER,
      refresh_token: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return RefreshToken;
};
