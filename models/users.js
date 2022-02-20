var bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.BIGINT,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: false,
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false,
        },
        password: {
            type: DataTypes.STRING(145),
            allowNull: false,
            unique: false,
        },
        photo: {
            type: DataTypes.STRING(145),
            allowNull: false,
            unique: false,
            defaultValue: 'NULL',
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        underscoredAll: true,
        tableName: 'users',
        hooks: {
            beforeCreate: (users) => {
                const salt = bcrypt.genSaltSync();
                users.salt = salt;
                users.password = bcrypt.hashSync(users.password, salt);
            },
            beforeUpdate: (users) => {
                if (users.password) {
                    const salt = bcrypt.genSaltSync();
                    users.password = bcrypt.hashSync(users.password, salt);
                }
            },
        }
    });

    users.prototype.validPassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    }
    return users;
}