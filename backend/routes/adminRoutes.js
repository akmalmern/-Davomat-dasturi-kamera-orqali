const express = require('express');
const { upload, uploadMemory } = require('../middleware/upload');
const {
	xodimQoshish,
	xodimlar,
	deleteXodim,
	updateXodim,
} = require('../controller/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/xodim-qoshish', upload.single('image'), isAuthenticated, xodimQoshish);
router.get('/xodimlar', isAuthenticated, isAdmin, xodimlar);
router.delete('/delete-xodim/:id', isAuthenticated, isAdmin, deleteXodim);
router.put(
	'/update-xodim/:id',
	uploadMemory.single('image'),
	isAuthenticated,
	isAdmin,
	updateXodim
);

module.exports = router;
