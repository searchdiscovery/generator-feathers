import { HookContext, Query } from '@feathersjs/feathers';
import { isQueryParamTruthy, buildArrayFromQuery } from '../../lib/queries';
<% if (requiresAuth) { %>import { authenticate } from '../../hooks/authentication';<% } %>
// Don't remove this comment. It's needed to format import lines nicely.

interface ExtendedQuery extends Query {
  $include?: object[];
  $shallow?: string;
  currentUserId?: number;
}

const setupModel = async (context: HookContext): Promise<HookContext> => {
  const { $include, $shallow, currentUserId, ...query } = (context.params
    ?.query || {}) as ExtendedQuery;

  const shallow = isQueryParamTruthy(context.params.query, '$shallow');

  context.params.sequelize = context.params.sequelize || {};
  // Use the custom includes if present, otherwise use the default ones
  const includes =
    $include ||
    [
      // Default includes go here
    ];
  Object.assign(context.params.sequelize, {
    raw: false,
    // Include all associated models unless `$shallow` is passed as a query
    // param
    ...(!shallow && { include: includes }),
  });
  context.params.query = query;

  return context;
};

export default {
  before: {
    all: [<% if (requiresAuth) { %>authenticate, <% } %>setupModel],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
