// models/Job.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IApplicant {
  user: mongoose.Types.ObjectId;
  resumeUrl: string;
  appliedAt: Date;
}

interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  recruiter: mongoose.Types.ObjectId;
  applicants: IApplicant[];
  createdAt: Date;
  updatedAt: Date;
}

const ApplicantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicants: [ApplicantSchema],
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
JobSchema.index({ recruiter: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ 'applicants.user': 1 });

export const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);