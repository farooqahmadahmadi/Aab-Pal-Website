const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const WebsiteLanguage = require("./WebsiteLanguage");

const OurTeamPage = sequelize.define(
  "OurTeamPage",
  {
    team_member_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    language_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    member_full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    member_position: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    member_biography: {
      type: DataTypes.TEXT,
    },

    member_photo: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "our_team_page",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = OurTeamPage;
