// utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // PERBAIKAN: Tambahkan await di sini karena cookies() sekarang mengembalikan Promise
  const cookieStore = await cookies() 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try { 
            cookieStore.set({ name, value, ...options }) 
          } catch (error) {
            // Abaikan error saat Server Component mencoba set cookie
          }
        },
        remove(name: string, options: CookieOptions) {
          try { 
            cookieStore.set({ name, value: '', ...options }) 
          } catch (error) {
            // Abaikan error saat Server Component mencoba set cookie
          }
        },
      },
    }
  )
}