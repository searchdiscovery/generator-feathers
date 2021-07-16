import { HookContext } from '@feathersjs/feathers';
import { authorize, setAbilities } from '../../hooks/abilities';
<% if (requiresAuth) { %>import { authenticate } from '../../hooks/authentication';<% } %>
import { setupModel } from '../../hooks/queries';
import * as associations from './<%= path %>.associations';
import logger from '../../logger';

// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [
      <% if (requiresAuth) { %>authenticate, <% } %>(context: HookContext) => setupModel(associations)(context),
      setAbilities,
    ],
    find: [authorize()],
    get: [authorize()],
    create: [authorize()],
    update: [authorize()],
    patch: [authorize()],
    remove: [authorize()],
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
