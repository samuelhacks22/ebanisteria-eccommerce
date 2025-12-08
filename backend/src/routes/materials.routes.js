const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', materialController.getAllMaterials);
router.post('/', materialController.createMaterial);
router.get('/low-stock', materialController.getLowStockMaterials);
router.get('/:id', materialController.getMaterialById);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', isAdmin, materialController.deleteMaterial);

module.exports = router;
