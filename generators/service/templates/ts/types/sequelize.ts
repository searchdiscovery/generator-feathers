import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '<%= relativeRoot %>declarations';

class <%= serviceClassName %> extends Service {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}

export { <%= serviceClassName %> };
export default <%= serviceClassName %>;
