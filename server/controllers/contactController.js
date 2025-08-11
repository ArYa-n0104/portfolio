const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Create transport for sending emails
const createTransport = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Submit contact form
const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Create contact record
        const contactData = {
            name,
            email,
            subject,
            message,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        // Handle file attachments
        if (req.files && req.files.length > 0) {
            contactData.attachments = req.files.map(file => ({
                filename: file.originalname,
                path: file.path,
                mimetype: file.mimetype
            }));
        }

        const contact = await Contact.create(contactData);

        // Send email notification
        const transport = createTransport();

        // Email to site owner
        const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2DD4BF;">New Contact Form Submission</h2>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong></p>
                        <p style="background: white; padding: 15px; border-left: 4px solid #2DD4BF; margin: 10px 0;">${message}</p>
                        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `,
            attachments: contactData.attachments || []
        };

        // Auto-reply to sender
        const senderMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for your message - Aryan Singh Design',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2DD4BF;">Thank You for Getting in Touch!</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for your message. I've received your inquiry about "${subject}" and will get back to you within 24-48 hours.</p>
                    <p>Best regards,<br>Aryan Singh<br>Creative Graphic Designer</p>
                </div>
            `
        };

        await Promise.all([
            transport.sendMail(ownerMailOptions),
            transport.sendMail(senderMailOptions)
        ]);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
            error: error.message
        });
    }
};

// Get all contacts (Admin only)
const getContacts = async (req, res) => {
    try {
        const { status, limit, page } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        const contacts = await Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Contact.countDocuments(filter);

        res.json({
            success: true,
            count: contacts.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Update contact status (Admin only)
const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Update Error',
            error: error.message
        });
    }
};

module.exports = {
    submitContactForm,
    getContacts,
    updateContactStatus
};
