import express from 'express';
import { addJobPosting, listJobPostings, removeJobPosting, updateJobPosting } from '../controllers/jobPostingController.js';

const jobPostingRouter = express.Router();

// Route to add a job posting
jobPostingRouter.post("/add", addJobPosting);

// Route to list all job postings
jobPostingRouter.get("/list", listJobPostings);

// Route to remove a job posting
jobPostingRouter.post("/remove", removeJobPosting);

// Route to update a job posting
jobPostingRouter.post("/update", updateJobPosting);

export default jobPostingRouter;
