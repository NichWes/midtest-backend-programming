const express = require('express');
const { rateLimit } = require('express-rate-limit');

const authenticationControllers = require('./authentication-controller');
const authenticationValidators = require('./authentication-validator');
const celebrate = require('../../../core/celebrate-wrappers');

const route = express.Router();
// Each IP can only send 5 login requests in 10 minutes
const loginRateLimiter = rateLimit({max: 5, windowMS: 1000 * 60 * 10})

module.exports = (app) => { 
  app.use('/authentication', route);

  // Limiting login attempts
  const loginLimiter = rateLimit ({
    windowMs: 30 * 60 * 1000,
    max: 5,
    handler:(req,res) => {
      console.log(req.rateLimit);
      const date = new Date(req.rateLimit.resetTime);
      req.rateLimit.resetTime = date.toLocaleTimeString();
      res.status(403).json({
        statusCode: 403,
        error: 'FORBIDDEN_ERROR',
        description: 'Access forbidden',
        message: `Too many failed login attempts, try again in 30 minutes at ${req.rateLimit.resetTime}`,
      });
    },
    requestWasSuccessful: (request, response) => response.statusCode < 400,
    skipSuccessfulRequests: true,
  });

  route.post(
    '/login',
    loginLimiter,
    celebrate(authenticationValidators.login),
    authenticationControllers.login
  );
};
