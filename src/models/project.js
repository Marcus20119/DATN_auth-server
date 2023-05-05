'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.User, {
        foreignKey: 'project_id',
      });
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      project_key: DataTypes.STRING,
      staff_count: DataTypes.INTEGER,
      user_count: DataTypes.INTEGER,
      staff_ids: DataTypes.ARRAY(DataTypes.INTEGER),
      user_ids: DataTypes.ARRAY(DataTypes.INTEGER),
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Project',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Project;
};
