'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccessHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Project, {
        foreignKey: 'project_id',
      });
    }
  }
  AccessHistory.init(
    {
      project_id: DataTypes.INTEGER,
      n: DataTypes.INTEGER,
      year: DataTypes.STRING,
      month: DataTypes.STRING,
      day: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'AccessHistory',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return AccessHistory;
};
