const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
// const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
// dotenv.config({ path: path.resolve(__dirname, envFile) });

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  timezone: '+05:30', 
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const db = {};

// Import models
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Apply associations if needed
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;