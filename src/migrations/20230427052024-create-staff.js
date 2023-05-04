'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Staffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      avatar: {
        type: Sequelize.TEXT,
      },
      full_name: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.INTEGER,
      },
      day_of_birth: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
      },
      exp: {
        type: Sequelize.STRING,
      },
      hometown: {
        type: Sequelize.STRING,
      },
      degree: {
        type: Sequelize.STRING,
      },
      major: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      work_unit: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Staffs');
  },
};
