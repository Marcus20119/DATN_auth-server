'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Staff.init(
    {
      avatar: DataTypes.TEXT,
      full_name: DataTypes.STRING,
      gender: DataTypes.INTEGER,
      day_of_birth: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      email: DataTypes.STRING,
      is_deleted: DataTypes.BOOLEAN,
      exp: DataTypes.STRING,
      hometown: DataTypes.STRING,
      degree: DataTypes.STRING,
      major: DataTypes.STRING,
      address: DataTypes.TEXT,
      languages: DataTypes.ARRAY(DataTypes.STRING),
      work_unit: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Staff',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Staff;
};
