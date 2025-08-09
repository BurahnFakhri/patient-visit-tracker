'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mobile: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergencyMobile: {
        type: Sequelize.STRING,
        allowNull: true
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      currentMedication: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      medicalHistory: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('patients');
  }
};
