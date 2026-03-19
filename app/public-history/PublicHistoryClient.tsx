'use client'

import { useState } from 'react'
import { Search, MapPin, Calendar, CheckCircle2 } from 'lucide-react'

interface Report {
  id: string; timestamp: number | string; damageClass?: string; damage_class?: string; address: string; confidence: number;
}

export default function PublicHistoryClient({ initialReports }: { initialReports: Report[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('SEMUA')

  const formatDate = (timestamp: number | string) => {
    return new Date(Number(timestamp)).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).replace('.', ':');
  }

  const filteredReports = initialReports.filter((report) => {
    const damageClass = report.damageClass || report.damage_class || 'RUSAK_RINGAN';
    const matchFilter = filter === 'SEMUA' ? true : filter === 'BERAT' ? damageClass === 'RUSAK_BERAT' : filter === 'SEDANG' ? damageClass === 'RUSAK_SEDANG' : damageClass === 'RUSAK_RINGAN';
    const matchSearch = report.address?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari lokasi kejadian..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-sigapBlue outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {['SEMUA', 'BERAT', 'SEDANG', 'RINGAN'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-semibold ${filter === f ? 'bg-sigapBlue text-white' : 'bg-gray-100 text-gray-600'}`}>
              {f === 'SEMUA' ? 'Semua' : `Rusak ${f.charAt(0) + f.slice(1).toLowerCase()}`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.length > 0 ? filteredReports.map((report) => {
          const damageClass = report.damageClass || report.damage_class || 'RUSAK_RINGAN';
          let colorTheme = { border: 'border-l-damage-ringan', text: 'text-damage-ringan', bg: 'bg-damage-ringanBg', label: 'Rusak Ringan' };
          if (damageClass === 'RUSAK_BERAT') colorTheme = { border: 'border-l-damage-berat', text: 'text-damage-berat', bg: 'bg-damage-beratBg', label: 'Rusak Berat' };
          else if (damageClass === 'RUSAK_SEDANG') colorTheme = { border: 'border-l-damage-sedang', text: 'text-damage-sedang', bg: 'bg-damage-sedangBg', label: 'Rusak Sedang' };

          return (
            <div key={report.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-8 ${colorTheme.border} flex justify-between items-center`}>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-gray-900">{colorTheme.label}</h3>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${colorTheme.bg} ${colorTheme.text}`}>
                    AI Verified
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                  {report.address || 'Lokasi tidak tersedia'}
                </div>
                <div className="flex items-center text-xs text-gray-400 font-medium space-x-4 pt-1">
                  <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{formatDate(report.timestamp)}</div>
                  <div className="flex items-center text-damage-ringan"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Tersync Pusat</div>
                </div>
              </div>
            </div>
          )
        }) : (
          <p className="text-center text-gray-500 py-10 bg-white rounded-3xl border border-dashed">Tidak ada data.</p>
        )}
      </div>
    </div>
  )
}