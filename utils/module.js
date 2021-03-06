'use strict';
var exports = module.exports
  , findup = require('findup-sync')
  , fs = require('fs')
  , nameUtils = require('./name')
  , path = require('path');

/**
 * Returns modules' names in path
 * @param {String} modulePath - path to module
 * @param {String} symbol - character to split by
 * @return {Array} - module names
 */
function extractBasedOnChar(modulePath, symbol) {
  var modules = []
    // path after last symbol is module name
    , moduleName = modulePath.slice(modulePath.lastIndexOf(symbol)).replace(symbol, '')
    , parentModuleName;

  modules.push(moduleName);

  // determine if user provided more than 1 symbol
  parentModuleName = modulePath.slice(0, modulePath.lastIndexOf(symbol));
  if (parentModuleName.indexOf(symbol) > -1) {
    parentModuleName = modulePath.slice(parentModuleName.lastIndexOf(symbol), modulePath.lastIndexOf(symbol));
    parentModuleName = parentModuleName.replace(symbol, '');
  }

  modules.push(parentModuleName);

  return modules;
}

exports.getAppDir = function getAppDir() {
  var appDir = require(path.join(path.dirname(findup('.yo-rc.json')), 'build.config.js')).appDir;
  if (appDir[appDir.length - 1] === '/' || appDir[appDir.length - 1] === '\\') {
    appDir = appDir.slice(0, appDir.length - 1);
  }
  return appDir;
};

/**
 * Returns child and parent module names
 * @param {String} modulePath - path to module
 * @return {Array} - [child, parent]
 */
exports.extractModuleNames = function extractModuleNames(modulePath) {
  var appName;
  // return appName for app.js
  if (modulePath === exports.getAppDir()) {
    appName = require(path.join(path.dirname(findup('.yo-rc.json')), 'package.json')).name;
    return [appName, null];
  }

  modulePath = modulePath.replace(/\\/g, '/');
  // uses module syntax
  if (modulePath.indexOf('/') > -1) {
    return extractBasedOnChar(modulePath, '/');
  }

  return [modulePath, null];
};

/**
 * Converts backslashes and forwardslashes to path separator
 * @param {String} modulePath - path to module
 * @return {String} - normalized module path
 */
exports.normalizeModulePath = function normalizeModulePath(modulePath) {
  if (modulePath === exports.getAppDir()) {
    return '';
  }

  modulePath = modulePath.replace(/[\\\/]/g, path.sep);
  modulePath = modulePath.split(path.sep).map(nameUtils.hyphenName).join(path.sep);

  return modulePath;
};

/**
 * Returns if module exists in app
 * @param {String} modulePath - path to module
 * @return {Boolean} - does module exist?
 */
exports.moduleExists = function moduleExists(modulePath) {
  // check if file exists
  var yoPath = path.dirname(findup('yo-rc.json'))
    , fullPath;

  if (modulePath === exports.getAppDir()) {
    return true;
  }

  fullPath = path.join(yoPath, exports.getAppDir(), exports.normalizeModulePath(modulePath));

  return fs.existsSync(fullPath);
};
