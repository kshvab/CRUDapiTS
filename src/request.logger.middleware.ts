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

    const spaces =
      req.originalUrl.length < 28 ? 30 - req.originalUrl.length : 1;

    console.info(
      `REQUEST: ${req.method} ${' '.repeat(8 - req.method.length)} ${
        req.originalUrl
      }${' '.repeat(spaces)} ${res.statusCode}\t${elapsedTime}ms`
    );
  });

  next();
};

export { requestLoggerMiddleware };
