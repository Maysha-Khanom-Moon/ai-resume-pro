import mongoose, { Schema, Document } from "mongoose";

export interface ApplicationDocument extends Document {
  job: mongoose.Types.ObjectId;  // Reference to the Job
  user: mongoose.Types.ObjectId;  // Reference to the Job Seeker (User)
  resume: mongoose.Types.ObjectId;  // Reference to the Resume
  status: "applied" | "interview" | "hired" | "rejected";  // Application status
  fitScore: number;  // Fit score based on AI analysis
}

const ApplicationSchema = new Schema<ApplicationDocument>({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },  // Reference to Job
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Reference to Job Seeker
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },  // Reference to Resume
  status: { type: String, required: true, enum: ["applied", "interview", "hired", "rejected"], default: "applied" },
  fitScore: { type: Number, required: true }  // Fit score for the job application
}, { timestamps: true });

export const Application = mongoose.models.Application || mongoose.model<ApplicationDocument>("Application", ApplicationSchema);
