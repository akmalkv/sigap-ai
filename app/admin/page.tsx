// app/admin/page.tsx
import { createClient } from '@/utils/supabase/server'
import { AlertCircle, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

function formatDate(timestamp: number | string) {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).replace('.', ':');
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: totalLaporan } = await supabase
    .from('damage_reports')
    .select('*', { count: 'exact', head: true })

  const { count: belumVerifikasi } = await supabase
    .from('damage_reports')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'VERIFIED') 

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  
  const { count: laporanHariIni } = await supabase
    .from('damage_reports')
    .select('*', { count: 'exact', head: true })
    .gte('timestamp', startOfToday.getTime())

  const { data: rawReports } = await supabase
    .from('damage_reports')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(5)

  const recentReports = rawReports || []

  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      <div className="bg-sigapBlue rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-6 right-8 w-12 h-12 bg-white/20 rounded-full blur-sm"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        
        <p className="text-sigapBlue-bg text-sm font-medium mb-1">{greeting},</p>
        <h2 className="text-3xl font-bold mb-8">Relawan Sigap AI</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-sigapBlue-dark/40 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-sm text-sigapBlue-bg mb-1 font-medium">Total Laporan Masuk</p>
            <p className="text-4xl font-extrabold">{totalLaporan || 0}</p>
          </div>
          <div className="bg-sigapBlue-dark/40 p-5 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden">
            {(belumVerifikasi || 0) > 0 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
            )}
            <p className="text-sm text-yellow-300 mb-1 font-medium">Menunggu Verifikasi</p>
            <p className="text-4xl font-extrabold text-yellow-400">{belumVerifikasi || 0}</p>
          </div>
          <div className="bg-sigapBlue-dark/40 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-sm text-sigapBlue-bg mb-1 font-medium">Masuk Hari Ini</p>
            <p className="text-4xl font-extrabold">{laporanHariIni || 0}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Laporan Terbaru dari Lapangan</h3>
          <Link href="/admin/history" className="text-sm font-semibold text-sigapBlue hover:text-sigapBlue-dark flex items-center">
            Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {recentReports.map((report) => {
            const damageClass = report.damageClass || report.damage_class || 'RUSAK_RINGAN'
            const isVerified = report.status === 'VERIFIED'
            
            let colorTheme = { text: '', bg: '', iconBg: '', label: '' }
            if (damageClass === 'RUSAK_BERAT') colorTheme = { text: 'text-damage-berat', bg: 'bg-damage-beratBg', iconBg: 'bg-damage-berat/30', label: 'Rusak Berat' }
            else if (damageClass === 'RUSAK_SEDANG') colorTheme = { text: 'text-damage-sedang', bg: 'bg-damage-sedangBg', iconBg: 'bg-damage-sedang/30', label: 'Rusak Sedang' }
            else colorTheme = { text: 'text-damage-ringan', bg: 'bg-damage-ringanBg', iconBg: 'bg-damage-ringan/30', label: 'Rusak Ringan' }

            const confPercent = Math.round((report.confidence || 0) * 100)

            return (
              <Link 
                href={`/admin/history/${report.id}`} 
                key={report.id} 
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-sigapBlue/30 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorTheme.bg} group-hover:scale-105 transition-transform`}>
                    <div className={`w-8 h-8 rounded-md ${colorTheme.iconBg}`}></div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-gray-900 text-lg">{colorTheme.label}</h4>
                      {/* Badge Status Mini */}
                      {isVerified ? (
                        <span className="flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">
                          <Clock className="w-3 h-3 mr-0.5" /> Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{report.address || 'Lokasi tidak tersedia'}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <p className="text-xs text-gray-400 font-medium">{formatDate(report.timestamp)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${colorTheme.bg} ${colorTheme.text}`}>
                    {confPercent}% AI
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-sigapBlue transition-colors" />
                </div>
              </Link>
            )
          })}

          {recentReports.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">Belum ada laporan kerusakan yang masuk.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}