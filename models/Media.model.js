
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    // File path or URL (local path or cloud URL)
    path: {
        type: String,
        required: true, 
        trim: true
    },
    
    // Thumbnail URL for previews
    thumbnail_url: {
        type: String,
        required: true, 
        trim: true
    },
    secure_url: {
        type: String,
        required: true, 
        trim: true
    },

    
    // SEO and accessibility
    alt: {
        type: String,
        required: true,
        maxlength: 200
    },
    
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    
    // File metadata
    originalName: {
        type: String,
        required: true
    },
    
    filename: {
        type: String,
        required: true,
        unique: true // Prevent duplicate filenames
    },
    
    mimetype: {
        type: String,
        required: true,
        enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    },
    
    size: {
        type: Number,
        required: true,
        max: 5 * 1024 * 1024 // 5MB limit
    },
    
    // Dimensions for images
    width: {
        type: Number
    },
    
    height: {
        type: Number
    },
    
    // Soft delete - use Date instead of String
    deletedAt: {
        type: Date,
        default: null,
        index: true 
    },
    
    // Who uploaded it (if you have user system)
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, { 
    timestamps: true,
    // Add virtual for public URL
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
mediaSchema.index({ createdAt: -1 }); // For recent files
mediaSchema.index({ mimetype: 1 }); // Filter by file type
mediaSchema.index({ deletedAt: 1, createdAt: -1 }); // For active files

// Virtual for public URL (if storing locally)
mediaSchema.virtual('publicUrl').get(function() {
    if (this.path.startsWith('http')) {
        return this.path; // Already a full URL (cloud storage)
    }
    return `/uploads/images/${this.filename}`; // Local storage
});

// Method to soft delete
mediaSchema.methods.softDelete = function() {
    this.deletedAt = new Date();
    return this.save();
};

// Method to restore
mediaSchema.methods.restore = function() {
    this.deletedAt = null;
    return this.save();
};

// Static method to find active media
mediaSchema.statics.findActive = function() {
    return this.find({ deletedAt: null });
};

const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaSchema, 'Media');

export default MediaModel;
