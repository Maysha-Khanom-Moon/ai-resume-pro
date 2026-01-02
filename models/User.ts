// models/User.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password?: string // Optional for OAuth users
  role: string[]
  education?: string
  experience?: string
  currentJob?: string
  skills?: string[]
  imageLink?: string
  fbLink?: string
  githubLink?: string
  linkedinLink?: string
  location?: string
  provider?: string // "google", "github", or undefined for credentials
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      select: false // Not selected by default for security
      // Plain text password - no hashing
    },
    role: { 
      type: [String], 
      default: ["user"],
      enum: ["user", "admin"] // Only allow these roles
    },
    education: { type: String },
    experience: { type: String },
    currentJob: { type: String },
    skills: { 
      type: [String], 
      default: [] 
    },
    imageLink: { 
      type: String, 
      default: "" 
    },
    fbLink: { type: String },
    githubLink: { type: String },
    linkedinLink: { type: String },
    location: { type: String },
    provider: { 
      type: String,
      enum: ["google", "github", null], // OAuth providers or null for credentials
      default: null
    },
  },
  { 
    timestamps: true, // Automatically creates createdAt and updatedAt
    strict: false // Allow additional fields if needed
  }
)

// Index for faster email lookups
UserSchema.index({ email: 1 })

// Prevent model recompilation in development
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)