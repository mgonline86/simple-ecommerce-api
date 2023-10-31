import express from 'express';
import controller from '../controllers/user';
import validateJWT from '../middleware/validateJWT';

const router = express.Router();

router.get('/', validateJWT, controller.getAllUsers);

router.post('/register', controller.register);

router.post('/login', controller.login);


export = router;