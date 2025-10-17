const express = require('express');
const { uploadMemory } = require('../middleware/upload');
const {
	addDavomat,
	chiqish,
	kunlikHisobot,
	xodimDavomatTarixi,
	smenaHisoboti,
	hozirdaIshda,
	davomatOchirish,
	davomatTahrirlash,
} = require('../controller/davomatController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/check-in', uploadMemory.single('image'), addDavomat);

router.post('/check-out', uploadMemory.single('image'), chiqish);

router.get('/kunlik-hisobot', isAuthenticated, kunlikHisobot);

router.get('/xodim-davomat-tarixi/:id', isAuthenticated, xodimDavomatTarixi);

router.get('/smena-boyicha-hisobot/:id', isAuthenticated, smenaHisoboti);
// xozir ishda bolgan xodimlar
router.get('/hozir-ishda', isAuthenticated, hozirdaIshda);

router.delete('/davomatni-ochirish/:attendanceId', isAuthenticated, isAdmin, davomatOchirish);

router.put('/davomatni-tahrirlash/:attendanceId', isAuthenticated, isAdmin, davomatTahrirlash);

module.exports = router;
