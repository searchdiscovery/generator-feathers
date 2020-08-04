// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';

// Don't forget to update the interface!
export interface <%= className %>Attributes extends Model {
  readonly id: number;
  name: string;
}

export type <%= className %>Model = typeof Model & {
  new (): <%= className %>Model;
};

const config = {
  attributes: {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  options: {
    hooks: {
      beforeCount(opts: any): void {
        opts.raw = true;
      },
    },
    paranoid: true,
  },
};

export default function(app: Application): any {
  const sequelize: Sequelize = app.get('sequelizeClient');
  // eslint-disable-next-line @typescript-eslint/naming-convention
  class <%= camelName %> extends Model {
    static getConfiguration(): Record<string, unknown> {
      return config;
    }
  }
  <%= camelName %>.init(config.attributes, {
    ...config.options,
    sequelize,
    modelName: '<%= snakeName %>',
  });

  // eslint-disable-next-line no-unused-vars
  (<%= camelName %> as any).associate = (models: any): void => {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return <%= camelName %>;
};
