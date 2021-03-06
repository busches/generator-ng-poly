'use strict';
var chalk = require('chalk')
  , path = require('path')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator')
  , yosay = require('yosay')
  , Generator;

Generator = module.exports = yeoman.generators.Base.extend();

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.log(yosay('Welcome to ngPoly!'));

  // ask for app name
  // get preferred langugaes
  this.prompt([
    {
      name: 'appName',
      message: 'What is the app\'s name?',
      validate: function (input) {
        // require an app name
        return !!input;
      }
    },
    {
      type: 'list',
      name: 'ngversion',
      message: 'Which version of Angular should be used?',
      default: '1.3.*',
      choices: [
        {
          name: '1.2.*',
          value: '1.2.*'
        },
        {
          name: '1.3.*',
          value: '1.3.*'
        }
      ]
    },
    {
      type: 'list',
      name: 'structure',
      message: 'Which structure should be used?',
      default: 'module-only',
      choices: [
        {
          name: ['app/',
                '├── module1/',
                '│   ├── module2/',
                '│   ├── module1.js',
                '│   └── module1-controller.js',
                '└── app.js'].join('\n'),
          value: 'module-only'
        },
        {
          name: ['app/',
                '├── module1/',
                '│   ├── controllers/',
                '│   │   └── module1-controller.js',
                '│   ├── module2/',
                '│   └── module1.js',
                '└── app.js'].join('\n'),
          value: 'module-type'
        }
      ]
    },
    {
      name: 'host',
      message: 'What host should the app run on?',
      default: 'localhost'
    },
    {
      name: 'port',
      message: 'Which port should the app run on?',
      default: 3000
    },
    {
      name: 'appDir',
      message: 'Which folder should the app be developed in?',
      default: 'app'
    },
    {
      type: 'list',
      name: 'markup',
      message: 'Which is the preferred markup language?',
      default: 'jade',
      choices: [
        {
          name: 'HAML',
          value: 'haml'
        },
        {
          name: 'HTML',
          value: 'html'
        },
        {
          name: 'Jade',
          value: 'jade'
        }
      ]
    },
    {
      type: 'list',
      name: 'appScript',
      message: 'Which is the preferred application scripting language?',
      default: 'js',
      choices: [
        {
          name: 'CoffeeScript',
          value: 'coffee'
        },
        {
          name: 'EcmaScript2015 (ES6) using Babel',
          value: 'es6'
        },
        {
          name: 'JavaScript (ES5)',
          value: 'js'
        },
        {
          name: 'TypeScript',
          value: 'ts'
        }
      ]
    },
    {
      type: 'confirm',
      name: 'controllerAs',
      message: 'Want to use Controller As syntax?',
      default: true
    },
    {
      type: 'confirm',
      name: 'skipController',
      message: 'By default, should the route generator create controllers?',
      default: true
    },
    {
      name: 'unitTestDir',
      message: 'Where should unit tests be saved?',
      default: 'app'
    },
    {
      type: 'list',
      name: 'testScript',
      message: 'Which is the preferred test scripting language?',
      default: 'js',
      choices: [
        {
          name: 'CoffeeScript',
          value: 'coffee'
        },
        {
          name: 'EcmaScript2015 (ES6) using Babel',
          value: 'es6'
        },
        {
          name: 'JavaScript (ES5)',
          value: 'js'
        },
        {
          name: 'TypeScript',
          value: 'ts'
        }
      ]
    },
    {
      type: 'list',
      name: 'testFramework',
      message: 'Which is the preferred unit testing framework?',
      default: 'jasmine',
      choices: [
        {
          name: 'Jasmine',
          value: 'jasmine'
        },
        {
          name: 'Mocha with Chai',
          value: 'mocha'
        }
      ]
    },
    {
      type: 'list',
      name: 'e2eTestFramework',
      message: 'Which is the preferred e2e testing framework?',
      default: 'jasmine',
      choices: [
        {
          name: 'Jasmine',
          value: 'jasmine'
        },
        {
          name: 'Mocha with Chai',
          value: 'mocha'
        }
      ]
    },
    {
      type: 'list',
      name: 'style',
      message: 'Which is the preferred style language?',
      default: 'less',
      choices: [
        {
          name: 'CSS',
          value: 'css'
        },
        {
          name: 'LESS',
          value: 'less'
        },
        {
          name: 'SCSS',
          value: 'scss'
        },
        {
          name: 'Stylus',
          value: 'styl'
        }
      ]
    },
    {
      type: 'confirm',
      name: 'polymer',
      message: 'Should Polymer support be enabled?',
      default: false
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Should a framework be setup?',
      choices: function (answers) {
        var choices = [
          {
            name: 'none',
            value: 'none'
          },
          {
            name: 'Bootstrap with AngularStrap',
            value: 'angularstrap'
          },
          {
            name: 'Foundation with Angular Foundation',
            value: 'foundation'
          }
        ];

        if (answers.ngversion === '1.2.*') {
          choices.splice(2, 0, {
            name: 'Bootstrap with UI Bootstrap',
            value: 'uibootstrap'
          });
        } else {
          choices.splice(1, 0, {
            name: 'Angular Material',
            value: 'material'
          });
        }

        return choices;
      }

    },
    {
      type: 'confirm',
      name: 'ngRoute',
      message: 'Should ngRoute be used instead of UI Router?',
      default: false
    },
    {
      type: 'checkbox',
      name: 'bower',
      message: 'Which additional Bower components should be installed?',
      choices: function (answers) {
        var choices = [
          {
            name: 'Angular Animate',
            value: 'animate'
          },
          {
            name: 'Angular Cookies',
            value: 'cookies'
          },
          {
            name: 'Angular Resource',
            value: 'resource'
          },
          {
            name: 'Angular Sanitize',
            value: 'sanitize'
          },
          {
            name: 'Angular Touch',
            value: 'touch'
          },
          {
            name: 'Font Awesome',
            value: 'fontawesome'
          },
          {
            name: 'Lo-Dash',
            value: 'lodash'
          },
          {
            name: 'Restangular (installs Lo-Dash)',
            value: 'restangular'
          }
        ];

        if (answers.ngversion === '1.3.*') {
          choices.splice(1, 0, {
            name: 'Angular Aria',
            value: 'aria'
          });
          choices.splice(3, 0, {
            name: 'Angular Messages',
            value: 'messages'
          });
        }

        return choices;
      }
    }
  ], function (props) {
    this.appName = props.appName;
    this.ngversion = props.ngversion;
    this.structure = props.structure;
    this.appDir = props.appDir;
    this.host = props.host;
    this.port = props.port;
    this.markup = props.markup;
    this.appScript = props.appScript;
    this.controllerAs = props.controllerAs;
    this.skipController = !props.skipController;
    this.testScript = props.testScript;
    this.testFramework = props.testFramework;
    this.e2eTestFramework = props.e2eTestFramework;
    this.unitTestDir = props.unitTestDir;
    this.style = props.style;
    this.polymer = props.polymer;
    this.ngRoute = props.ngRoute;
    this.framework = props.framework;
    this.bower = props.bower.join(',');

    done();
  }.bind(this));
};

