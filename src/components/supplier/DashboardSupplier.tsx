import { isTokenExpired } from "@/utils/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardSupplier = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/")
        }

    }, [])

    return (
        <div>DashboardSupplier</div>
    )
}

export default DashboardSupplier