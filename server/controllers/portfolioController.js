const Portfolio = require('../models/Portfolio');

// Get all portfolio items
const getPortfolioItems = async (req, res) => {
    try {
        const { category, featured, limit } = req.query;
        let filter = { status: 'active' };

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (featured === 'true') {
            filter.featured = true;
        }

        let query = Portfolio.find(filter);

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const portfolioItems = await query.sort({ createdAt: -1 });

        res.json({
            success: true,
            count: portfolioItems.length,
            data: portfolioItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single portfolio item
const getPortfolioItem = async (req, res) => {
    try {
        const portfolioItem = await Portfolio.findById(req.params.id);

        if (!portfolioItem) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio item not found'
            });
        }

        res.json({
            success: true,
            data: portfolioItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create portfolio item (Admin only)
const createPortfolioItem = async (req, res) => {
    try {
        const portfolioItem = await Portfolio.create(req.body);

        res.status(201).json({
            success: true,
            data: portfolioItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Update portfolio item (Admin only)
const updatePortfolioItem = async (req, res) => {
    try {
        const portfolioItem = await Portfolio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!portfolioItem) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio item not found'
            });
        }

        res.json({
            success: true,
            data: portfolioItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Update Error',
            error: error.message
        });
    }
};

// Delete portfolio item (Admin only)
const deletePortfolioItem = async (req, res) => {
    try {
        const portfolioItem = await Portfolio.findByIdAndDelete(req.params.id);

        if (!portfolioItem) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio item not found'
            });
        }

        res.json({
            success: true,
            message: 'Portfolio item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getPortfolioItems,
    getPortfolioItem,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
};
