// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Search, Bell, Menu, X, User, ChevronDown } from "lucide-react";

// export default function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const pathname = usePathname();

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Khóa học", href: "/courses" },
    { name: "Đánh giá", href: "/assessment" },
    { name: "Tạo CV", href: "/cv-templates" },
    { name: "Mentor", href: "/mentors" },
    { name: "Việc làm", href: "/jobs" },
    { name: "Blog", href: "/blog" },
  ];

//   const isActivePath = (path: string) => {
//     if (path === "/") {
//       return pathname === "/";
//     }
//     return pathname.startsWith(path);
//   };

//   return (
//     <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 relative w-full border-b border-gray-200">
//       <div
//         className="container mx-auto px-4"
//         style={{
//           background:
//             "transparent url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='10' cy='10' r='0.5' fill='white' opacity='0.8'/><circle cx='30' cy='20' r='0.3' fill='white' opacity='0.6'/><circle cx='60' cy='15' r='0.4' fill='white' opacity='0.9'/><circle cx='80' cy='25' r='0.2' fill='white' opacity='0.7'/><circle cx='20' cy='40' r='0.3' fill='white' opacity='0.5'/><circle cx='50' cy='35' r='0.5' fill='white' opacity='0.8'/><circle cx='90' cy='45' r='0.3' fill='white' opacity='0.6'/><circle cx='15' cy='70' r='0.4' fill='white' opacity='0.7'/><circle cx='40' cy='65' r='0.2' fill='white' opacity='0.5'/><circle cx='70' cy='75' r='0.5' fill='white' opacity='0.9'/><circle cx='85' cy='80' r='0.3' fill='white' opacity='0.6'/></svg>\") repeat",
//           backgroundSize: "200px 200px",
//         }}
//       >
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center space-x-2">
//               <img
//                 src="/img/logo.png"
//                 alt="Carreermate logo"
//                 className="h-14 w-auto mr-3"
//               />
//               {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">C</span>
//               </div> */}
//               {/* <span className="text-xl font-bold text-gray-800">CareerMate</span> */}
//             </Link>
//           </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActivePath(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-[#f9f9f9] hover:text-blue-600 hover:bg-gray-50"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

//           {/* Right side actions */}
//           <div className="flex items-center space-x-4">
//             {/* Search - Hidden on small screens */}
//             <div className="hidden lg:block relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#f9f9f9]" />
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm..."
//                 className="pl-10 pr-4 py-2 w-64 border text-[#f9f9f9] border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* Notifications */}
//             <button className="relative p-2 text-[#f9f9f9] hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
//               <Bell className="w-5 h-5" />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-gray-500 rounded-full"></span>
//             </button>

//             {/* User Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                 className="flex items-center space-x-2 p-2 text-[#f9f9f9] hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
//               >
//                 <div className="w-8 h-8 hover:text-blue-600 bg-gray-300 rounded-full flex items-center justify-center">
//                   <User className="w-4 h-4" />
//                 </div>
//                 <span className="hidden md:block text-[#f9f9f9] text-sm font-medium">
//                   Nguyễn Văn A
//                 </span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {/* User Dropdown */}
//               {isUserMenuOpen && (
//                 <div className="absolute right-0.9 mt-0 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
//                   <Link
//                     href="/profile"
//                     className="block px-4 py-2 text-sm text-bg-gray-50 hover:bg-gray-50"
//                   >
//                     Profile
//                   </Link>
//                   <Link
//                     href="/settings"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     Setting
//                   </Link>
//                   <Link
//                     href="/billing"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     Payment
//                   </Link>
//                   <hr className="my-2" />
//                   <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Mobile menu button */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
//             >
//               {isMobileMenuOpen ? (
//                 <X className="w-5 h-5" />
//               ) : (
//                 <Menu className="w-5 h-5" />
//               )}
//             </button>
//           </div>
//         </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActivePath(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

//             {/* Mobile Search */}
//             <div className="mt-4 px-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Tìm kiếm..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Overlay for dropdowns */}
//       {(isUserMenuOpen || isMobileMenuOpen) && (
//         <div
//           className="fixed inset-0 z-30"
//           onClick={() => {
//             setIsUserMenuOpen(false);
//             setIsMobileMenuOpen(false);
//           }}
//         />
//       )}
//     </header>
//   );
// }
