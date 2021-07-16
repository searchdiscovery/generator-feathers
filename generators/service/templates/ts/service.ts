// Initializes the `<%= name %>` service on path `/<%= path %>`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '<%= relativeRoot %>declarations';
import { <%= serviceClassName %> } from './<%= serviceKebabName %>.class';<% if(modelName) { %>
import createModel from '<%= relativeRoot %>models/<%= modelName %>';<% } %>
import hooks from './<%= serviceKebabName %>.hooks';

// Add this service to the service type index
declare module '<%= relativeRoot %>declarations' {
  interface ServiceTypes {
    '<%= path %>': <%= serviceClassName %> & ServiceAddons<any>;
  }
}

export default (app: Application): void => {
  const options = {<% if (modelName) { %>
    Model: createModel(app),<% } %>
    paginate: app.get('paginate'),
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use('/<%= path %>', new <%= serviceClassName %>(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('<%= path %>');

  service.hooks(hooks);
};
