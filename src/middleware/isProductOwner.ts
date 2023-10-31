import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import { db } from '../config/db';

const NAMESPACE = "Auth";

const isProductOwner = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating User is Resource Owner');

    const { jwt } = res.locals;

    if (jwt) {
        const productId = Number(req.params.id);
        const product = await db.product.findFirst({
            where: {
                id: productId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                quantity: true,
                image: true,
                userId: true,
            }
        });

        if (!product) {
            logging.error(NAMESPACE, `Product with id (${productId}) was not found!`);

            return res.status(404).json({
                success: false,
                message: 'Not Found'
            });
        }

        if (product.userId !== jwt.id) {
            logging.error(NAMESPACE, `Forbidden`);
            
            return res.status(403).json({
                success: false,
                message: 'Forbidden'
            });
        }

        logging.error(NAMESPACE, `User_ID (${jwt.id}) is Owner of Product_ID(${productId})`);

        res.locals.product = product;
        next();
    }
    else {
        logging.error(NAMESPACE, `Unauthorized`);

        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

};

export default isProductOwner;