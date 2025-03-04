require("dotenv").config();

module.exports = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret_key_here",
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  },

  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "library_management",
    port: process.env.DB_PORT || 3306,
  },

  email: {
    host: process.env.EMAIL_HOST || "smtp.example.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER || "your_email@example.com",
    pass: process.env.EMAIL_PASS || "your_email_password",
    from: process.env.EMAIL_FROM || "library@example.com",
  },
};
