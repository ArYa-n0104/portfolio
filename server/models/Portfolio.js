const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['branding', 'ui-design', 'illustration', 'print', 'motion-graphics']
    },
    tools: [{
        type: String
    }],
    client: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    images: [{
        url: String,
        public_id: String
    }],
    liveUrl: String,
    githubUrl: String,
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
