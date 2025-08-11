const express = require('express');
const router = express.Router();
const {
    getPortfolioItems,
    getPortfolioItem,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
} = require('../controllers/portfolioController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getPortfolioItems);
router.get('/:id', getPortfolioItem);

// Protected routes (Admin only)
router.post('/', protect, adminOnly, createPortfolioItem);
router.put('/:id', protect, adminOnly, updatePortfolioItem);
router.delete('/:id', protect, adminOnly, deletePortfolioItem);

module.exports = router;
