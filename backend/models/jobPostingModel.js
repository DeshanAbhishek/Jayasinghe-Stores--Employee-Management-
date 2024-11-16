import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema({
    title: { type: String, required: true },           // Job title
    description: { type: String, required: true },     // Job description
    salary: { type: Number, required: true },          // Job salary
    location: { type: String, required: true },        // Job location
    category: { type: String, required: true },        // Job category or department
    deadline: { type: Date, required: true },          // Application deadline
});

const jobPostingModel = mongoose.models.jobPosting || mongoose.model("jobPosting", jobPostingSchema);

export default jobPostingModel;
