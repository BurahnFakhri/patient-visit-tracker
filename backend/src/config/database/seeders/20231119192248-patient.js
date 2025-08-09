'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('12345678', salt);
    const date = new Date();

    await queryInterface.bulkInsert('patients', [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@gmail.com',
        mobile: '9564989765',
        password: hashPassword,
        image: null,
        dob: '1990-05-10',
        address: '123 Main St, New York, NY',
        emergencyMobile: '9876543210',
        allergies: 'Peanuts',
        currentMedication: 'Ibuprofen',
        medicalHistory: 'Asthma',
        createdAt: date,
        updatedAt: date
      },
      {
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob@gmail.com',
        mobile: '9564983546',
        password: hashPassword,
        image: null,
        dob: '1985-11-22',
        address: '456 Elm St, Los Angeles, CA',
        emergencyMobile: '8765432109',
        allergies: 'None',
        currentMedication: 'Paracetamol',
        medicalHistory: 'Hypertension',
        createdAt: date,
        updatedAt: date
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('patients', {
      email: ['alice@gmail.com', 'bob@gmail.com']
    }, {});
  }
};