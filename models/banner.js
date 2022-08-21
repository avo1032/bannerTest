const Sequelize = require('sequelize');
module.exports = class Banner extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        bannerId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING,
        },
        content: {
          type: Sequelize.STRING,
          defaultValue: '',
        },
        state: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        link: {
            type: Sequelize.STRING,
            defaultValue: '',
        },
        image: {
            type: Sequelize.STRING,
            defaultValue: '',
        }
      },
      {
        sequelize,
        modelName: 'Banner',
        tableName: 'Banners',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    Banner.belongsTo(db.User, {
        foreignKey: 'userId',
        sourceKey: 'userId',
        onDelete: 'CASCADE',
      });
  }
};
