'use strict';
var _ = require('lodash')
  , fs = require('fs')
  , genBase = require('../genBase')
  , ngAddDep = require('ng-add-dep')
  , path = require('path')
  , utils = require('../utils')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.initialize = function initialize() {
  this.module = this.name;

  // used by genBase to know this is not a normal component for module-type structures
  // used for creating TypeScript reference path
  this.isModule = true;

  // if moduleName ends with a slash remove it
  if (this.module.charAt(this.module.length - 1) === '/' || this.module.charAt(this.module.length - 1) === '\\') {
    this.module = this.module.slice(0, this.module.length - 1);
  }
};

Generator.prototype.writing = function writing() {
  var filePath, filePathToCheck, depName, parentDir, parentModuleName;

  this.context = this.getConfig();

  // extrac the new module name (last part of path)
  this.context.moduleName = path.basename(this.module);

  // modify context because these were all performed on the ENTIRE module path
  // instead of just the new module's name
  this.context.lowerCamel = utils.lowerCamel(this.context.moduleName);
  this.context.hyphenModule = utils.hyphenName(this.context.moduleName);
  this.context.upperModule = utils.upperCamel(this.context.moduleName);
  this.context.templateUrl = path.join(this.module).replace(/\\/g, '/');
  this.context.modulePath = utils.normalizeModulePath(this.module);

  // create new module directory
  this.mkdir(path.join(this.context.appDir, this.context.modulePath));

  // check if path and moduleName are the same
  // if yes - get root app.js file to prepare adding dep
  // else - get parent module file to prepare adding dep
  if (this.context.moduleName === this.module) {
    filePathToCheck = path.join(this.context.appDir, 'app');
  } else {
    // go up one driectory from new module's path to retrieve parent's directory
    parentDir = path.join(this.context.appDir, this.context.modulePath, '..');
    // get parent module's name
    parentModuleName = path.basename(parentDir);

    filePathToCheck = path.join(this.context.appDir, this.context.modulePath, '..', parentModuleName);
  }

  // test each app script in case of mixing app scripts
  filePath = _.find([
    filePathToCheck + '.es6',
    filePathToCheck + '.ts',
    filePathToCheck + '.coffee',
    filePathToCheck + '.js'
  ], function (moduleFile) {
    return fs.existsSync(moduleFile);
  });

  // if adding dep to app file, then dep is `module
  // else dep is `parent.module`
  depName = (this.context.parentModuleName ? this.context.parentModuleName + '.' : '') + this.context.lowerCamel;
    // add dep and save modifications
  fs.writeFileSync(filePath, ngAddDep(fs.readFileSync(filePath, 'utf8'), depName));

  // create new module
  this.copySrcFile('module', path.join(this.context.appDir, this.context.modulePath,
    this.context.hyphenModule + '.' + this.context.appScript), this.context);
};

Generator.prototype.end = function end() {
  // save this module to suggest later
  this.config.set('lastUsedModule', this.module);

  if (this.options && !this.options.empty) {
    this.composeWith('ng-poly:route', {
      args: [utils.lowerCamel(this.module.split(/[\/\\]/).pop())],
      options: {
        module: this.module,
        url: '/' + this.context.hyphenModule,
        'template-url': this.context.modulePath + '/' + this.context.hyphenModule + '.tpl.html',

        markup: this.options.markup,
        'app-script': this.options['app-script'],
        'controller-as': this.options['controller-as'],
        'pass-func': this.options['pass-func'],
        'named-func': this.options['named-func'],
        'test-script': this.options['test-script'],
        'test-dir': this.options['test-dir'],
        'ng-route': this.options['ng-route'],
        style: this.options.style
      }
    }, {
      local: require.resolve('../route'),
      link: 'strong'
    });
  }
};
