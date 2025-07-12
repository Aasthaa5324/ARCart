import '@/styles/globals.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function AuthCheck({ children }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (isClient && !localStorage.getItem('token')) {
      router.push('/login')
    }
  }, [isClient])

  if (!isClient) return null // Don't run auth check on server

  return children
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Furniture AR Viewer</title>
      </Head>
      {Component.noAuth ? (
        <Component {...pageProps} />
      ) : (
        <AuthCheck>
          <Component {...pageProps} />
        </AuthCheck>
      )}
    </>
  )
}