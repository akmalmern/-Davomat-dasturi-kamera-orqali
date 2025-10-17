const express = require('express');
const Smena = require('../model/smenaModel');
const { addSmena, smenalar, deleteSmena, updateSmena } = require('../controller/smenaController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/add-smena', isAuthenticated, isAdmin, addSmena);

router.get('/smenalar', smenalar);

router.delete('/delete-smena/:id', isAuthenticated, isAdmin, deleteSmena);

router.put('/update-smena/:id', isAuthenticated, isAdmin, updateSmena);

module.exports = router;
