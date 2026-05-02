const sequelize = require("../config/db");
const WebsiteLanguage = require("./WebsiteLanguage");
const HomePage = require("./HomePage");
const BlogsPage = require("./BlogsPage");
const BlogComments = require("./BlogComments");
const FaqsPage = require("./FaqsPage");

// Home Page → Website Languages
HomePage.belongsTo(WebsiteLanguage, { foreignKey: "language_id" });
WebsiteLanguage.hasMany(HomePage, { foreignKey: "language_id" });

//Blogs Page → Website Languages
BlogsPage.belongsTo(WebsiteLanguage, { foreignKey: "language_id" });
WebsiteLanguage.hasMany(BlogsPage, { foreignKey: "language_id" });

// Blogs Page → Blog Comments
BlogsPage.hasMany(BlogComments, { foreignKey: "blog_id" });
BlogComments.belongsTo(BlogsPage, { foreignKey: "blog_id" });

// FAQs Page → Website Languages
FaqsPage.belongsTo(WebsiteLanguage, { foreignKey: "language_id" });
WebsiteLanguage.hasMany(FaqsPage, { foreignKey: "language_id" });
module.exports = {
  sequelize,
  WebsiteLanguage,
  HomePage,
  BlogsPage,
  BlogComments,
  FaqsPage,
};
