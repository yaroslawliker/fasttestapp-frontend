'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import style from '@/app/Navbar.module.css'

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return (
    <nav>
      <div className={style.navbar}>
        <div className='nav-item'>
        <Link href="/">
          Home
        </Link>
        </div>
        {/* <div className={style.navItem}> */}
        <Link href="/quizzes">
          Quizzes
        </Link>
        {/* </div> */}
        {/* <div className={style.navItem}> */}
        <Link href="/quizzes/create">
          Create
        </Link>
        {/* </div> */}
      </div>

      {/* <div className={style.navItem}> */}
        {token ? (
          <span>Welcome!</span>
        ) : (
          <Link href="/login">
            Login
          </Link>
        )}
      {/* </div> */}
    </nav>
  )
}
