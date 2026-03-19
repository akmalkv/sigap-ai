'use client'

import { useState } from 'react'
import { Trash2, CheckCircle } from 'lucide-react'
import { deleteReport, verifyReport } from '../actions'

export default function AdminButtons({ reportId, currentStatus }: { reportId: string, currentStatus?: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Cek apakah statusnya sudah VERIFIED
  const isVerified = currentStatus === 'VERIFIED'

  const handleDelete = async () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus data ini dari database? Tindakan ini tidak bisa dibatalkan.')) {
      setIsDeleting(true)
      await deleteReport(reportId)
    }
  }

  const handleVerify = async () => {
    if (window.confirm('Verifikasi laporan ini sebagai data yang valid dan sah?')) {
      setIsVerifying(true)
      await verifyReport(reportId)
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
      
      {/* Tombol Verifikasi (Hijau) */}
      <button 
        onClick={handleVerify}
        disabled={isVerified || isVerifying}
        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all ${
          isVerified 
            ? 'bg-green-50 text-green-600 border border-green-200 cursor-not-allowed' 
            : 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20'
        }`}
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        {isVerifying ? 'Memproses...' : isVerified ? 'Telah Diverifikasi' : 'Verifikasi Laporan'}
      </button>

      {/* Tombol Hapus (Merah) */}
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex-1 flex items-center justify-center px-4 py-3 bg-white text-red-600 border-2 border-red-100 hover:bg-red-50 hover:border-red-200 rounded-xl font-bold transition-all"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        {isDeleting ? 'Menghapus...' : 'Hapus Permanen'}
      </button>

    </div>
  )
}