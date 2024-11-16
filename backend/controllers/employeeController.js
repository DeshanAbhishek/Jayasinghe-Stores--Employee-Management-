import employeeModel from "../models/employeeModel.js";
import fs from 'fs';

// Add employee
const addEmployee = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const employee = new employeeModel({
        name: req.body.name,
        description: req.body.description,
        basicSalary: req.body.basicSalary,
        category: req.body.category,
        dob:req.body.dob,
        nic:req.body.nic,
        contactNo:req.body.contactNo,
        image: image_filename
    });
    try {
        await employee.save();
        res.json({ success: true, message: "Employee Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// List all employees
const listEmployee = async (req, res) => {
    try {
        const employees = await employeeModel.find({});
        res.json({ success: true, data: employees });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove employee
const removeEmployee = async (req, res) => {
    try {
        const employee = await employeeModel.findById(req.body.id);
        fs.unlink(`uploads/${employee.image}`, () => { });

        await employeeModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Employee Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Update employee details
const updateEmployee = async (req, res) => {
    try {
        const { id, name, description, basicSalary, category,dob,nic,contactNo } = req.body;
        const updatedEmployee = await employeeModel.findByIdAndUpdate(id, {
            name,
            description,
            basicSalary,
            category,
            dob,
            nic,
            contactNo
        }, { new: true });

        if (updatedEmployee) {
            res.json({ success: true, message: "Employee updated successfully" });
        } else {
            res.json({ success: false, message: "Employee not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating employee" });
    }
};

export { addEmployee, listEmployee, removeEmployee, updateEmployee };
