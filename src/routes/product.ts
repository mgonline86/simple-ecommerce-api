import express from 'express';
import controller from '../controllers/product';
import validateJWT from '../middleware/validateJWT';
import isProductOwner from '../middleware/isProductOwner';

const router = express.Router();

router.get('/', validateJWT, controller.getAllProducts);
router.get('/:id', validateJWT, controller.getSingleProduct);
router.post('/', validateJWT, controller.createProduct);
router.patch('/:id', validateJWT, isProductOwner, controller.updateProduct);
router.delete('/:id', validateJWT, isProductOwner, controller.deleteProduct);

export = router;