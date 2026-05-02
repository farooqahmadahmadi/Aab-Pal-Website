const sequelize = require("../config/db");
// No associations required for WebsiteLanguage,
const WebsiteLanguage = require("./WebsiteLanguage");
const HomePage = require("./HomePage");
const BlogsPage = require("./BlogsPage");
const BlogComments = require("./BlogComments");
const FaqsPage = require("./FaqsPage");
const PrivacyAndPolicyPage = require("./PrivacyAndPolicyPage");
const ServicesPage = require("./ServicesPage");
const OurTeamPage = require("./OurTeamPage");
const TermsAndConditionsPage = require("./TermsAndConditionsPage");
const OurProjectsPage = require("./OurProjectsPage");
const AboutPage = require("./AboutPage");
// No associations required for TestimonialsPage
const TestimonialsPage = require("./TestimonialsPage");
// No associations required for WebsitePages
const WebsitePages = require("./WebsitePages");
const WebPageViews = require("./WebPageViews");
const WebPageViewStats = require("./WebPageViewStats");

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

// Privacy Policy Page → Website Languages
PrivacyAndPolicyPage.belongsTo(WebsiteLanguage, { foreignKey: "language_id" });
WebsiteLanguage.hasMany(PrivacyAndPolicyPage, { foreignKey: "language_id" });

// Services Page → Website Languages
ServicesPage.belongsTo(WebsiteLanguage, { foreignKey: "language_id" });
WebsiteLanguage.hasMany(ServicesPage, { foreignKey: "language_id" });

// Our Team Page → Website Languages
OurTeamPage.belongsTo(WebsiteLanguage, { foreignKey: "language_id" });
WebsiteLanguage.hasMany(OurTeamPage, { foreignKey: "language_id" });

// Terms & Conditions Page → Website Languages
TermsAndConditionsPage.belongsTo(WebsiteLanguage, {
  foreignKey: "language_id",
});
WebsiteLanguage.hasMany(TermsAndConditionsPage, { foreignKey: "language_id" });

// Our Projects Page → Website Languages
OurProjectsPage.belongsTo(WebsiteLanguage, { foreignKey: "language_id" });
WebsiteLanguage.hasMany(OurProjectsPage, { foreignKey: "language_id" });

// About Page → Website Languages
AboutPage.belongsTo(WebsiteLanguage, { foreignKey: "language_id" });
WebsiteLanguage.hasMany(AboutPage, { foreignKey: "language_id" });

// WebsitePages → WebPageViews
WebPageViews.belongsTo(WebsitePages, { foreignKey: "web_page_id" });
WebsitePages.hasMany(WebPageViews, { foreignKey: "web_page_id" });

// WebsitePages → WebPageViewStats
WebPageViewStats.belongsTo(WebsitePages, { foreignKey: "web_page_id" });
WebsitePages.hasMany(WebPageViewStats, { foreignKey: "web_page_id" });

module.exports = {
  sequelize,
  // No associations required for WebsiteLanguage,
  WebsiteLanguage,
  HomePage,
  BlogsPage,
  BlogComments,
  FaqsPage,
  ServicesPage,
  OurTeamPage,
  TermsAndConditionsPage,
  OurProjectsPage,
  AboutPage,
  // No associations required for TestimonialsPage
  TestimonialsPage,
  // No associations required for WebsitePages
  WebsitePages,
  WebPageViews,
  WebPageViewStats,
};
