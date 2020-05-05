const _ = require('lodash');
const Generator = require('../../lib/generator');

module.exports = class MigrationGenerator extends Generator {
  prompting() {
    this.checkPackage();

    const prompts = [
      {
        name: 'name',
        message:
          'What is the name of the migration table (singular, use spaces, no "_" or "-")?',
      },
    ];

    return this.prompt(prompts).then(props => {
      const d = new Date();
      const mon = d.getMonth() + 1;
      const monStr = mon < 10 ? `0${mon}` : mon;
      const day = d.getDate();
      const dayStr = day < 10 ? `0${day}` : day;
      const year = d.getFullYear();
      const hour = d.getHours();
      const hourStr = hour < 10 ? `0${hour}` : hour;
      const min = d.getMinutes();
      const minStr = min < 10 ? `0${min}` : min;
      const sec = d.getSeconds();
      const secStr = sec < 10 ? `0${sec}` : sec;
      const tableName = _.snakeCase(props.name);
      const kebabName = _.kebabCase(props.name);
      this.props = Object.assign(this.props, props, {
        tableName,
        filename: `${year}${monStr}${dayStr}${hourStr}${minStr}${secStr}-create-${kebabName}`,
      });
    });
  }

  _transformCodeTs() {}

  writing() {
    const context = this.props;
    const mainFile = this.srcDestinationPath(
      this.migrationDirectory,
      'scripts',
      context.filename,
    );

    // Do not run code transformations if the middleware file already exists
    if (!this.fs.exists(mainFile)) {
      this.fs.copyTpl(this.srcTemplatePath('migration'), mainFile, context);
    }
  }
};
