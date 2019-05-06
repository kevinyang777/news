"use strict";
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define(
    "News",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      newsHeader: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "news_header"
      },
      newsContent: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "news_content"
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "status"
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
      underscored: true,
      tableName: "news"
    }
  );
  return News;
};
