'use client'

import { useState } from 'react'
import { Search, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Report {
  id: string;
  timestamp: number | string;
  damageClass?: string;
  damage_class?: string;
  address: string;
  confidence: number;
}

export default function HistoryClient({ initialReports }: { initialReports: Report[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('SEMUA')

  const formatDate = (timestamp: number | string) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).replace('.', ':');
  }

  const filteredReports = initialReports.filter((report) => {
    const damageClass = report.damageClass || report.damage_class || 'RUSAK_RINGAN';
    
    const matchFilter = 
      filter === 'SEMUA' ? true :
      filter === 'BERAT' ? damageClass === 'RUSAK_BERAT' :
      filter === 'SEDANG' ? damageClass === 'RUSAK_SEDANG' :
      damageClass === 'RUSAK_RINGAN';

    const matchSearch = report.address?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchFilter && matchSearch;
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Riwayat Laporan Lapangan</h2>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama jalan atau desa..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-sigapBlue focus:border-sigapBlue outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button 
            onClick={() => setFilter('SEMUA')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'SEMUA' ? 'bg-sigapBlue text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Semua
          </button>
          <button 
            onClick={() => setFilter('BERAT')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'BERAT' ? 'bg-damage-berat text-white shadow-md' : 'bg-damage-beratBg text-damage-berat hover:bg-red-200'}`}
          >
            Rusak Berat
          </button>
          <button 
            onClick={() => setFilter('SEDANG')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'SEDANG' ? 'bg-damage-sedang text-white shadow-md' : 'bg-damage-sedangBg text-damage-sedang hover:bg-orange-200'}`}
          >
            Rusak Sedang
          </button>
          <button 
            onClick={() => setFilter('RINGAN')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'RINGAN' ? 'bg-damage-ringan text-white shadow-md' : 'bg-damage-ringanBg text-damage-ringan hover:bg-green-200'}`}
          >
            Rusak Ringan
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const damageClass = report.damageClass || report.damage_class || 'RUSAK_RINGAN';
            const confPercent = Math.round((report.confidence || 0) * 100);
            
            let colorTheme = { border: '', text: '', bg: '', label: '' };
            if (damageClass === 'RUSAK_BERAT') colorTheme = { border: 'border-l-damage-berat', text: 'text-damage-berat', bg: 'bg-damage-beratBg', label: 'Rusak Berat' };
            else if (damageClass === 'RUSAK_SEDANG') colorTheme = { border: 'border-l-damage-sedang', text: 'text-damage-sedang', bg: 'bg-damage-sedangBg', label: 'Rusak Sedang' };
            else colorTheme = { border: 'border-l-damage-ringan', text: 'text-damage-ringan', bg: 'bg-damage-ringanBg', label: 'Rusak Ringan' };

            return (
              <div key={report.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-8 ${colorTheme.border} hover:shadow-md transition-all flex justify-between items-center`}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-gray-900">{colorTheme.label}</h3>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${colorTheme.bg} ${colorTheme.text}`}>
                      {confPercent}% AI
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    {report.address || 'Lokasi tidak tersedia'}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 font-medium space-x-4 pt-1">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {formatDate(report.timestamp)}
                    </div>
                    <div className="flex items-center text-damage-ringan">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Tersync
                    </div>
                  </div>
                </div>
                
                <Link href={`/admin/history/${report.id}`} className="px-4 py-2 bg-gray-50 text-sigapBlue text-sm font-semibold rounded-xl border border-gray-200 hover:bg-sigapBlue-bg transition-colors">
                  Detail
                </Link>
              </div>
            )
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">Tidak ada laporan yang sesuai dengan pencarian/filter.</p>
          </div>
        )}
      </div>

    </div>
  )
}