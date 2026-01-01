import mongoose, { Schema, Document } from "mongoose";

export interface JobDocument extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  recruiter: mongoose.Types.ObjectId;  // Reference to the recruiter (User)
  applicants: mongoose.Types.ObjectId[];  // List of applicants (Job Seekers)
}

const JobSchema = new Schema<JobDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String },
  location: { type: String, required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Recruiter reference
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]  // List of applicants (Job Seekers)
}, { timestamps: true });

export const Job = mongoose.models.Job || mongoose.model<JobDocument>("Job", JobSchema);
