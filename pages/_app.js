import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function AuthWrapper({ children }) {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Skip auth check for login page
    if (router.pathname === '/login') {
      setAuthChecked(true)
      return
    }

    const session = JSON.parse(localStorage.getItem('fake-auth'))
    if (!session) {
      router.push('/login')
    } else {
      setAuthChecked(true)
    }
  }, [router])

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return children
}

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>
  )
}