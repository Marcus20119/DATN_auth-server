'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AccessHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_id: {
        type: Sequelize.INTEGER,
      },
      n: {
        type: Sequelize.INTEGER,
      },
      year: {
        type: Sequelize.STRING,
      },
      month: {
        type: Sequelize.STRING,
      },
      day: {
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
    await queryInterface.dropTable('AccessHistories');
  },
};
