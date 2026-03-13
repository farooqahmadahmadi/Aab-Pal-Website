const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AttendanceShiftsInfo = sequelize.define(
    "AttendanceShiftsInfo",
    {
        attendance_shift_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        shift_name: {
            type: DataTypes.STRING(100)
        },

        check_in_start: {
            type: DataTypes.TIME
        },

        check_in_end: {
            type: DataTypes.TIME
        },

        check_out_start: {
            type: DataTypes.TIME
        },

        check_out_end: {
            type: DataTypes.TIME
        },

        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },

        reduce: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "attendance_shifts_info",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = AttendanceShiftsInfo;