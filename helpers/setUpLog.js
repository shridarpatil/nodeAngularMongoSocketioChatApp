'use strict';
var winston = require('winston');
var WinstonFileTransport = winston.transports.File;
var WinstonConsoleTransport = winston.transports.Console;

configLevel();

exports = winston;
module.exports = winston;
global.log = winston;

exports.configLevel = configLevel;

function configLevel(config) {
  winston.clear();

  config = config || {};

  var logLevel = 'debug';
  if (config.runMode === 'test') {
    logLevel = 'verbose';
  } else if (config.runMode === 'production') {
    logLevel = 'warn';
  }

  winston.add(WinstonConsoleTransport, {
    timestamp: true,
    colorize: true,
    level: logLevel
  });
}
