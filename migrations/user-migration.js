module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.BIGINT,
                autoIncrement: true,
            },
            username: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            first_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: false,
            },
            last_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: false,
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            phone: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
            bio: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false,
            },
            password: {
                type: Sequelize.STRING(145),
                allowNull: false,
                unique: false,
            },
            photo: {
                type: Sequelize.STRING(145),
                allowNull: false,
                unique: false,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            }
        }),
    down: (queryInterface) => queryInterface.dropTable('users'),
};