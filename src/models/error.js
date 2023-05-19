'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Error extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, {
        foreignKey: 'project_id',
      });
    }
  }
  Error.init(
    {
      project_id: DataTypes.INTEGER,
      error_message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Error',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Error;
};
