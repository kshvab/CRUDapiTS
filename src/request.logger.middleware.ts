import * as express from 'express';

const requestLoggerMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.info(
    `REQUEST: ${req.method} ${' '.repeat(8 - req.method.length)} ${
      req.originalUrl
    }`
  );
  const startTime = new Date().getTime();
  res.on('finish', () => {
    const elapsedTime = new Date().getTime() - startTime;
    console.info(
      `REQUEST: ${req.method} ${' '.repeat(8 - req.method.length)} ${
        req.originalUrl
      }${' '.repeat(20 - req.originalUrl.length)} ${
        res.statusCode
      }\t${elapsedTime}ms`
    );
  });

  next();
};

export { requestLoggerMiddleware };
