import mongoose, { Schema, Document } from "mongoose";

export interface ResumeDocument extends Document {
  user: mongoose.Types.ObjectId;  // Reference to the Job Seeker (User)
  title: string;
  filePath: string;  // Path to the resume file
  visibility: "public" | "private";  // Resume visibility setting
  skills: string[];
  experience: string[];
  education: string[];
}

const ResumeSchema = new Schema<ResumeDocument>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Reference to Job Seeker
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  visibility: { type: String, required: true, enum: ["public", "private"] },
  skills: { type: [String] },
  experience: { type: [String] },
  education: { type: [String] }
}, { timestamps: true });

export const Resume = mongoose.models.Resume || mongoose.model<ResumeDocument>("Resume", ResumeSchema);
