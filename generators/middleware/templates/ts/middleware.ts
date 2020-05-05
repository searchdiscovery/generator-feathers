import { Request, Response, NextFunction } from 'express';

export default () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    next();
  };
}
