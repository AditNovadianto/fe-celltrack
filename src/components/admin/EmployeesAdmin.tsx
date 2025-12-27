import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import profilePicture from "../../images/profile-picture.png"
import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { isTokenExpired } from "@/utils/auth"
import { useNavigate } from "react-router-dom"

const EmployeesAdmin = () => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number }>()
    const [employees, setEmployees] = useState<Array<{ id_user: number, nama_user: string, email: string, alamat: string, age: number }>>()
    const [currentPage, setCurrentPage] = useState(1)

    const navigate = useNavigate()

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/")
        }
    }, [])

    // Pagination
    const ITEMS_PER_PAGE = 5

    const totalPages = Math.ceil((employees?.length ?? 0) / ITEMS_PER_PAGE)

    const paginatedEmployees = employees?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )
    // 

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
                const response = await fetch("http://localhost:3000/getAllUsers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Employees gagal")
                }

                const data = await response.json()

                const employees = data.users.filter((user: any) => user.id_role !== 1);

                setEmployees(employees)
            } catch (error) {
                console.error(error)
            }
        }

        getAllUsers();
    }, [])

    console.log("Employees", employees)

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
                                <BreadcrumbPage>Employees</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="cursor-pointer flex items-center gap-5 bg-blue-100 px-5 py-2 rounded-md">
                    <img className="w-10" src={profilePicture} alt="" />

                    <div>
                        <p className="font-semibold">{admin?.nama_user}</p>

                        <p>{admin?.id_role === 1 ? "Admin" : "User"}</p>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id User</TableHead>
                            <TableHead>Nama User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Alamat</TableHead>
                            <TableHead>Age</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedEmployees && paginatedEmployees.map((employee) => (
                            <TableRow>
                                <TableCell className="font-medium">{employee.id_user}</TableCell>
                                <TableCell>{employee.nama_user}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.alamat}</TableCell>
                                <TableCell>{employee.age}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-end space-x-2 mt-4">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EmployeesAdmin