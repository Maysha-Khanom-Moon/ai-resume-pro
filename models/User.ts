// models/User.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IResume {
  _id?: mongoose.Types.ObjectId
  url: string
  filename: string
  uploadedAt: Date
  isDefault?: boolean
}

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
  resumes: IResume[]
  createdAt: Date
  updatedAt: Date
}

const ResumeSchema = new Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  isDefault: { type: Boolean, default: false }
}, { _id: true })

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
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
    resumes: { type: [ResumeSchema], default: [] }
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)