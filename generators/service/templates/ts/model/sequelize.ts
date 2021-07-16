/* eslint-disable import/no-cycle */
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';

// Don't forget to update the interface!
export type <%= className %> = typeof Model & {
  new (): <%= className %>;
  readonly id: string;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
};

const config = {
  attributes: {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
