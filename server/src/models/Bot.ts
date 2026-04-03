import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBot extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  systemPrompt?: string;
  model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo';
  temperature: number;
  branding: {
    primaryColor: string;
    botName: string;
    avatarUrl?: string;
    position: 'bottom-right' | 'bottom-left';
    welcomeMessage: string;
    placeholder: string;
  };
  allowedDomains: string[];
  humanHandoffEnabled: boolean;
  humanHandoffThreshold: number; // confidence score 0-1
  documentsCount: number;
  totalConversations: number;
  status: 'active' | 'inactive' | 'training';
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const BotSchema = new Schema<IBot>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    systemPrompt: { type: String },
    model: {
      type: String,
      enum: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
      default: 'gpt-4o-mini',
    },
    temperature: { type: Number, default: 0.3, min: 0, max: 1 },
    branding: {
      primaryColor: { type: String, default: '#6366f1' },
      botName: { type: String, default: 'AI Assistant' },
      avatarUrl: { type: String },
      position: { type: String, enum: ['bottom-right', 'bottom-left'], default: 'bottom-right' },
      welcomeMessage: { type: String, default: 'Hi! How can I help you today?' },
      placeholder: { type: String, default: 'Type your message...' },
    },
    allowedDomains: [{ type: String }],
    humanHandoffEnabled: { type: Boolean, default: false },
    humanHandoffThreshold: { type: Number, default: 0.4 },
    documentsCount: { type: Number, default: 0 },
    totalConversations: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'training'], default: 'inactive' },
    apiKey: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

BotSchema.index({ userId: 1 });
BotSchema.index({ apiKey: 1 }, { unique: true });

export const Bot: Model<IBot> =
  mongoose.models.Bot || mongoose.model<IBot>('Bot', BotSchema);
