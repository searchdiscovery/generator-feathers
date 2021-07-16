/* eslint-disable import/no-extraneous-dependencies */
import { Application } from '@feathersjs/feathers';
import { Request, Response, NextFunction } from 'express';

export default (app: Application) => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {

  // Your custom middleware code goes here.
  
  next();
};
