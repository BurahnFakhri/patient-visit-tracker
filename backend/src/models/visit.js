'use strict';
const { Model } = require('sequelize');
const { Clinician, Patient } = require('./index');
const { to12Hour } = require('../helper/dateHelper');


module.exports = (sequelize, DataTypes) => {
  class Visit extends Model {
    static associate(models) {
      Visit.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      Visit.belongsTo(models.Clinician, {
        foreignKey: 'clinicianId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
    static async getPaginatedVisits(whereClause, pageSize, page) {
      const totalCount = await Visit.count({where: whereClause});
      const totalPages = Math.ceil(totalCount / pageSize);
      const visits = await Visit.findAll({
        where: whereClause,
        include: [
           {
            association: 'Clinician',      // alias name
            attributes: ['id', 'name', 'mobile']     // only these columns from Clinician
          },
          {
            association: 'Patient',
            attributes: ['id', 'firstName', 'lastName', 'mobile']
          }
        ],
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize) 
      });
      if(visits) {
        for (const visit of visits) {
          visit.dataValues.time = to12Hour(visit.appointmentTime)
          // visit.dataValues.time = "09:00 AM";      
        }
      }
      return {data: visits, totalPages, currentPage: page, pageSize}; 
    }
  }

  Visit.init({
    clinicianId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('consult', 'followUp', 'checkup', 'emergency'),
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    appointmentTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirm', 'complete', 'cancel'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Visit',
    tableName: 'visits',
  });

  return Visit;
};