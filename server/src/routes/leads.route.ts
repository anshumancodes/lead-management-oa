import { Router } from 'express';
import { leadsController } from './leads.controller.js';
// import { verifyJWT } from '../common/middlewares/auth.js';

const router = Router();

// router.use(verifyJWT);

router.get('/',        leadsController.find);
router.get('/:id',    leadsController.findById);
router.post('/',      leadsController.create);
router.patch('/:id',  leadsController.patch);
router.delete('/:id', leadsController.remove);

export default router;
