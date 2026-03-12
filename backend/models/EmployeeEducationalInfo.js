const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmployeeEducationalInfo = sequelize.define("EmployeeEducationalInfo", {

    eei_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    educational_degree: {
        type: DataTypes.STRING(150)
    },

    educational_institution: {
        type: DataTypes.STRING(200)
    },

    educational_field: {
        type: DataTypes.STRING(150)
    },

    graduation_date: {
        type: DataTypes.DATEONLY
    },

    description: {
        type: DataTypes.STRING(255)
    },

    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

},
    {
        tableName: "employee_educational_info",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = EmployeeEducationalInfo;