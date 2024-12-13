import { createContext, useContext, useState, useCallback } from "react";
import {
    getRoutesRequest,
    createRoutesRequest,
    updateRoutesRequest,
    deleteRoutesRequest,
} from "../config/adminRoute";

const RoutesContext = createContext();

export const useRoutes = () => {
    return useContext(RoutesContext);
};

export const RoutesProvider = ({ children }) => {
    const [routes, setRoutes] = useState([]);

    const getRoutes = useCallback(async () => {
        try {
            const response = await getRoutesRequest();
            setRoutes(response.data);
        } catch (error) {
            console.error("Error fetching routes:", error);
        }
    }, []); 

    const createRoute = useCallback(async (route) => {
        try {
            const response = await createRoutesRequest(route);
            setRoutes((prevRoutes) => [...prevRoutes, response.data]); 
        } catch (error) {
            console.error("Error creating route:", error);
        }
    }, []);

    const updateRoute = useCallback(async (id, route) => {
        try {
            console.log("Datos para actualizar ruta:", { id, route });
            const response = await updateRoutesRequest(id, route);
            setRoutes((prevRoutes) =>
                prevRoutes.map((r) =>
                    r.idRoutes === id ? response.data : r
                )
            );
            return response.data;
        } catch (error) {
            console.error("Error updating route:", error);
            throw error;
        }
    }, []);

    const deleteRoute = useCallback(async (id) => {
        try {
            await deleteRoutesRequest(id);
            setRoutes((prevRoutes) => prevRoutes.filter((r) => r.idRoutes !== id));
        } catch (error) {
            console.error("Error deleting route:", error);
        }
    }, []);

    return (
        <RoutesContext.Provider
            value={{
                routes,
                getRoutes,
                createRoute,
                updateRoute,
                deleteRoute,
            }}
        >
            {children}
        </RoutesContext.Provider>
    );
};
