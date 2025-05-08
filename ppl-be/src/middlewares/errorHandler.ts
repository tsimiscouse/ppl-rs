import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ErrorResponse } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: err.message || 'Internal Server Error'
  };

  res.status(statusCode).json(errorResponse);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};