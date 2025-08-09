'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // A patient can have many visits
      Patient.hasMany(models.Visit, {
        foreignKey: 'patientId',
        as: 'visits',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }

    static async authenticate(email, password) {
      const patient = await this.findOne({ where: { email } });
      if (patient) {
        const isPasswordMatch = await bcrypt.compare(password, patient.password);
        if (isPasswordMatch) {
          return patient;
        }
      }
      return null;
    }
  }

  Patient.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emergencyMobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      allergies: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      currentMedication: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      medicalHistory: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Patient',
      tableName: 'patients',
      timestamps: true
    }
  );

  return Patient;
};
