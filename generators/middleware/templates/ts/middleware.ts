/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response, NextFunction } from 'express';

export default () => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  next();
};
