import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  role: string[];  // User can have 'admin' or 'user' roles
  education: {
    institution: string;
    degree: string;
    duration: string;
  }[];
  experience: {
    institution: string;
    position: string;
    duration: string;
  }[];
  currentJob: {
    institution: string;
    position: string;
    from: string;
  };
  skills: string[];
  imageLink: string;
  fbLink: string;
  githubLink: string;
  linkedinLink: string;
  location: string;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: [String], 
    required: true, 
    enum: ["admin", "user"],  // Only 'admin' and 'user' roles allowed
    default: ["user"]  // Default role is 'user'
  },
  education: [
    {
      institution: { type: String },
      degree: { type: String },
      duration: { type: String }
    }
  ],
  experience: [
    {
      institution: { type: String },
      position: { type: String },
      duration: { type: String }
    }
  ],
  currentJob: {
    institution: { type: String },
    position: { type: String },
    from: { type: String }
  },
  skills: { type: [String] },
  imageLink: { type: String },
  fbLink: { type: String },
  githubLink: { type: String },
  linkedinLink: { type: String },
  location: { type: String }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
