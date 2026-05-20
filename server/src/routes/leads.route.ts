import { Router } from 'express';
import { leadsController } from '../controllers/leads.controller.js';
import { verifyJWT, requireRole } from '../common/middlewares/auth.js';
import { UserRole } from '../types/index.js';

const router = Router();

// All leads routes require authentication
router.use(verifyJWT);

// Export CSV for only Admin, must be before /:id to avoid route conflict
router.get('/export/csv', requireRole(UserRole.Admin), leadsController.exportCsv);

// CRUD
router.get('/',        leadsController.find);
router.get('/:id',     leadsController.findById);
router.post('/',       leadsController.create);
router.patch('/:id',   leadsController.patch);
router.delete('/:id',  requireRole(UserRole.Admin), leadsController.remove);

export default router;
