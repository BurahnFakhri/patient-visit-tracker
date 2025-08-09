'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('12345678', salt);
    const date = new Date();

    await queryInterface.bulkInsert('clinicians', [
      {
        name: 'General Medical Center',
        email: 'johndoe@gmail.com',
        mobile: '98989897658',
        password: hashPassword,
        image: null,
        website: 'https://drjohndoeclinic.com',
        address: '123 Main Street, Springfield',
        operatingHours: 'Mon-Fri 9AM-6PM',
        emergencyMobile: '1234567890',
        totalDoctor: 5,
        totalStaff: 10,
        licenseNumber: 'CLN-12345',
        description: 'Specialist in general medicine and emergency care.',
        specialties: 'General Medicine, Emergency',
        createdAt: date,
        updatedAt: date
      },
      {
        name: 'Heal Medical Center',
        email: 'janesmith@gmail.com',
        mobile: '9564989765',
        password: hashPassword,
        image: null,
        website: 'https://drjanesmithclinic.com',
        address: '456 Elm Street, Metropolis',
        operatingHours: 'Tue-Sat 10AM-5PM',
        emergencyMobile: '9876543210',
        totalDoctor: 3,
        totalStaff: 8,
        licenseNumber: 'CLN-67890',
        description: 'Expert in pediatrics and adolescent health.',
        specialties: 'Pediatrics, Adolescent Medicine',
        createdAt: date,
        updatedAt: date
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clinicians', null, {});
  }
};