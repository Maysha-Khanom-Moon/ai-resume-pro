import mongoose, { Schema, Document } from "mongoose";

export interface FitScoreDocument extends Document {
  user: mongoose.Types.ObjectId;  // Job Seeker (User)
  job: mongoose.Types.ObjectId;   // Job
  score: number;  // Fit score between 0 and 100
  breakdown: {
    skills: number;
    experience: number;
    keywords: number;
  };  // Breakdown of how the score is calculated
}

const FitScoreSchema = new Schema<FitScoreDocument>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  score: { type: Number, required: true },
  breakdown: {
    skills: { type: Number, required: true },
    experience: { type: Number, required: true },
    keywords: { type: Number, required: true }
  }
}, { timestamps: true });

export const FitScore = mongoose.models.FitScore || mongoose.model<FitScoreDocument>("FitScore", FitScoreSchema);
