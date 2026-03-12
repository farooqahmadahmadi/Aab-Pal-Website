const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectDocuments = sequelize.define(
    "ProjectDocuments",
    {
        document_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        document_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        document_description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        document_file_url: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "project_documents",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = ProjectDocuments;