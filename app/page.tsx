import Link from 'next/link'
import { Map, ShieldAlert, Activity } from 'lucide-react'

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sigapBlue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-damage-berat/5 rounded-full blur-3xl"></div>

      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 md:p-16 text-center z-10 relative">
        <div className="w-20 h-20 bg-sigapBlue-bg rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-sigapBlue" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Portal Publik <span className="text-sigapBlue">Sigap AI</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
          Sistem pemantauan kerusakan infrastruktur pascabencana berbasis kecerdasan buatan (Edge AI).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
          <Link href="/public-map" className="flex items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-sigapBlue hover:bg-sigapBlue-bg transition-all group">
            <Map className="w-6 h-6 text-gray-400 group-hover:text-sigapBlue mr-3" />
            <span className="font-bold text-gray-700 group-hover:text-sigapBlue">Peta Publik</span>
          </Link>
          <Link href="/public-history" className="flex items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-sigapBlue hover:bg-sigapBlue-bg transition-all group">
            <Activity className="w-6 h-6 text-gray-400 group-hover:text-sigapBlue mr-3" />
            <span className="font-bold text-gray-700 group-hover:text-sigapBlue">Data Laporan</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">Khusus Petugas & Relawan Terdaftar</p>
          <Link href="/admin" className="inline-flex items-center justify-center px-6 py-3 bg-sigapBlue text-white font-bold rounded-xl hover:bg-sigapBlue-dark transition-shadow shadow-md shadow-sigapBlue/20">
            Masuk ke Dasbor Admin
          </Link>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-400 font-medium z-10">
        &copy; 2026 Sigap AI - Indonesia
      </p>
    </div>
  )
}