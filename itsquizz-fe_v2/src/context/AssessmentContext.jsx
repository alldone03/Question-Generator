import { createContext, useState } from "react";
import { assesmentService } from "../services/api";



const AssessmentContext = createContext();


export const AssessmentProvider = ({ children }) => {
    const [assessment, setAssessment] = useState(null);

    const fetchAssessment = async () => {
        try {
            const response = await assesmentService.getAssesments();
            setAssessment(response.data);
        } catch (error) {
            console.error("Failed to fetch assessment:", error);
        }
    };
    


    return (
        <AssessmentContext.Provider value={{ assessment, fetchAssessment }}>
            {children}
        </AssessmentContext.Provider>
    )

}