import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams
  const errorMessage = searchParams.error

  const login = async (formData: FormData) => {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect('/login?error=Email atau password salah!')
    }

    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 fixed inset-0 z-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-sigapBlue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sigap AI</h1>
          <p className="text-sm text-gray-500 font-medium">Masuk ke Dashboard</p>
        </div>

        <form action={login} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="username@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sigapBlue focus:border-sigapBlue outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi</label>
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sigapBlue focus:border-sigapBlue outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl text-center border border-red-100">
              {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-sigapBlue text-white font-bold rounded-xl hover:bg-sigapBlue-dark transition-colors shadow-md shadow-sigapBlue/30"
          >
            Masuk ke Sistem
          </button>
        </form>

      </div>
    </div>
  )
}