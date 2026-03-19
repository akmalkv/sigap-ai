import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, AlertTriangle, Activity } from 'lucide-react'
import AdminButtons from './AdminButtons'

export default async function ReportDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const supabase = await createClient()

  const { data: report, error } = await supabase
    .from('damage_reports')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !report) {
    notFound()
  }

  const damageClass = report.damageClass || report.damage_class || 'RUSAK_RINGAN'
  const confPercent = Math.round((report.confidence || 0) * 100)
  
  const date = new Date(Number(report.timestamp)).toLocaleDateString('id-ID', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).replace('.', ':')

  let colorTheme = { text: '', bg: '', badge: '', label: '' }
  if (damageClass === 'RUSAK_BERAT') colorTheme = { text: 'text-damage-berat', bg: 'bg-damage-beratBg', badge: 'bg-damage-berat text-white', label: 'Rusak Berat' }
  else if (damageClass === 'RUSAK_SEDANG') colorTheme = { text: 'text-damage-sedang', bg: 'bg-damage-sedangBg', badge: 'bg-damage-sedang text-white', label: 'Rusak Sedang' }
  else colorTheme = { text: 'text-damage-ringan', bg: 'bg-damage-ringanBg', badge: 'bg-damage-ringan text-white', label: 'Rusak Ringan' }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      <Link href="/admin/history" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-sigapBlue transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Riwayat
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`p-6 border-b border-gray-100 flex justify-between items-start ${colorTheme.bg}`}>
          <div>
            <h1 className={`text-3xl font-bold ${colorTheme.text}`}>{colorTheme.label}</h1>
            <p className="text-gray-600 mt-1 font-medium">ID Laporan: <span className="text-gray-400 font-mono text-sm">{report.id}</span></p>
          </div>
          <div className={`px-4 py-2 rounded-xl font-bold text-lg shadow-sm ${colorTheme.badge}`}>
            {confPercent}% AI
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Foto Asli Lapangan</p>
              {report.photo_url ? (
                <img src={report.photo_url} alt="Foto Asli" className="w-full h-64 object-cover rounded-2xl border border-gray-200 shadow-sm" />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center border border-dashed border-gray-300">
                  <span className="text-gray-400">Tidak ada foto</span>
                </div>
              )}
            </div>
            
            {report.heatmap_url && (
              <div>
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider mt-6">Analisis Heatmap (Grad-CAM)</p>
                <img src={report.heatmap_url} alt="Heatmap" className="w-full h-64 object-cover rounded-2xl border border-gray-200 shadow-sm" />
              </div>
            )}
          </div>

          <div className="space-y-6">
            
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-5 h-5 text-sigapBlue mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-500">Lokasi Kejadian</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{report.address}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">Lat: {report.latitude}, Lng: {report.longitude}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-sigapBlue mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-500">Waktu Laporan</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{date} WIB</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="w-5 h-5 text-sigapBlue" />
                <p className="text-sm font-bold text-gray-500">Model AI Inference</p>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-3 bg-white px-3 py-2 rounded-lg border border-gray-200">
                MobileNetV3 + Grad-CAM XAI
              </p>
              
              <div className="space-y-2 mt-4">
                 <p className="text-xs text-gray-500 italic">*Data klasifikasi ini di-generate secara offline di perangkat relawan (Edge AI).</p>
              </div>
            </div>

            {report.notes && (
              <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">
                 <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-bold text-yellow-800">Catatan Relawan</p>
                </div>
                <p className="text-sm text-yellow-900">{report.notes}</p>
              </div>
            )}

            <AdminButtons 
              reportId={report.id} 
              currentStatus={report.status} 
            />
            
          </div>
        </div>
      </div>
    </div>
  )
}