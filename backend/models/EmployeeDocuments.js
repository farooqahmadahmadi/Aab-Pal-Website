const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmployeeDocuments = sequelize.define("EmployeeDocuments", {

    document_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    doc_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    doc_description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    doc_file_url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

},
    {
        tableName: "employee_documents",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = EmployeeDocuments;