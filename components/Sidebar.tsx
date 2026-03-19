// components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, History, LogOut } from 'lucide-react'
import { logout } from '@/app/actions'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Beranda', href: '/admin', icon: Home },
    { name: 'Kelola Peta', href: '/admin/map', icon: Map },
    { name: 'Kelola Laporan', href: '/admin/history', icon: History },
  ]

  return (
    <div className="flex h-screen w-68 flex-col bg-white border-r border-gray-200 shadow-sm fixed left-0 top-0">
      <div className="p-6 bg-sigapBlue">
        <h1 className="text-2xl font-bold text-white">Sigap AI</h1>
        <p className="text-sigapBlue-bg text-sm mt-1">AI Damage Assessment System</p>
      </div>
      
      <nav className="flex-1 space-y-2 p-4 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive 
                  ? 'bg-sigapBlue-bg text-sigapBlue shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-sigapBlue'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-sigapBlue' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={async () => await logout()} 
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Keluar
        </button>
      </div>
    </div>
  )
}