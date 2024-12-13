import { createContext, useContext, useState, useCallback } from "react";
import {
    getAssignmentsRequest,
    createAssignmentRequest,
    updateAssignmentRequest,
    deleteAssignmentRequest,
} from "../config/adminAssignment";

const AssignmentsContext = createContext();

export const useAssignments = () => {
    return useContext(AssignmentsContext);
};

export const AssignmentsProvider = ({ children }) => {
    const [assignments, setAssignments] = useState([]);

    const getAssignments = useCallback(async () => {
        try {
            const response = await getAssignmentsRequest();
            setAssignments(response.data);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    }, []);

    const createAssignment = useCallback(async (assignment) => {
        try {
            console.log("Datos enviados al backend desde createAssignment:", assignment);
            const response = await createAssignmentRequest(assignment);
            console.log("Respuesta del backend:", response.data);
            setAssignments((prevAssignments) => [...prevAssignments, response.data.assignment]);
        } catch (error) {
            console.error("Error creando asignación:", error.response?.data || error.message);
            throw error; 
        }
    }, []);

    const updateAssignment = useCallback(async (id, assignment) => {
        try {
            console.log("Datos para actualizar:", { id, assignment });

            const response = await updateAssignmentRequest(id, assignment);

            setAssignments((prevAssignments) =>
                prevAssignments.map((a) =>
                    a._id === id ? response.data : a
                )
            );

            console.log("Asignación actualizada:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating assignment:", error);

            if (error.response) {
                console.error("Datos de respuesta de error:", error.response.data);
                console.error("Código de estado:", error.response.status);
            } else if (error.request) {
                console.error("No se recibió respuesta:", error.request);
            } else {
                console.error("Error de configuración:", error.message);
            }

            throw error;
        }
    }, []);

    const deleteAssignment = useCallback(async (id) => {
        try {
            await deleteAssignmentRequest(id);
            setAssignments((prevAssignments) =>
                prevAssignments.filter((a) => a._id !== id)
            );
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    }, []);

    return (
        <AssignmentsContext.Provider
            value={{
                assignments,
                getAssignments,
                createAssignment,
                updateAssignment,
                deleteAssignment,
            }}
        >
            {children}
        </AssignmentsContext.Provider>
    );
};
