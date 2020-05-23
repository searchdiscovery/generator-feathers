// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';

export interface <%= className %>Attributes extends Model {
  readonly id: number;
  name: string;
}

export type <%= className %>Model = typeof Model & {
  new (): <%= className %>Model;
};

export default function(app: Application): any {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const <%= camelName %> = sequelizeClient.define('<%= snakeName %>', {
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
  }, {
    hooks: {
      beforeCount(options: any): void {
        options.raw = true;
      }
    },
    paranoid: true,
  });

  // eslint-disable-next-line no-unused-vars
  (<%= camelName %> as any).associate = (models: any): void => {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return <%= camelName %>;
}
