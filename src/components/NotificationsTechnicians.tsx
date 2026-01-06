import { Bell, Box } from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "./ui/breadcrumb"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "@/utils/auth"
import profilePicture from "../images/profile-picture.png"

type NotificationsTechniciansProps = {
    setSection: (section: string) => void
}

const NotificationsTechnicians: React.FC<NotificationsTechniciansProps> = ({ setSection }) => {
    const [notifications, setNotifications] = useState<{ _id?: string, id_service_request?: number, status?: string, readBy?: { role: string, id: number, readAt?: Date; }[], createdAt?: Date }[]>([]);
    const [admin, setAdmin] = useState<{ nama_teknisi?: string, id_teknisi?: number }>();
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
        if (!admin) return;

        const getAllServiceRequestStatus = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllServiceRequestStatus`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get All Service Request Status gagal")
                }

                const data = await response.json()

                setNotifications(data.serviceRequestStatus)
            } catch (error) {
                console.error(error)
            }
        }

        getAllServiceRequestStatus();
    }, [admin, idNotification])

    const markServiceRequestStatusAsRead = async (id: string) => {
        try {
            setIdNotification(id)

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/markServiceRequestStatusAsRead/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    userId: admin?.id_teknisi,
                    role: "TECHNICIAN"
                })
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
        <div className="p-5 max-h-screen overflow-y-auto">
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
                            <p>{notifications.filter((notif) => !notif.readBy?.some((item) => item.id === admin?.id_teknisi && item.role === "TECHNICIAN")).length}</p>
                        </div>
                    </button>

                    <div className="cursor-pointer flex items-center gap-5 bg-blue-100 px-5 py-2 rounded-md">
                        <img className="w-10" src={profilePicture} alt="" />

                        <div>
                            <p className="font-semibold">{admin?.nama_teknisi}</p>

                            <p>Technician</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full gap-5 mt-10 mb-20 lg:mb-0">
                {notifications && notifications.map((notification, index) => (
                    <button key={index} onClick={() => { markServiceRequestStatusAsRead(String(notification._id)) }} className={`${notification.readBy?.some((item) => item.id === admin?.id_teknisi && item.role === "TECHNICIAN") ? 'bg-gray-200' : 'bg-blue-200'} cursor-pointer hover:scale-101 transition-all p-5 rounded-lg shadow-lg`}>
                        <div className="flex items-center gap-5 justify-between w-full">
                            <p className="font-semibold text-lg">Notification</p>

                            <p>{formatDateDDMMYYYY(String(notification.createdAt))}</p>
                        </div>

                        <div className="mt-5 flex flex-col md:flex-row items-center gap-5">
                            <Box size={40} />

                            <div>
                                <div className="flex flex-row gap-2 w-full">
                                    <p>Id Service Request:</p>

                                    <p className="font-semibold">{notification.id_service_request}</p>
                                </div>

                                <div className="flex flex-row gap-2">
                                    <p>Status:</p>

                                    <p className="font-semibold">{notification.status}</p>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default NotificationsTechnicians