/* eslint-disable @typescript-eslint/no-unused-vars */
import { HookContext } from '@feathersjs/feathers';

// These are the associations that will be included by default for all requests
export const defaultAssociations = (context: HookContext) => [];

// This should include associations that can be included on a query string.
export const predefinedAssociations = (context: HookContext) => ({});