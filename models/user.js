'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'email already in use!'
        },
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Please input an email address'
          },
          notEmpty: { msg: 'Please input email address' }
        }
      },
      password: {
        type: DataTypes.STRING,
        min: {
          args: 8,
          msg: 'password must be at least 8 characters.'
        },
        allowNull: false
      },
      username: {
        type: DataTypes.STRING(32),
        unique: {
          args: true,
          msg: 'username already in use!'
        },
        allowNull: false,
        defaultValue: '',
        validate: {
          min: {
            args: 5,
            msg:
              'Username must start with a letter, have no spaces, and be at least 5 characters.'
          },
          max: {
            args: 30,
            msg:
              'Username must start with a letter, have no spaces, and be at less than 30 characters.'
          },
          is: {
            args: /^[A-Za-z][A-Za-z0-9-]+$/i, // must start with letter and only have letters, numbers, dashes
            msg:
              'Username must start with a letter, have no spaces, and be 5 - 30 characters.'
          },
          notEmpty: { msg: 'Please input username' }
        }
      },
      salt: DataTypes.STRING(64),
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
        field: 'deleted_at'
      }
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      tableName: 'users'
    }
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.AccessToken, {
      as: 'access_token',
      foreignKey: 'userId'
    });
  };
  User.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());
    delete values.salt;
    delete values.password;
    return values;
  };
  return User;
};
