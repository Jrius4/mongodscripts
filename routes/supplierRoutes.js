const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Define endpoints
router.get('/agents', supplierController.getAgents);
router.get('/agent-status', supplierController.getAgentStatus);
router.get('agents/:supplierAgent', supplierController.getAgentStatus);

module.exports = router;