Generator.prototype.configuring = function configuring() {
  // create a directory named `appName`
  this.destinationRoot(this.appName);

  // save config info
  this.config.set('structure', this.structure);
  this.config.set('markup', this.markup);
  this.config.set('appScript', this.appScript);
  this.config.set('controllerAs', this.controllerAs);
  this.config.set('skipController', this.skipController);
  this.config.set('testScript', this.testScript);
  this.config.set('testFramework', this.testFramework);
  this.config.set('e2eTestFramework', this.e2eTestFramework);
  this.config.set('style', this.style);
  this.config.set('ngRoute', this.ngRoute);
  this.config.set('lastUsedModule', 'home');

  this.context = {
    appName: this.appName,
    structure: this.structure,
    ngversion: this.ngversion,
    appDir: this.appDir,
    unitTestDir: this.unitTestDir,
    host: this.host,
    port: this.port,
    moduleName: utils.lowerCamel(this.appName),
    polymer: this.polymer,
    framework: this.framework,
    testFramework: this.testFramework,
    e2eTestFramework: this.e2eTestFramework,
    ngRoute: this.ngRoute,
    bower: this.bower
  };

  // copy over common project files
  this.copyFile('.bowerrc');
  this.copyFile('.editorconfig');
  this.copyFile('.eslintrc');
  this.copyFile('.jscsrc');
  this.copyFile('.jshintrc');
  this.copyFile('_bower.json');
  this.copyFile('_build.config.js');
  this.copyFile('_gulpfile.js', 'Gulpfile.js');
  this.copyFile('_karma.config.js');
  this.copyFile('_package.json');
  if (this.appScript === 'ts') {
    this.copyFile('_tsd.json');
  }
  this.copyFile('gitignore', '.gitignore');
  this.copyFile('_protractor.config.js');
  this.copyFile('_readme.md', 'README.md');

  // copy over gulp files
  this.copyFile('gulp/analyze.js');
  this.copyFile('gulp/_build.js');
  this.copyFile('gulp/_test.js');
  this.copyFile('gulp/watch.js');
};

Generator.prototype.writing = function writing() {
  // create main module and index.html
  this.copyFile('_app.' + this.appScript, path.join(this.appDir, 'app.' + this.appScript));
  this.copyFile('_index.' + this.markup, path.join(this.appDir, 'index.' + this.markup));

  this.mkdir(path.join(this.appDir, 'fonts'));
  this.mkdir(path.join(this.appDir, 'images'));
};

Generator.prototype.install = function install() {
  if (!this.options['skip-install']) {
    this.installDependencies();
    if (this.appScript === 'ts') {
      this.log('Running ' + chalk.yellow.bold('tsd reinstall && tsd rebundle') + '. If this fails run the commands ' +
        'yourself. Tsd must be installed via `npm install -g tsd@next`.');
      this.spawnCommand('tsd reinstall && tsd rebundle');
    }
  }
};

Generator.prototype.end = function end() {
  this.composeWith('ng-poly:module', {
    args: ['home'],
    options: {
      module: 'home',
      markup: this.markup,
      style: this.style,
      'test-dir': this.testDir,
      'test-script': this.testScript,
      'controller-as': this.controllerAs,
      'skip-controller': this.skipController,
      'ng-route': this.ngRoute
    }
  }, {
    local: require.resolve('../module'),
    link: 'strong'
  });
};

Generator.prototype.copyFile = function copyFile(src, dest) {
  // prevents yeoman running copyFile as a task
  if (arguments.length === 0) {
    return;
  }

  // remove underscore from templated file names
  if (!dest) {
    dest = src.replace(/_/g, '');
  }

  this.fs.copyTpl(
    this.templatePath(src),
    this.destinationPath(dest),
    this.context
  );
};
