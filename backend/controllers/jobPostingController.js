import jobPostingModel from "../models/jobPostingModel.js"; // Import job posting model

// Add Job Posting
const addJobPosting = async (req, res) => {
    const { title, description, salary, location, category, deadline } = req.body;

    // Validate required fields
    if (!title || !description || !salary || !location || !category || !deadline) {
        return res.json({ success: false, message: "All fields are required." });
    }

    const jobPosting = new jobPostingModel({
        title,
        description,
        salary,
        location,
        category,
        deadline,
    });

    try {
        await jobPosting.save();
        res.json({ success: true, message: "Job Posting Added Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Adding Job Posting" });
    }
};

// List all Job Postings
const listJobPostings = async (req, res) => {
    try {
        const jobPostings = await jobPostingModel.find({});
        res.json({ success: true, jobPostings }); // Updated response structure
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Fetching Job Postings" });
    }
};

// Remove Job Posting
const removeJobPosting = async (req, res) => {
    const { id } = req.body;

    try {
        const jobPosting = await jobPostingModel.findById(id);
        if (!jobPosting) {
            return res.json({ success: false, message: "Job Posting Not Found" });
        }

        await jobPostingModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Job Posting Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Removing Job Posting" });
    }
};

// Update Job Posting
const updateJobPosting = async (req, res) => {
    const { id, title, description, salary, location, category, deadline } = req.body;

    try {
        const updatedJobPosting = await jobPostingModel.findByIdAndUpdate(
            id,
            { title, description, salary, location, category, deadline },
            { new: true } // Return the updated document
        );

        if (updatedJobPosting) {
            res.json({ success: true, message: "Job Posting Updated Successfully" });
        } else {
            res.json({ success: false, message: "Job Posting Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Updating Job Posting" });
    }
};

export { addJobPosting, listJobPostings, removeJobPosting, updateJobPosting };
