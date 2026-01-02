import { isTokenExpired } from "@/utils/auth";
import { Bell, Box } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profilePicture from "../../images/profile-picture.png"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb";

type DashboardSupplierProps = {
    setSection: (section: string) => void
}

const DashboardSupplier: React.FC<DashboardSupplierProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_supplier?: string, id_role?: number, id_supplier?: number }>();
    const [notifications, setNotifications] = useState<{ readBy?: { role: string, id: number, readAt?: Date; }[] }[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/")
        }

    }, [])

    useEffect(() => {
        const user = localStorage.getItem("user");
        const userObj = JSON.parse(user || "{}");

        if (user) {
            setAdmin(userObj);
        }
    }, [])

    useEffect(() => {
        if (!admin) return;

        const getAllProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllProducts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Products gagal")
                }

                const data = await response.json()

                const dataForSpesificSupplier = data.filter((item: { id_supplier: number | undefined; }) => item.id_supplier === admin?.id_supplier)

                console.log("Products For Spesific Supplier", dataForSpesificSupplier)

                setTotalProducts(dataForSpesificSupplier.length)
            } catch (error) {
                console.error(error)
            }
        }

        const getAllNotifications = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllNotifications`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Notifications gagal")
                }

                const data = await response.json()

                const dataForSpesificSupplier = data.notifications.filter((item: { id_supplier: number | undefined; }) => item.id_supplier === admin?.id_supplier)

                console.log("Notifications For Spesific Supplier", dataForSpesificSupplier)

                setNotifications(dataForSpesificSupplier)
            } catch (error) {
                console.error(error)
            }
        }

        getAllProducts();
        getAllNotifications();
    }, [admin])

    return (
        <div className="p-5">
            <div className="flex items-center gap-5 w-full justify-between">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex items-center gap-10">
                    <button className="fixed bottom-24 right-5 bg-blue-300 rounded-full p-3 sm:relative sm:bg-transparent sm:p-0 sm:bottom-0 sm:right-0 cursor-pointer" onClick={() => setSection("Notifications")}>
                        <Bell size={30} />

                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-white text-blue-900 sm:bg-blue-500 sm:text-white rounded-full flex items-center justify-center">
                            <p>{notifications.filter((notif) => !notif.readBy?.some((item) => item.id === admin?.id_supplier && item.role === "SUPPLIER")).length}</p>
                        </div>
                    </button>

                    <div className="cursor-pointer flex items-center gap-5 bg-blue-100 px-5 py-2 rounded-md">
                        <img className="w-10" src={profilePicture} alt="" />

                        <div>
                            <p className="font-semibold">{admin?.nama_supplier}</p>

                            <p>Supplier</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h1 className="font-semibold text-xl">Selamat Datang, {admin?.nama_supplier}</h1>

                <div className="flex flex-row flex-wrap items-center gap-5 justify-center w-full">
                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <Box />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Product</p>

                            <p className="text-3xl font-semibold">{totalProducts}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardSupplier