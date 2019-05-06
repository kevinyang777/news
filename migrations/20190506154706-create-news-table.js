'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('news', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      newsHeader: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "news_header"
      },
      newsContent: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "news_content"
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "status"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('news');
  }
};
