import logo from "../images/logo-celltrack.png"

const ForgotPassword = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-5 bg-linear-to-t from-sky-950 to-white">
            <img className="absolute top-10 left-10 w-20 cursor-pointer" src={logo} alt="Logo" />

            <div className="w-full md:w-[35%] bg-white shadow-lg rounded-lg p-10">
                <p className="font-semibold text-xl text-center">Forgot Password</p>

                <form className="mt-10 w-full">
                    <div className="w-full">
                        <label className="block text-base font-semibold" htmlFor="">Email<span className="text-red-500">*</span></label>
                        <input className="w-full border px-5 py-2 rounded-lg mt-2" type="email" />
                    </div>

                    <div className="w-full mt-5">
                        <label className="block text-base font-semibold" htmlFor="">Old Password<span className="text-red-500">*</span></label>
                        <input className="w-full border px-5 py-2 rounded-lg mt-2" type="password" />
                    </div>

                    <div className="w-full mt-5">
                        <label className="block text-base font-semibold" htmlFor="">New Password<span className="text-red-500">*</span></label>
                        <input className="w-full border px-5 py-2 rounded-lg mt-2" type="password" />
                    </div>

                    <button className="w-full bg-sky-950 text-white py-2 rounded-lg mt-5 cursor-pointer">Reset Password</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword