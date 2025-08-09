'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // move to next day
    tomorrow.setHours(0, 0, 0, 0);

    await queryInterface.bulkInsert('visits', [
      {
        clinicianId: 1,
        patientId: 1,
        doctorName: 'Dr. Michael Chen',
        type: 'consult',
        notes: 'Initial consultation regarding general health.',
        appointmentDate: now,
        appointmentTime: '09:00:00',
        status: 'pending',
        createdAt: now,
        updatedAt: now
      },
      {
        clinicianId: 2,
        patientId: 2,
        doctorName: 'Dr. Emily Roberts',
        type: 'followUp',
        notes: 'Follow-up on recent lab results.',
        appointmentDate: tomorrow, // +1 day
        appointmentTime: '12:00:00',
        status: 'confirm',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('visits', null, {});
  }
};
