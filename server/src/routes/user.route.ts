import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
// import { verifyJWT } from '../common/middlewares/auth.js';

const router = Router();

// router.use(verifyJWT);

router.get('/',        userController.find);
router.get('/:id',    userController.findById);
router.post('/',      userController.create);
router.patch('/:id',  userController.patch);
router.delete('/:id', userController.remove);

export default router;
