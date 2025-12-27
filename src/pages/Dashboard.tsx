import { Button } from "@/components/ui/button"
import { Box, Building2, HandCoins, LayoutDashboard, LogOut, ReceiptText, UsersRound } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../images/logo-celltrack.png"
import DashboardAdmin from "@/components/admin/DashboardAdmin"
import DashboardEmployee from "@/components/employee/DashboardEmployee"
import DashboardSupplier from "@/components/DashboardSupplier"
import EmployeesAdmin from "@/components/admin/EmployeesAdmin"
import ProductsAdmin from "@/components/admin/ProductsAdmin"
import SuppliersAdmin from "@/components/admin/SuppliersAdmin"
import CustomersAdmin from "@/components/admin/CustomersAdmin"
import CustomersEmployee from "@/components/employee/CustomersEmployee"
import TransactionsAdmin from "@/components/admin/TransactionsAdmin"

const Dashboard = () => {
    const [section, setSection] = useState("Dashboard")
    const [isHovered, setIsHovered] = useState(false)
    const [user, setUser] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const user = localStorage.getItem("user");
        const userObj = JSON.parse(user || "{}");

        if (user) {
            if (userObj.hasOwnProperty("id_supplier")) {
                setUser("Supplier");
            } else {
                if (userObj.id_role === 1) {
                    setUser("Admin");
                } else {
                    setUser("Employee");
                }
            }
        }
    }, []);

    const logOutHandler = () => {
        sessionStorage.removeItem("token")
        localStorage.removeItem("user")

        navigate("/")
    }

    return (
        <div className="min-h-screen h-screen flex flex-col md:flex-row items-center w-full">
            <div className={`${isHovered ? "w-[20%]" : "w-20"} transition-all duration-300 ease-in-out hidden md:flex h-full bg-sky-950 p-5 flex-col gap-10`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <img className="m-auto w-20 cursor-pointer" src={logo} alt="Logo" />

                <div className="flex flex-col justify-between w-full h-full gap-5">
                    <div className={`${user === "Admin" ? 'flex' : 'hidden'} w-full flex-col gap-5`}>
                        <Button className={`${section === "Dashboard" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Dashboard")}><LayoutDashboard /> {!isHovered ? '' : 'Dashboard'}</Button>

                        <Button className={`${section === "Employees" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Employees")}><UsersRound /> {!isHovered ? '' : 'Employees'}</Button>

                        <Button className={`${section === "Customers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Customers")}><HandCoins /> {!isHovered ? '' : 'Customers'}</Button>

                        <Button className={`${section === "Products" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Products")}><Box /> {!isHovered ? '' : 'Products'}</Button>

                        <Button className={`${section === "Suppliers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Suppliers")}><Building2 /> {!isHovered ? '' : 'Suppliers'}</Button>

                        <Button className={`${section === "Transactions" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Transactions")}><ReceiptText /> {!isHovered ? '' : 'Transactions'}</Button>
                    </div>

                    <div className={`${user === "Employee" ? 'flex' : 'hidden'} w-full flex-col gap-5`}>
                        <Button className={`${section === "Dashboard" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Dashboard")}><LayoutDashboard /> {!isHovered ? '' : 'Dashboard'}</Button>

                        <Button className={`${section === "Customers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Customers")}><HandCoins /> {!isHovered ? '' : 'Customers'}</Button>

                        <Button className={`${section === "Products" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Products")}><Box /> {!isHovered ? '' : 'Products'}</Button>

                        <Button className={`${section === "Transactions" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Transactions")}><ReceiptText /> {!isHovered ? '' : 'Transactions'}</Button>
                    </div>

                    <div className="w-full">
                        <Button onClick={() => logOutHandler()} className="bg-red-500 w-full cursor-pointer"><LogOut /> {!isHovered ? '' : 'Log Out'}</Button>
                    </div>
                </div>
            </div>

            {/* Admin Dashboard Content */}
            {user === "Admin" && (
                <div className="border border-red-500 w-full h-full">
                    {section === "Dashboard" && <DashboardAdmin />}

                    {section === "Employees" && <EmployeesAdmin />}

                    {section === "Customers" && <CustomersAdmin />}

                    {section === "Products" && <ProductsAdmin />}

                    {section === "Suppliers" && <SuppliersAdmin />}

                    {section === "Transactions" && <TransactionsAdmin />}
                </div>
            )}

            {user === "Admin" && (
                <>
                    <div className="hidden sm:flex md:hidden items-center justify-between w-full p-5 bg-sky-950">
                        <Button className={`${section === "Dashboard" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Dashboard")}><LayoutDashboard /> Dashboard</Button>

                        <Button className={`${section === "Employees" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Employees")}><UsersRound /> Employees</Button>

                        <Button className={`${section === "Customers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Customers")}><HandCoins /> Customers</Button>

                        <Button className={`${section === "Products" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Products")}><Box /> Products</Button>

                        <Button className={`${section === "Suppliers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Suppliers")}><Building2 /> Suppliers</Button>

                        <Button className={`${section === "Orders" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Orders")}><ReceiptText /> Orders</Button>
                    </div>

                    <div className="flex sm:hidden md:hidden items-center justify-between w-full p-5 bg-sky-950">
                        <Button className={`${section === "Dashboard" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Dashboard")}><LayoutDashboard /></Button>

                        <Button className={`${section === "Employees" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Employees")}><UsersRound /></Button>

                        <Button className={`${section === "Customers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Customers")}><HandCoins /></Button>

                        <Button className={`${section === "Products" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Products")}><Box /></Button>

                        <Button className={`${section === "Suppliers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Suppliers")}><Building2 /></Button>

                        <Button className={`${section === "Orders" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Orders")}><ReceiptText /></Button>
                    </div>
                </>
            )}
            {/*  */}

            {/* Employee Dashboard Content */}
            {user === "Employee" && (
                <div className="border border-red-500 w-full h-full">
                    {section === "Dashboard" && <DashboardEmployee />}

                    {section === "Customers" && <CustomersEmployee />}
                </div>
            )}

            {user === "Employee" && (
                <>
                    <div className="hidden sm:flex md:hidden items-center justify-between w-full p-5 bg-sky-950">
                        <Button className={`${section === "Dashboard" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Dashboard")}><LayoutDashboard /> Dashboard</Button>

                        <Button className={`${section === "Customers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Customers")}><HandCoins /> Customers</Button>

                        <Button className={`${section === "Products" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Products")}><Box /> Products</Button>

                        <Button className={`${section === "Orders" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Orders")}><ReceiptText /> Orders</Button>
                    </div>

                    <div className="flex sm:hidden md:hidden items-center justify-between w-full p-5 bg-sky-950">
                        <Button className={`${section === "Dashboard" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Dashboard")}><LayoutDashboard /></Button>

                        <Button className={`${section === "Customers" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Customers")}><HandCoins /></Button>

                        <Button className={`${section === "Products" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Products")}><Box /></Button>

                        <Button className={`${section === "Orders" ? "bg-white/50 hover:bg-white/30" : "bg-transparent hover:bg-white/20"} cursor-pointer flex justify-start`} onClick={() => setSection("Orders")}><ReceiptText /></Button>
                    </div>
                </>
            )}
            {/*  */}

            {user === "Supplier" && (
                <div className="border border-red-500 w-full h-full">
                    {section === "Dashboard" && <DashboardSupplier />}
                </div>
            )}
        </div>
    )
}

export default Dashboard