import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { Spinner } from "react-bootstrap";
import { authApi } from "../services/authService";

export function AdminRoute( {children} ) {
    const [status, setStatus] = useState("checking");
    const location = useLocation();

    useEffect(() => {
        let live = true;

        authApi.me()
            .then(() => live && setStatus("authenticated"))
            .catch(() => live && setStatus("anonymous"))
        
        return () => { live = false; };
    }, []);

    if (status === "checking")
    {
        return (
            <div
                className="admin-loading">
                
                <Spinner animation="border" />
                <span>Checking administrator session…</span>
            </div>
        )
    }

    if (status === "anonymous") {
        return (
            <Navigate 
                to="/admin/login"
                replace
                state={{ from: location }} />
        )
    }

    return children;
}