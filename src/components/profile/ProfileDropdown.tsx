"use client";

import { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { 
    User, 
    Settings, 
    Bell, 
    Sun, 
    Moon, 
    LogOut, 
    ChevronDown,
    CreditCard,
    HelpCircle
} from 'lucide-react';

interface ProfileDropdownProps {
    userName?: string;
    userAvatar?: string;
    userEmail?: string;
}

export function ProfileDropdown({ 
    userName = "Ronaldo", 
    userAvatar,
    userEmail
}: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log('Logout clicked');
        alert('Logout functionality to be implemented');
    };

    return (
        <div className="flex items-center gap-2">
            {/* Dark Mode Toggle Button */}
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                ) : (
                    <Moon className="w-5 h-5" />
                )}
            </button>

            {/* Notifications Button */}
            <button
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                    3
                </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
                {/* Trigger Button */}
                <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                    {/* Avatar */}
                    <div className="relative">
                        {userAvatar ? (
                            <img 
                                src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTPMg7sLIhRN7k0UrPxSsHzujqgLqdTq67Pj4uVqKmr4sFR0eH4h4h-sWjxVvi3vKOl47pyShZMal8qcNuipNE4fbSfblUL99EfUtDrBto"
                                alt={userName}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                        )}
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>

                    {/* User Name */}
                    <span className="font-medium text-sm hidden sm:block">{userName}</span>

                    {/* Dropdown Arrow */}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    {userAvatar ? (
                                        <img 
                                            src={userAvatar} 
                                            alt={userName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{userName}</p>
                                    <p className="text-sm text-gray-500">{userEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            {/* Profile */}
                            <Link 
                                href="/recruiter/recruiter-feature/profile/account"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                My Profile
                            </Link>

                            {/* Settings */}
                            <Link 
                                href="/recruiter/recruiter-feature/profile/settings"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </Link>

                            {/* Billing */}
                            <Link 
                                href="/recruiter/recruiter-feature/profile/billing"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <CreditCard className="w-4 h-4" />
                                Billing & Plans
                            </Link>

                            {/* Help */}
                            <Link 
                                href="/recruiter/recruiter-feature/support/help"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <HelpCircle className="w-4 h-4" />
                                Help Center
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-1"></div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}