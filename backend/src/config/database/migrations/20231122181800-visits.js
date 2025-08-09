'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('visits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clinicianId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'clinicians',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      patientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'patients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      doctorName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('consult', 'followUp', 'checkup', 'emergency')
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true
      },
      appointmentDate: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      appointmentTime: {
        allowNull: true,
        type: Sequelize.TIME
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirm', 'complete', 'cancel'),
        defaultValue: 'pending',
        allowNull: false 
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
    await queryInterface.dropTable('visits');
  }
};