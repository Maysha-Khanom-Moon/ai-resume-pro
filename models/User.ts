// models/User.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password?: string
  role: string[]
  bio?: string
  education?: string
  experience?: string
  currentJob?: string
  skills?: string[]
  imageLink?: string
  fbLink?: string
  githubLink?: string
  linkedinLink?: string
  location?: string
  provider?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,  // Remove this if you have schema.index() below
      lowercase: true,
      trim: true 
    },
    password: { type: String, select: false },
    role: { type: [String], default: ["user"] },
    bio: { type: String },
    education: { type: String },
    experience: { type: String },
    currentJob: { type: String },
    skills: { type: [String], default: [] },
    imageLink: { type: String, default: "" },
    fbLink: { type: String },
    githubLink: { type: String },
    linkedinLink: { type: String },
    location: { type: String },
    provider: { type: String },
  },
  { timestamps: true }
)

// Remove this line if you have unique: true above
// UserSchema.index({ email: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)