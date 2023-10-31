import { Request, Response } from 'express';
import logging from '../config/logging';
import bcryptjs from 'bcryptjs';
import signJWT from '../functions/signJWT';
import { db } from '../config/db';

const NAMESPACE = "User";

const getAllUsers = async (req: Request, res: Response) => {
    try {

        /* Pagination Logic */
        let { page, limit } = req.query;
        // Default to First Page
        const pageQuery: number = page && Number(page) > 0 ? Number(page) : 1;
        // Default to Limit of 50 products and Range is (1 < Products < 101)
        const take: number = limit && Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 50;
        const skip = (pageQuery - 1) * take;

        const [users, total_count] = await db.$transaction([
            db.user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
                skip,
                take,
            }),
            db.user.count(),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                users,
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

const register = async (req: Request, res: Response) => {

    try {
        let { firstName, lastName, email, password } = req.body;

        const hashedPassword = await bcryptjs.hash(password, 10)

        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if (user) {
            logging.error(NAMESPACE, `User with Email (${email}) already Registered! `);
            return res.status(422).json({
                success: false,
                message: 'User already Registered',
            });
        }

        const newUser = await db.user.create({
            data: {
                firstName,
                lastName,
                email: email,
                password: hashedPassword,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });

        signJWT(newUser, (_error, token) => {
            if (_error) {
                return res.status(401).json({
                    success: false,
                    message: 'Unable to Sign JWT',
                    error: _error
                });
            } else if (token) {
                logging.info(NAMESPACE, `User with id ${newUser.id} inserted.`);

                return res.status(201).json({
                    success: true,
                    data: {
                        token
                    },
                });
            }
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);

        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }

};

const login = async (req: Request, res: Response) => {
    try {

        let { email, password } = req.body;

        const user = await db.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: true,
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Email Not Found!",
            })
        }

        const passValid = await bcryptjs.compare(password, user.password);
        if (!passValid) {
            return res.status(401).json({
                success: false,
                message: 'Password Mismatch'
            });
        }


        signJWT(user, (_error, token) => {
            if (_error) {
                return res.status(401).json({
                    success: false,
                    message: 'Unable to Sign JWT',
                    error: _error
                });
            } else if (token) {
                return res.status(200).json({
                    success: true,
                    data: {
                        token
                    },
                });
            }
        });


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
    getAllUsers,
    register,
    login,
}