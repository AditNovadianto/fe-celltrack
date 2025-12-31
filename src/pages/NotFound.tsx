import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>

            <h1 className="text-6xl font-extrabold text-gray-800 mb-2">
                404
            </h1>

            <p className="text-xl font-semibold text-gray-700 mb-2">
                Halaman Tidak Ditemukan
            </p>

            <p className="text-gray-500 max-w-md mb-6">
                Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
            </p>

            <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-700 transition-all"
            >
                Kembali ke Beranda
            </Link>
        </div>
    );
};

export default NotFound;
