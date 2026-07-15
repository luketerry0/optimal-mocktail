'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface NavLink {
  href: string
  label: string
  children?: { href: string; label: string }[]
}

const links: NavLink[] = [
  { href: '/', label: 'Home' },
  {
    href: '/posts',
    label: 'Recipes',
    children: [
      { href: '/posts?type=mocktails', label: 'Mocktails' },
      { href: '/posts?type=substitutes', label: 'Alcohol Substitutes' },
    ],
  },
  { href: '/featured', label: 'Featured Recipes' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-navy-700 bg-navy">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2"
          aria-label="Optimal Mocktail home"
        >
          <Image
            src="/logo.png"
            alt="Optimal Mocktail"
            width={44}
            height={44}
            priority
            className="h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11"
          />
          <span className="font-jersey text-2xl text-white sm:text-3xl">
            Optimal<span className="text-accent-light">Mocktail</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-base font-medium sm:flex">
          {links.map((link) =>
            link.children ? (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-white transition hover:text-accent-light"
                >
                  {link.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="mt-0.5 transition group-hover:rotate-180"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 min-w-52 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="menu-card overflow-hidden rounded-sm py-2">
                    <div className="relative z-10">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2 font-display text-navy transition hover:bg-accent hover:text-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-white transition hover:text-accent-light"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-navy-700 sm:hidden"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="border-t border-navy-700 bg-navy sm:hidden">
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-2">
            {links.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block rounded-lg px-2 py-3 text-base font-medium text-white transition hover:bg-navy-700 hover:text-accent-light"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-3 flex flex-col border-l border-navy-700 pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={close}
                        className="rounded-lg px-2 py-2 text-sm text-white/90 transition hover:bg-navy-700 hover:text-accent-light"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
