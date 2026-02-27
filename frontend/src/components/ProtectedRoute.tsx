import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole?: "candidate" | "recruiter";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user?.userType !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
