import Link from 'next/link';
import { NAVIGATION } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">IT</span>
              </div>
              <h3 className="text-xl font-bold text-white">IT Jobs For Ronaldo</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Nền tảng tuyển dụng IT hàng đầu Việt Nam, kết nối ứng viên tài năng với các công ty công nghệ hàng đầu.
            </p>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Liên hệ</h4>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Lầu 6, 123 Lê Lợi, Quận 1, TP.HCM
                </p>
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (84) 28 3925 3923
                </p>
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  contact@itjobs4ronaldo.com
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Dành cho ứng viên */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Dành cho ứng viên</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href={NAVIGATION.JOBS} className="hover:text-cyan-400 transition-colors">Tìm việc làm</Link></li>
              <li><Link href={NAVIGATION.COMPANIES} className="hover:text-cyan-400 transition-colors">Top công ty</Link></li>
              <li><Link href={NAVIGATION.CV} className="hover:text-cyan-400 transition-colors">Tạo CV</Link></li>
              <li><a href="/salary" className="hover:text-cyan-400 transition-colors">Tính lương Gross - Net</a></li>
              <li><a href="/guides" className="hover:text-cyan-400 transition-colors">Hướng dẫn viết CV</a></li>
              <li><a href="/blog" className="hover:text-cyan-400 transition-colors">Blog IT Jobs</a></li>
            </ul>
          </div>

          {/* Dành cho nhà tuyển dụng */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Dành cho nhà tuyển dụng</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/post-job" className="hover:text-cyan-400 transition-colors">Đăng tuyển dụng</a></li>
              <li><a href="/search-cv" className="hover:text-cyan-400 transition-colors">Tìm hồ sơ</a></li>
              <li><a href="/pricing" className="hover:text-cyan-400 transition-colors">Bảng giá dịch vụ</a></li>
              <li><a href="/employer-guide" className="hover:text-cyan-400 transition-colors">Hướng dẫn đăng tin</a></li>
              <li><a href="/employer-blog" className="hover:text-cyan-400 transition-colors">Blog HR</a></li>
            </ul>
          </div>

          {/* Công cụ hữu ích */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Công cụ hữu ích</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/salary-calculator" className="hover:text-cyan-400 transition-colors">Tính lương</a></li>
              <li><a href="/tax-calculator" className="hover:text-cyan-400 transition-colors">Tính thuế TNCN</a></li>
              <li><a href="/cv-templates" className="hover:text-cyan-400 transition-colors">Mẫu CV đẹp</a></li>
              <li><a href="/cover-letter" className="hover:text-cyan-400 transition-colors">Thư xin việc</a></li>
              <li><a href="/skill-test" className="hover:text-cyan-400 transition-colors">Test kỹ năng</a></li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-cyan-400">Theo dõi chúng tôi</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>📱 Mobile App</p>
                <p>📧 Newsletter</p>
                <p>🔔 Thông báo việc làm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3 text-cyan-400">Tìm việc theo kỹ năng</h4>
              <div className="flex flex-wrap gap-2">
                {['ReactJS', 'NodeJS', 'Java', 'Python', 'PHP', 'Angular', 'VueJS', 'JavaScript', 'TypeScript', 'C#', '.NET', 'Flutter'].map((skill) => (
                  <a key={skill} href={`/jobs?skill=${skill.toLowerCase()}`} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-cyan-400 px-2 py-1 rounded transition-colors">
                    {skill}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-cyan-400">Tìm việc theo thành phố</h4>
              <div className="flex flex-wrap gap-2">
                {['TP Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Huế', 'Remote'].map((city) => (
                  <a key={city} href={`/jobs?location=${city.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-cyan-400 px-2 py-1 rounded transition-colors">
                    {city}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; 2024 IT Jobs For Ronaldo. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Kết nối ứng viên IT với cơ hội việc làm tốt nhất
              </p>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-cyan-400 transition-colors">Chính sách bảo mật</a>
              <a href="/terms" className="hover:text-cyan-400 transition-colors">Điều khoản sử dụng</a>
              <a href="/help" className="hover:text-cyan-400 transition-colors">Trợ giúp</a>
              <a href="/contact" className="hover:text-cyan-400 transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}