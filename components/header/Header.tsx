import Link from 'next/link'
import React from 'react'
import { SearchBox } from './SearchBox'
import Menu from './Menu'

const Header = () => {
  return (
    <header>
        <nav>
            <div className="navbar justify-between bg-base-300">
                <div>
                    <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w- h- stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </label>
                    <Link href="/" className="btn btn-ghost text-lg">
                        Toriapp
                    </Link>
                </div>

                <Menu />
            </div>
            <div className="bg-base-300 block md:hidden text-center pb-3">
                <SearchBox />
            </div>
        </nav>
    </header>
  )  
}

export default Header