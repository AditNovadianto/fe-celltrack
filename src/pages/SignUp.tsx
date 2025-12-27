import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu"
import { useState } from "react"
import logo from "../images/logo-celltrack.png"
import { useNavigate } from "react-router-dom"
import { CircleX } from "lucide-react"

const SignUp = () => {
    const [role, setRole] = useState("Admin")
    const [nama_user, setNamaUser] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState("")
    const [alamat, setAlamat] = useState("")
    const [no_telp, setNoTelp] = useState("")
    const [kategori_supplier, setKategoriSupplier] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const signUpHandler = async (e: any) => {
        e.preventDefault()

        try {
            const response = await fetch(role === "Admin" || role === "Employee" ? "http://localhost:3000/signUpUsers" : "http://localhost:3000/signUpSuppliers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(role === "Admin" || role === "Employee" ? {
                    nama_user,
                    email,
                    password,
                    age,
                    alamat,
                    id_toko: 1,
                    id_role: role === "Admin" ? 1 : role === "Employee" ? 2 : 3,
                } : {
                    nama_supplier: nama_user,
                    email,
                    alamat_supplier: alamat,
                    no_telephon: no_telp,
                    kategori_supplier: kategori_supplier,
                    password,
                }),
            })

            if (!response.ok) {
                throw new Error("Sign Up gagal")
            }

            const data = await response.json()

            sessionStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(role === "Admin" || role === "Employee" ? data.user : data.supplier))

            navigate("/dashboard")
        } catch (error) {
            console.error(error)
            setError("Gagal melakukan sign up. Silakan coba lagi.")
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-5 bg-linear-to-t from-sky-950 to-white">
            <img className="absolute top-10 left-10 w-20 cursor-pointer" src={logo} alt="Logo" />

            <div className="w-full md:w-[35%] bg-white shadow-lg rounded-lg p-10">
                <p className="font-semibold text-xl text-center">Sign Up</p>

                <form className="mt-10 w-full">
                    <div>
                        <label className="block text-base font-semibold" htmlFor="">Choose Roles</label>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full mt-2 cursor-pointer" variant="outline">{role || "Select Role"}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white p-5 rounded-lg shadow-xl w-56">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup className="flex flex-col gap-2" value={role} onValueChange={setRole}>
                                    <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Admin">Admin</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Employee">Employee</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Supplier">Supplier</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {role === "Admin" || role === "Employee" ? (
                        <div>
                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Name<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setNamaUser(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="text" />
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Age<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setAge(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="text" />
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Alamat<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setAlamat(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="text" />
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Email<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setEmail(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="email" />
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Password<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setPassword(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="password" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Name Supplier<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setNamaUser(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="text" />
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Alamat Supplier<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setAlamat(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="text" />
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">No. Telp<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setNoTelp(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="text" />
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Choose Category</label>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="w-full mt-2 cursor-pointer" variant="outline">{kategori_supplier || "Select Category Supplier"}</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white p-5 rounded-lg shadow-xl w-56">
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup className="flex flex-col gap-2" value={kategori_supplier} onValueChange={setKategoriSupplier}>
                                            <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Handphone">Handphone</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Charger">Charger</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Powerbank">Powerbank</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Email Supplier<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setEmail(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="email" />
                            </div>

                            <div className="w-full mt-5">
                                <label className="block text-base font-semibold" htmlFor="">Password Supplier<span className="text-red-500">*</span></label>
                                <input onChange={(e) => setPassword(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="password" />
                            </div>
                        </div>
                    )}

                    <button onClick={(e) => signUpHandler(e)} className="w-full bg-sky-950 text-white py-2 rounded-lg mt-5 cursor-pointer">Sign Up</button>
                </form>

                <p className="mt-5 text-center">Already have an account? <a className="underline text-sky-950 font-semibold" href="/">Sign In</a></p>
            </div>

            {error && (
                <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white text-center absolute p-5 rounded-lg shadow-lg">
                        <CircleX className="text-red-500 scale-150 m-auto" />

                        <p className="text-red-500 mt-5 font-semibold text-center">{error}</p>

                        <Button className="w-full mt-5 bg-sky-950 cursor-pointer" onClick={() => setError("")}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SignUp