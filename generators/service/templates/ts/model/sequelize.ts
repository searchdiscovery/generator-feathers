// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';

// Don't forget to update the interface!
export type <%= className %> = typeof Model & {
  new (): <%= className %>;
  readonly id: number;
  name: string;
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

  class <%= className %> extends Model {
    static getConfiguration(): Record<string, unknown> {
      return config;
    }
  }

  <%= className %>.init(config.attributes, {
    ...config.options,
    sequelize,
    modelName: '<%= snakeName %>',
  });

  // eslint-disable-next-line no-unused-vars
  (<%= className %> as any).associate = (models: any): void => {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return <%= className %>;
}
