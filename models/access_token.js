'use strict';
module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define(
    'AccessToken',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'access_token'
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'refresh_token'
      }
    },
    {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      tableName: 'access_tokens'
    }
  );
  AccessToken.associate = function(models) {
    AccessToken.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'access_token'
    });
  };
  return AccessToken;
};
