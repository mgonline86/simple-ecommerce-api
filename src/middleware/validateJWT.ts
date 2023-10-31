import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import jwt from 'jsonwebtoken';
import config from '../config/config';


const NAMESPACE = "Auth";

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating Token');

    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                    error
                })
            }
            else {
                // Save Token and then pass it to the middleware
                res.locals.jwt = decoded;
                next();

            }
        });
    }
    else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

};

export default validateJWT;