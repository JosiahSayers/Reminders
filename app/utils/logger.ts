import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "http",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: `${getLogDirectory()}/error.log`,
      level: "error",
    }),
    new transports.File({ filename: `${getLogDirectory()}/combined.log` }),
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (Bun.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      level: "silly",
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

function getLogDirectory() {
  if (Bun.env.NODE_ENV === "production") {
    return "/src/usr/app/logs";
  }

  return "./logs";
}
