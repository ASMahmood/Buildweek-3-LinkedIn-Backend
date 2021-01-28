const badRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    res.status(400).send(err.message);
  }
  next(err);
};

const notFoundHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(404).send("Resource not found!");
  }
  next(err);
};

const genericErrorHandler = (err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.httpStatusCode || 500).send(err.message);
  }
};

module.exports = {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
};
