import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string[];  // User can have multiple roles (job_seeker, recruiter)
  profile: {
    jobSeekerDetails?: {
      skills: string[];
      experience: string[];
      education: string[];
    };
    recruiterDetails?: {
      company: string;
      jobPostings: mongoose.Types.ObjectId[];
    };
  };
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: [String], required: true, enum: ["job_seeker", "recruiter", "admin"] },  // Multiple roles allowed
  profile: {
    jobSeekerDetails: {
      skills: { type: [String] },
      experience: { type: [String] },
      education: { type: [String] }
    },
    recruiterDetails: {
      company: { type: String },
      jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]  // Reference to Job model
    }
  }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
