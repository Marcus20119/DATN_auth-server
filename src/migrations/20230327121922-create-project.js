'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      project_key: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      staff_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      user_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      staff_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      user_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  },
};
