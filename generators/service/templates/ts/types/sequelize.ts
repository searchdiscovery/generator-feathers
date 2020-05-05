import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '<%= relativeRoot %>declarations';

class <%= serviceClassName %> extends Service {
  constructor(options: object, app: Application) {
    super(options);
  }
}

export { <%= serviceClassName %> };
export default <%= serviceClassName %>;
