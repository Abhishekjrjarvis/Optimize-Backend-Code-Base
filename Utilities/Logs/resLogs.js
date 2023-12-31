const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const loggers = createLogger({
  transports: [
    new transports.File({
      filename: "./Error/access.log",
      maxFiles: "7d",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.MongoDB({
      level: "info",
      // db: `${process.env.DB_URL2}`,
      db:
        `${process.env.CONNECT_DB}` === "PROD"
          ? `${process.env.DB_URL}`
          : `${process.env.DB_URL2}`,
      options: {
        useUnifiedTopology: true,
      },
      collection: "Logs",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = loggers;
