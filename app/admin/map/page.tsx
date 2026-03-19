// app/map/page.tsx
import { createClient } from '@/utils/supabase/server'
import Map from '@/components/MapViewer' 

export default async function MapPage() {
  const supabase = await createClient()

  const { data: reports } = await supabase
    .from('damage_reports')
    .select('*')
    .order('timestamp', { ascending: false })

  const validReports = (reports || []).filter(
    (r) => r.latitude && r.longitude && r.latitude !== 0 && r.longitude !== 0
  )

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Peta Sebaran Kerusakan</h2>
        <p className="text-gray-500 text-sm mt-1">
          Menampilkan {validReports.length} titik lokasi laporan dari relawan di lapangan.
        </p>
      </div>

      <div className="flex-1 bg-white p-2 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <Map reports={validReports} />
      </div>

    </div>
  )
}