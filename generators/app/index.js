'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to ' + chalk.red('Hidden Founders Fullstack') + ' generator!'
    ));

    var prompts = [
      // confirms
      // use a frontend framework
      {
        type: 'confirm',
        name: 'useFeFw',
        message: 'Would you like to use a Frontend Framework?',
        default: true
      },
      // include unit tests
      {
        type: 'confirm',
        name: 'includeUnitTests',
        message: 'Would you like to include Unit Tests?',
        default: true
      },
      // lists
      // frontend frameworks
      {
        type: 'list',
        name: 'feFw',
        message: 'What framework do you wanna use?',
        choices: [
          {
            name: 'AngularJS',
            value: 'angularjs'
          },
          {
            name: 'React',
            value: 'react'
          }
        ],
        default: 0,
        when: function (answers) {
          return answers.useFeFw;
        }
      },
      // css preprocessors
      {
        type: 'list',
        name: 'stylesPrepros',
        message: 'What CSS Preprocessor do you wanna use?',
        choices: [
          {
            name: 'SASS',
            value: 'sass'
          },
          {
            name: 'Stylus',
            value: 'stylus'
          },
          {
            name: 'CSS Next',
            value: 'cssnext'
          }
        ],
        default: 0
      },
      // css processors
      {
        type: 'checkbox',
        name: 'stylesPros',
        message: 'What CSS Processors do you wanna include?',
        choices: [
          {
            name: 'Rucksack',
            value: 'rucksack',
            checked: true
          },
          {
            name: 'Stylelint',
            value: 'stylelint',
            checked: true
          }
        ],
        when: function (answers) {
          return answers.stylesPrepros !== 'sass';
        }
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = {};
      this.props.useFeFw = props.useFeFw;
      this.props.feFw = props.feFw;
      this.props.useAngularjs = props.feFw === 'angularjs';
      this.props.useReact = props.feFw === 'react';
      this.props.includeUnitTests = props.includeUnitTests;
      this.props.stylesPrepros = props.stylesPrepros;
      this.props.useSass = props.stylesPrepros === 'sass';
      this.props.useStylus = props.stylesPrepros === 'stylus';
      this.props.useCssnext = props.stylesPrepros === 'cssnext';
      if (props.stylesPros) {
        this.props.includeRucksack = props.stylesPros.indexOf('rucksack') !== -1;
        this.props.includeStylelint = props.stylesPros.indexOf('stylelint') !== -1;
      }
    }.bind(this));
  },

  writing: {
    client: function () {
      // client files
      var clientPath;

      if (!this.useFeFw) {
        clientPath = 'staticClient';
      }

      if (this.props.useAngularjs) {
        clientPath = 'angularjsClient';
      }

      if (this.props.useReact) {
        clientPath = 'reactClient';
      }

      this.fs.copy(
        this.templatePath(clientPath),
        this.destinationPath('client')
      );

      // styles
      var stylesPath;

      if (this.props.useSass) {
        stylesPath = 'sass/**';
      }

      if (this.props.useStylus) {
        stylesPath = 'stylus/**';
      }

      if (this.props.useCssnext) {
        stylesPath = 'cssnext/**';
      }

      this.fs.copy(
        this.templatePath(stylesPath),
        this.destinationPath('client/styles')
      );

      // assets
      this.fs.copy(
        this.templatePath('assets'),
        this.destinationPath('client/assets')
      );
    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.props
      );
    },

    gulpFile: function () {
      this.fs.copyTpl(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        this.props
      );
    },

    configFiles: function () {
      // gulpfile
      if (!this.useFeFw || this.useAngularjs) {
        this.fs.copyTpl(
          this.templatePath('gulpfile.js'),
          this.destinationPath('gulpfile.js'),
          this.props
        );
      }

      // stylelint
      if (this.props.includeStylelint) {
        this.fs.copy(
          this.templatePath('.stylelintrc'),
          this.destinationPath('.stylelintrc')
        );
      }

      // bower
      if (!this.useFeFw || this.useAngularjs) {
        this.fs.copy(
          this.templatePath('.bowerrc'),
          this.destinationPath('.bowerrc')
        );
        this.fs.copyTpl(
          this.templatePath('bower.json'),
          this.destinationPath('bower.json'),
          this.props
        );
      }

      // unit tests
      if (this.includeUnitTests) {
        if (this.useAngularjs) {
          this.fs.copy(
            this.templatePath('_karma.conf.js'),
            this.destinationPath('karma.conf.js')
          );
        }
      }
    }
  },

  install: function () {
    // this.installDependencies();
  }
});
