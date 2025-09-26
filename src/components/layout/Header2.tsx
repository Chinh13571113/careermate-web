'use client';

import Link from 'next/link';
import { NAVIGATION } from '@/lib/constants';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 relative w-full border-b border-gray-200">
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'transparent url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'10\' cy=\'10\' r=\'0.5\' fill=\'white\' opacity=\'0.8\'/><circle cx=\'30\' cy=\'20\' r=\'0.3\' fill=\'white\' opacity=\'0.6\'/><circle cx=\'60\' cy=\'15\' r=\'0.4\' fill=\'white\' opacity=\'0.9\'/><circle cx=\'80\' cy=\'25\' r=\'0.2\' fill=\'white\' opacity=\'0.7\'/><circle cx=\'20\' cy=\'40\' r=\'0.3\' fill=\'white\' opacity=\'0.5\'/><circle cx=\'50\' cy=\'35\' r=\'0.5\' fill=\'white\' opacity=\'0.8\'/><circle cx=\'90\' cy=\'45\' r=\'0.3\' fill=\'white\' opacity=\'0.6\'/><circle cx=\'15\' cy=\'70\' r=\'0.4\' fill=\'white\' opacity=\'0.7\'/><circle cx=\'40\' cy=\'65\' r=\'0.2\' fill=\'white\' opacity=\'0.5\'/><circle cx=\'70\' cy=\'75\' r=\'0.5\' fill=\'white\' opacity=\'0.9\'/><circle cx=\'85\' cy=\'80\' r=\'0.3\' fill=\'white\' opacity=\'0.6\'/></svg>") repeat',
            backgroundSize: '200px 200px'
          }}
        ></div>
        <div 
          className="absolute inset-0 w-full h-full animate-pulse"
          style={{
            background: 'transparent url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'25\' cy=\'25\' r=\'0.2\' fill=\'white\' opacity=\'0.8\'/><circle cx=\'75\' cy=\'50\' r=\'0.3\' fill=\'white\' opacity=\'0.6\'/><circle cx=\'50\' cy=\'75\' r=\'0.2\' fill=\'white\' opacity=\'0.9\'/></svg>") repeat',
            backgroundSize: '300px 300px'
          }}
        ></div>
      </div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href={NAVIGATION.HOME} className="flex items-center">
                <img 
                  src="/img/logo.png" 
                  alt="Carreermate logo" 
                  className="h-14 w-auto mr-3"
                />
                {/* <span className="text-xl font-bold text-white">IT Jobs</span> */}
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/about"
                className="text-white hover:text-cyan-300 px-3 py-2 text-sm font-medium transition-colors"
              >
                About us
              </Link>
              <Link
                href={NAVIGATION.COMPANIES}
                className="text-white hover:text-cyan-300 px-3 py-2 text-sm font-medium transition-colors"
              >
                Top IT Companies
              </Link>
              <Link
                href="/blog"
                className="text-white hover:text-cyan-300 px-3 py-2 text-sm font-medium transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/auth/careerguid"
                className="text-white hover:text-cyan-300 px-3 py-2 text-sm font-medium transition-colors"
              >
                Career Guidance
              </Link>
              <Link
                href={NAVIGATION.CV}
                className="text-white hover:text-cyan-300 px-3 py-2 text-sm font-medium transition-colors"
              >
                CV Template
              </Link>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Recruiter</span>
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className="relative">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5l5-5v5H9.5a3.5 3.5 0 100 7H15z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </header>
  );
}