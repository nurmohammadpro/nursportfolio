import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  type: { type: String, enum: ['inbound', 'outbound'], required: true },
  createdAt: { type: Date, default: Date.now },
  resendId: { type: String }, 
  deliveryStatus: { type: String, default: 'pending' },
  attachments: [{
    id: String,
    name: String,
    size: Number,
    type: String
  }]
});

// Main Project/Thread Schema
const ProjectSchema = new Schema({
  clientEmail: { type: String, required: true, lowercase: true, index: true },
  clientName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  fromEmail: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['inbox', 'sent', 'archive', 'trash', 'spam'], 
    default: 'inbox' 
  },
  starred: { type: Boolean, default: false },
  unread: { type: Boolean, default: true },
  messages: [MessageSchema],
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const EmailThread = models.EmailThread || model('EmailThread', ProjectSchema);

export default EmailThread;