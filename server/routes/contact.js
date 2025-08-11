const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
    submitContactForm,
    getContacts,
    updateContactStatus
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per windowMs
    message: {
        success: false,
        message: 'Too many contact form submissions, please try again later.'
    }
});

// Public routes
router.post('/', contactLimiter, upload.array('attachments', 5), submitContactForm);

// Protected routes (Admin only)
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/status', protect, adminOnly, updateContactStatus);

module.exports = router;
