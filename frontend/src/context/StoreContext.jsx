import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [payrollItem, setPayrollItem] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [allemployee_list, setallemployee_list] = useState([]);
    const [alljobposting_list, setalljobposting_list] = useState([]);

    const addToPayroll = (itemId) => {
        setPayrollItem((prev) => ({
            ...prev,
            [itemId]: prev[itemId] ? prev[itemId] = 1 : 1,
        }));
    };

    const removeFromPayroll = (itemId) => {
        setPayrollItem((prev) => {
            const updated = { ...prev };
            if (updated[itemId] > 1) {
                updated[itemId] -= 1;
            } else {
                delete updated[itemId];
            }
            return updated;
        });
    };

    const fetchEmployeeList = async () => {
        try {
            const response = await axios.get(url + "/api/employee/list");
            if (response.data.data) {
                setallemployee_list(response.data.data);
            } else {
                console.error("Failed to fetch employees:", response.data);
            }
        } catch (error) {
            console.error("Error fetching employee list:", error);
        }
    };

    const fetchJobPostingList = async () => {
        try {
            const response = await axios.get(url + "/api/jobposting/list");
            if (response.data.jobPostings) {
                setalljobposting_list(response.data.jobPostings);
            } else {
                console.error("Failed to fetch job postings:", response.data);
            }
        } catch (error) {
            console.error("Error fetching job postings:", error);
        }
    };

    useEffect(() => {
        console.log("Current Payroll Items:", payrollItem);
    }, [payrollItem]);

    useEffect(() => {
        const loadData = async () => {
            await fetchEmployeeList();
            await fetchJobPostingList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
            }
        };
        loadData();
    }, []);

    

    const contextValue = {
        allemployee_list,
        payrollItem,
        setPayrollItem,
        addToPayroll,
        removeFromPayroll,
        url,
        token,
        setToken,
        alljobposting_list,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
