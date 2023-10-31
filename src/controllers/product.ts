import { Request, Response } from 'express';
import logging from '../config/logging';
import { db } from '../config/db';

const NAMESPACE = "Product";

const getAllProducts = async (req: Request, res: Response) => {
    try {

        /* Pagination Logic */
        let { page, limit } = req.query;
        // Default to First Page
        const pageQuery: number = page && Number(page) > 0 ? Number(page) : 1;
        // Default to Limit of 50 products and Range is (1 < Products < 101)
        const take: number = limit && Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 50;
        const skip = (pageQuery - 1) * take;

        const [products, total_count] = await db.$transaction([
            
            db.product.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    quantity: true,
                    image: true,
                },
                skip,
                take,
            }),
            db.product.count(),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                products,
                total_count,
            }
        });

    }
    catch (error: any) {
        logging.error(NAMESPACE, error.message, error);

        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};

const getSingleProduct = async (req: Request, res: Response) => {
    try {

        const id = Number(req.params.id);

        const product = await db.product.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                quantity: true,
                image: true,
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found!",
            })
        }

        return res.status(200).json({
            success: true,
            data: { product },
        });

    }
    catch (error: any) {
        logging.error(NAMESPACE, error.message, error);

        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};

const createProduct = async (req: Request, res: Response) => {

    try {

        const { id: userId } = res.locals.jwt;

        let {
            title,
            description,
            price,
            quantity,
            image,
        } = req.body;

        const newProduct = await db.product.create({
            data: {
                title,
                description,
                price,
                quantity,
                image,
                userId
            },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                quantity: true,
                image: true,
            },
        });
        logging.info(NAMESPACE, `Product with id ${newProduct.id} inserted.`);

        return res.status(201).json({
            success: true,
            data: {
                product: newProduct,
            },
        });
        ;
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);

        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};

const updateProduct = async (req: Request, res: Response) => {

    try {
        const id = Number(req.params.id);

        let {
            title,
            description,
            price,
            quantity,
            image,
        } = req.body;

        const data = {
            ...(title && { title }),
            ...(description && { description }),
            ...(price && { price }),
            ...(quantity && { quantity }),
            ...(image && { image }),
        }

        if (Object.keys(data).length === 0) {
            logging.error(NAMESPACE, "No correct data is passed to allowed fields!");

            return res.status(422).json({
                success: false,
                message: 'No Content',
            });
        }

        const updatedProduct = await db.product.update({
            where: {
                id,
            },
            data,
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                quantity: true,
                image: true,
            },
        });
        logging.info(NAMESPACE, `Product with id ${updatedProduct.id} updated.`);

        return res.status(200).json({
            success: true,
            data: {
                product: updatedProduct,
            },
        });
        ;
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);

        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};

const deleteProduct = async (req: Request, res: Response) => {

    try {
        const id = Number(req.params.id);
        const deletedProduct = await db.product.delete({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                quantity: true,
                image: true,
            },
        })

        logging.info(NAMESPACE, `Product with id ${deletedProduct.id} deleted.`);

        return res.status(200).json({
            success: true,
            data: {
                product: deletedProduct,
            },
        });
        ;
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);

        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};


export default {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}