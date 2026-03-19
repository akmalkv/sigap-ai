// app/public-history/page.tsx
import { createClient } from '@/utils/supabase/server'
import PublicHistoryClient from './PublicHistoryClient'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export default async function PublicHistoryPage() {
  const supabase = await createClient()
  const { data: reports } = await supabase.from('damage_reports').select('*').order('timestamp', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm mb-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sigapBlue rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Data Laporan Terbuka</h1>
              <p className="text-xs text-gray-500">Transparansi Data Sigap AI</p>
            </div>
          </div>
          <Link href="/" className="flex items-center text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Beranda
          </Link>
        </div>
      </div>

      <div className="flex-1 px-4 pb-10">
        <PublicHistoryClient initialReports={reports || []} />
      </div>
    </div>
  )
}