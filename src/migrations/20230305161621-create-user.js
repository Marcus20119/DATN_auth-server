'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_name: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      password: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      phone_number: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      gender: {
        type: Sequelize.INTEGER,
        defaultValue: -1,
      },
      avatar: {
        type: Sequelize.TEXT,
        defaultValue: '',
      },
      role_id: {
        type: Sequelize.INTEGER,
        defaultValue: -1,
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects', // Postgres thì viết hoa chữ đầu, mySQL thì không
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      project_key: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('Users');
  },
};
