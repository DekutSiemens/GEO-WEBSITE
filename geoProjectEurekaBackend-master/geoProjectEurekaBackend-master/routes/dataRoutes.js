const express = require('express');
const { addData, getData, deleteData, updateData, getDataById, getOneProject,getDocById, addDocument } = require('../controllers/dataController');
const { protect } = require('../middlewares/authMiddleware');
const { addDataAuto } = require('../controllers/dataAutoController');
const { apiKeyAuth }  = require('../middlewares/apiKeyMiddleware');
const router = express.Router();

// data routes
router.post('/add', protect, addData);
router.get('/all', protect, getData);
router.get('/projectById/:id', protect, getDataById)
router.delete('/delete', protect, deleteData);
router.get('/project', protect, getOneProject);
router.put('/update', protect, updateData);
router.post('/auto-create', apiKeyAuth, addDataAuto);



module.exports = router;
