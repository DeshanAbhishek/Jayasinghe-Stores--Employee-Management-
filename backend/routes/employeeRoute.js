import express from 'express';
import { addEmployee, listEmployee, removeEmployee, updateEmployee } from '../controllers/employeeController.js';
import multer from "multer";

const employeeRouter = express.Router();

// Image storage
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

employeeRouter.post("/add", upload.single("image"), addEmployee);
employeeRouter.get("/list", listEmployee);
employeeRouter.post("/remove", removeEmployee);
employeeRouter.post("/update", updateEmployee); // New route for updating employees

export default employeeRouter;
