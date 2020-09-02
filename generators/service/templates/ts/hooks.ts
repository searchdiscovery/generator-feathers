import { iff } from 'feathers-hooks-common';
<% if (requiresAuth) { %>import { authenticate } from '../../hooks/authentication';<% } %>
import {
  setupModel,
  restrictToPropertyOrOrg,
  shouldRestrictToPropertyOrOrg,
} from '../../hooks/queries';
import * as associations from './<%= path %>.associations';

// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [<% if (requiresAuth) { %>authenticate, <% } %>context => setupModel(context, associations)],
    find: [iff(shouldRestrictToPropertyOrOrg, restrictToPropertyOrOrg)],
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
