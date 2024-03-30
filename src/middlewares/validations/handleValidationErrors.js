import { validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(422).send({
      status: 'failure',
      data: {
        statusCode: 422,
        error: validationErrors.array().map(err => err.msg)
      }
    });
  }
  next();
};

export default handleValidationErrors;
