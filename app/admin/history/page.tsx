import { createClient } from '@/utils/supabase/server'
import HistoryClient from './HistoryClient'

export default async function HistoryPage() {
  const supabase = await createClient()

  const { data: reports } = await supabase
    .from('damage_reports')
    .select('*')
    .order('timestamp', { ascending: false })

  return (
    <div className="min-h-full pb-8">
      <HistoryClient initialReports={reports || []} />
    </div>
  )
}