import { isTokenExpired } from "@/utils/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "../ui/breadcrumb";
import profilePicture from "../../images/profile-picture.png"
import { Bell, Box, Building2, HandCoins, ReceiptText, Users } from "lucide-react";

type DashboardAdminProps = {
    setSection: (section: string) => void
}

const DashboardAdmin: React.FC<DashboardAdminProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number, id_user?: number }>();
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalCostomers, setTotalCostomers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [notifications, setNotifications] = useState<{ readBy?: { role: string, id: number, readAt?: Date; }[] }[]>([]);

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
        const getAllUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllUsers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Users gagal")
                }

                const data = await response.json()

                console.log("Users", data)

                const employees = data.users.filter((user: any) => user.id_role !== 1);

                setTotalEmployees(employees.length)
            } catch (error) {
                console.error(error)
            }
        }

        const getAllCustomers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllCustomers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Customers gagal")
                }

                const data = await response.json()

                console.log("Customers", data)

                setTotalCostomers(data.customers.length)
            } catch (error) {
                console.error(error)
            }
        }

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

                console.log("Products", data)

                setTotalProducts(data.length)
            } catch (error) {
                console.error(error)
            }
        }

        const getAllSuppliers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllSuppliers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Suppliers gagal")
                }

                const data = await response.json()

                console.log("Suppliers", data)

                setTotalSuppliers(data.suppliers.length)
            } catch (error) {
                console.error(error)
            }
        }

        const getAllTransactions = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllTransactions`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Transactions gagal")
                }

                const data = await response.json()

                console.log("Transactions", data)

                setTotalTransactions(data.transactions.length)
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

                console.log("Notifications", data)

                setNotifications(data.notifications)
            } catch (error) {
                console.error(error)
            }
        }

        getAllUsers();
        getAllCustomers();
        getAllProducts();
        getAllSuppliers();
        getAllTransactions();
        getAllNotifications();
    }, [])

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
                            <p>{notifications.filter((notif) => !notif.readBy?.some((item) => item.id === admin?.id_user && item.role === "USER")).length}</p>
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

            <div className="mt-10">
                <h1 className="font-semibold text-xl">Selamat Datang, {admin?.nama_user}</h1>

                <div className="flex flex-row flex-wrap items-center gap-5 justify-center w-full pb-20">
                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <Users />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Employee</p>

                            <p className="text-3xl font-semibold">{totalEmployees}</p>
                        </div>
                    </div>

                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <HandCoins />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Customer</p>

                            <p className="text-3xl font-semibold">{totalCostomers}</p>
                        </div>
                    </div>

                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <Box />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Product</p>

                            <p className="text-3xl font-semibold">{totalProducts}</p>
                        </div>
                    </div>

                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <Building2 />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Supplier</p>

                            <p className="text-3xl font-semibold">{totalSuppliers}</p>
                        </div>
                    </div>

                    <div className="hover:scale-103 transition-all cursor-pointer w-full sm:w-[48%] xl:w-[23%] flex items-center gap-5  bg-linear-to-tr from-sky-500 to-blue-500  p-5 rounded-lg text-white mt-5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                            <ReceiptText />
                        </div>

                        <div>
                            <p className="font-semibold text-2xl">Total Transactions</p>

                            <p className="text-3xl font-semibold">{totalTransactions}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardAdmin