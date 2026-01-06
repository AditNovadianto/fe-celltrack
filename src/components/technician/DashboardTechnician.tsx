import { Bell, Check, CircleDashed, Settings } from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "@/utils/auth"
import profilePicture from "../../images/profile-picture.png"

type DashboardTechnicianProps = {
    setSection: (section: string) => void
}

const DashboardTechnician: React.FC<DashboardTechnicianProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_teknisi?: string, id_teknisi?: number }>();
    const [notifications, setNotifications] = useState<{ readBy?: { role: string, id: number, readAt?: Date; }[] }[]>([]);
    const [totalServiceRequests, setTotalServiceRequests] = useState(0);
    const [totalServiceDone, setTotalServiceDone] = useState(0);
    const [totalServiceOnProgress, setTotalServiceOnProgress] = useState(0);

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

        const getAllServiceRequests = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllServiceRequests`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Service Requests gagal")
                }

                // Get All Service Request
                const data = await response.json()

                console.log("Service Requests", data)

                setTotalServiceRequests(data.length)
                // 

                // Get Total Service Request Done & On Progress
                const filteringServiceRequestForSpesificTechnicians = data.filter((item: { id_teknisi: number | undefined }) => item.id_teknisi === admin?.id_teknisi)

                const totalServiceRequestOnProgress = filteringServiceRequestForSpesificTechnicians.filter((item: { status: string }) => item.status === "ON PROGRESS")

                const totalServiceRequestDone = filteringServiceRequestForSpesificTechnicians.filter((item: { status: string }) => item.status === "DONE")

                setTotalServiceOnProgress(totalServiceRequestOnProgress.length)
                setTotalServiceDone(totalServiceRequestDone.length)
                // 
            } catch (error) {
                console.error(error)
            }
        }

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

        getAllServiceRequests();
        getAllServiceRequestStatus();
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

            <div className="mt-10">
                <h1 className="font-semibold text-xl">Selamat Datang, {admin?.nama_teknisi}</h1>

                <div className="flex flex-row flex-wrap items-center gap-5 justify-center w-full">
                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <Settings />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Service Requests</p>

                            <p className="text-3xl font-semibold">{totalServiceRequests}</p>
                        </div>
                    </div>

                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <Check />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Service Done</p>

                            <p className="text-3xl font-semibold">{totalServiceDone}</p>
                        </div>
                    </div>

                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <CircleDashed />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Service On Progress</p>

                            <p className="text-3xl font-semibold">{totalServiceOnProgress}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardTechnician