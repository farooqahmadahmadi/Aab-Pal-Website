const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EquipmentDocuments = sequelize.define("EquipmentDocuments", {
    document_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    equipment_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    document_name: {
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
}, {
    tableName: "equipment_documents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = EquipmentDocuments;