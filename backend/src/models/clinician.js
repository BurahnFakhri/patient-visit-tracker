'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Clinician extends Model {
    static associate(models) {
      Clinician.hasMany(models.Visit, {
        foreignKey: 'clinicianId',
        as: 'visits',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }

    static async authenticate(email, password) {
      const clinician = await this.findOne({ where: { email } });
      if (clinician) {
        const isPasswordMatch = await bcrypt.compare(password, clinician.password);
        if (isPasswordMatch) {
          return clinician;
        }
      }
      return null;
    }
  }

  Clinician.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      operatingHours: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergencyMobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalDoctor: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      totalStaff: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      licenseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      specialties: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Clinician',
      tableName: 'clinicians',
      timestamps: true,
    }
  );

  return Clinician;
};
