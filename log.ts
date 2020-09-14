// import envalid, { num, str } from 'envalid'
// import winston from 'winston'
// import { Papertrail } from 'winston-papertrail'
//
// const LOG_LEVELS = ['debug', 'verbose', 'info', 'warn', 'error']
//
// const env = envalid.cleanEnv(process.env, {
//   PAPERTRAIL_LOG_LEVEL: str({
//     desc: `Papertrail log level (${LOG_LEVELS})`,
//     choices: LOG_LEVELS,
//     devDefault: 'debug',
//   }),
//   PAPERTRAIL_HOST: str({ desc: 'Papertrail hostname' }),
//   PAPERTRAIL_PORT: num({ desc: 'Papertrail port number' }),
//   PAPERTRAIL_CLIENT_NAME: str({ desc: 'Papertrail client name' }),
//
//   CONSOLE_LOG_LEVEL: str({
//     desc: `Console log level (${LOG_LEVELS})`,
//     choices: LOG_LEVELS,
//     devDefault: 'debug',
//   }),
// })
//
// const consoleTransport = new winston.transports.Console({
//   level: env.CONSOLE_LOG_LEVEL,
//   stderrLevels: ['error'],
// })
//
// const papertrailTransport = new Papertrail({
//   level: env.PAPERTRAIL_LOG_LEVEL,
//   host: env.PAPERTRAIL_HOST,
//   port: env.PAPERTRAIL_PORT,
//   hostname: env.PAPERTRAIL_CLIENT_NAME,
//   colorize: true,
//   logFormat(level: string, message: string) {
//     return '[' + level + '] ' + message
//   },
// })
//
// export default new winston.Logger({
//   levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 },
//   transports: [papertrailTransport, consoleTransport],
// })
