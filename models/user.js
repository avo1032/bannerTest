const Sequelize = require('sequelize');
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userEmail: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
          defaultValue: '',
        },
        grade: {
          type: Sequelize.STRING,
          defaultValue: 'silver',
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'UsersBanner',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    User.hasMany(db.Banner, {
      foreignKey: 'userId',
      sourceKey: 'userId',
      onDelete: 'CASCADE',
    });
  }
};
