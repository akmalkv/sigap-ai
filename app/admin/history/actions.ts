// app/admin/history/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteReport(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('damage_reports') 
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Gagal menghapus:', error)
    return { success: false }
  }

  revalidatePath('/admin/history')
  redirect('/admin/history')
}

export async function verifyReport(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('damage_reports') 
    .update({ status: 'VERIFIED' })
    .eq('id', id)

  if (error) {
    console.error('Gagal verifikasi:', error)
    return { success: false }
  }

  revalidatePath(`/admin/history/${id}`)
  revalidatePath('/admin/history')
  revalidatePath('/admin')
  return { success: true }
}