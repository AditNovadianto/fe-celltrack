import { Bell, Box } from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "./ui/breadcrumb"
import React, { useEffect, useState } from "react"
import { isTokenExpired } from "@/utils/auth"
import { useNavigate } from "react-router-dom"
import profilePicture from "../images/profile-picture.png"

type NotificationsProps = {
    setSection: (section: string) => void
}

const Notifications: React.FC<NotificationsProps> = ({ setSection }) => {
    const [notifications, setNotifications] = useState<{ _id?: string, id_produk?: number, message?: string, stok?: number, read?: boolean, createdAt?: Date }[]>([]);
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number }>();
    const [products, setProducts] = useState<{ id_produk: number, nama_produk: string, stok: string }[]>([])
    const [idNotification, setIdNotification] = useState("");

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
        const getAllNotifications = async () => {
            try {
                const response = await fetch("http://localhost:3000/getAllNotifications", {
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

                console.log("Notifications", data)

                setNotifications(data.notifications)
            } catch (error) {
                console.error(error)
            }
        }

        const getAllProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/getAllProducts", {
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

                setProducts(data);
            } catch (error) {
                console.error(error)
            }
        }

        getAllNotifications();
        getAllProducts();
    }, [idNotification])

    const markNotificationAsRead = async (id: string) => {
        try {
            setIdNotification(id)

            const response = await fetch(`http://localhost:3000/markNotificationAsRead/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            })

            if (!response.ok) {
                throw new Error("Update Notification As Read gagal")
            }

            setIdNotification("")
        } catch (error) {
            console.error(error)
        }
    }

    function formatDateDDMMYYYY(isoString: string | undefined): string {
        if (!isoString) return "";

        const date = new Date(isoString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }

    console.log(notifications)

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
                                <BreadcrumbPage>Notifications</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex items-center gap-10">
                    <button className="fixed bottom-24 right-5 bg-blue-300 rounded-full p-3 sm:relative sm:bg-transparent sm:p-0 sm:bottom-0 sm:right-0 cursor-pointer" onClick={() => setSection("Notifications")}>
                        <Bell size={30} />

                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-white text-blue-900 sm:bg-blue-500 sm:text-white rounded-full flex items-center justify-center">
                            <p>{notifications.filter((notification) => notification.read === false).length}</p>
                        </div>
                    </button>

                    <div className="cursor-pointer flex items-center gap-5 bg-blue-100 px-5 py-2 rounded-md">
                        <img className="w-10" src={profilePicture} alt="" />

                        <div>
                            <p className="font-semibold">{admin?.nama_user}</p>

                            <p>{admin?.id_role === 1 ? "Admin" : "Employee"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full gap-5 mt-10">
                {notifications && notifications.map((notification, index) => (
                    <button key={index} onClick={() => { markNotificationAsRead(String(notification._id)) }} className={`${notification.read === false ? 'bg-blue-200' : 'bg-gray-200'} cursor-pointer hover:scale-101 transition-all p-5 rounded-lg shadow-lg`}>
                        <div className="flex items-center gap-5 justify-between w-full">
                            <p className="font-semibold text-lg">Notification</p>

                            <p>{formatDateDDMMYYYY(String(notification.createdAt))}</p>
                        </div>

                        <div className="mt-5 flex flex-col md:flex-row items-center gap-5">
                            <Box size={40} />

                            <div>
                                <div className="flex flex-row gap-2 w-full">
                                    <p>Produk:</p>

                                    <p className="font-semibold">{products?.find((product) => product.id_produk === notification.id_produk)?.nama_produk}</p>
                                </div>

                                <div className="flex flex-row gap-2">
                                    <p>Stok:</p>

                                    <p className="font-semibold">{products?.find((product) => product.id_produk === notification.id_produk)?.stok}</p>
                                </div>

                                <div className="flex flex-row gap-2">
                                    <p>Message:</p>

                                    <p className="font-semibold text-start">{notification.message}</p>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Notifications