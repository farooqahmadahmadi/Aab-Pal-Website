const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ClientInfo = sequelize.define(
    "ClientInfo",
    {
        client_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        client_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        client_nid_number: {
            type: DataTypes.STRING(15),
            unique: true,
            allowNull: false
        },
        client_phone: {
            type: DataTypes.STRING(20)
        },
        client_email: {
            type: DataTypes.STRING(100)
        },
        client_address: {
            type: DataTypes.STRING(255)
        },
        client_photo_url: {
            type: DataTypes.STRING(255)
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "client_info",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = ClientInfo;