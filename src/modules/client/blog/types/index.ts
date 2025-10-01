export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    readTime: number;
    publishedAt: string;
    featured?: boolean;
    image: string;
}

export interface VideoContent {
    id: string;
    title: string;
    thumbnail: string;
    duration?: string;
    views?: number;
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
}

export const blogCategories: BlogCategory[] = [
    { id: '1', name: 'Việc Làm IT', slug: 'viec-lam-it' },
    { id: '2', name: 'Sự Nghiệp IT', slug: 'su-nghiep-it' },
    { id: '3', name: 'Ứng Tuyển & Thăng Tiến', slug: 'ung-tuyen-thang-tien' },
    { id: '4', name: 'Chuyên Môn IT', slug: 'chuyen-mon-it' },
    { id: '5', name: 'Chuyện IT', slug: 'chuyen-it' },
];

export const mockBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'DevSecOps workflow ra đời giúp giải quyết bài toán cân bằng giữa tốc độ phát triển phần mềm và yêu cầu bảo mật ngày càng cao. Bài viết này sẽ hướng dẫn 7 bước "xương sống" của một quy trình...',
        excerpt: 'DevSecOps workflow ra đời giúp giải quyết bài toán cân bằng giữa tốc độ phát triển phần mềm và yêu cầu bảo mật ngày càng cao.',
        content: 'Full content here...',
        category: 'Chuyên Môn IT',
        tags: ['DevSecOps', 'Security', 'Development'],
        readTime: 26,
        publishedAt: '2024-01-15',
        featured: true,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '2',
        title: 'DevSecOps đóng vai trò quan trọng trong bối cảnh an ninh mạng ngày càng phức tạp và các chu kỳ phát triển phần mềm được rút ngắn. Nếu bạn yêu thích và muốn có sự nghiệp thành công trong lĩnh...',
        excerpt: 'DevSecOps đóng vai trò quan trọng trong bối cảnh an ninh mạng ngày càng phức tạp và các chu kỳ phát triển phần mềm được rút ngắn.',
        content: 'Full content here...',
        category: 'Sự Nghiệp IT',
        tags: ['DevSecOps', 'Career', 'Security'],
        readTime: 34,
        publishedAt: '2024-01-12',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '3',
        title: 'Cách xây dựng portfolio IT ấn tượng để thu hút nhà tuyển dụng',
        excerpt: 'Portfolio là một trong những yếu tố quan trọng nhất giúp bạn nổi bật trong mắt nhà tuyển dụng IT.',
        content: 'Full content here...',
        category: 'Ứng Tuyển & Thăng Tiến',
        tags: ['Portfolio', 'Career', 'Job Search'],
        readTime: 15,
        publishedAt: '2024-01-10',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '4',
        title: 'Top 10 kỹ năng lập trình được săn đón nhất năm 2024',
        excerpt: 'Thị trường IT luôn thay đổi và các kỹ năng lập trình cũng không ngoại lệ. Đây là những kỹ năng hot nhất hiện tại.',
        content: 'Full content here...',
        category: 'Chuyên Môn IT',
        tags: ['Programming', 'Skills', 'Technology'],
        readTime: 20,
        publishedAt: '2024-01-08',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '5',
        title: 'Câu chuyện thành công: Từ sinh viên IT đến Tech Lead tại startup',
        excerpt: 'Chia sẻ hành trình từ một sinh viên IT bình thường đến vị trí Tech Lead tại một startup thành công.',
        content: 'Full content here...',
        category: 'Chuyện IT',
        tags: ['Success Story', 'Career Path', 'Startup'],
        readTime: 18,
        publishedAt: '2024-01-05',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '6',
        title: 'Cách chuẩn bị CV IT chuyên nghiệp để gây ấn tượng với nhà tuyển dụng',
        excerpt: 'CV là bước đầu tiên quan trọng trong quá trình ứng tuyển. Hãy học cách tạo một CV IT chuyên nghiệp.',
        content: 'Full content here...',
        category: 'Ứng Tuyển & Thăng Tiến',
        tags: ['CV', 'Resume', 'Job Application'],
        readTime: 12,
        publishedAt: '2024-01-03',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '7',
        title: 'Kỹ năng mềm quan trọng cho developer: Giao tiếp và teamwork',
        excerpt: 'Kỹ năng mềm không kém phần quan trọng so với kỹ năng kỹ thuật trong sự nghiệp IT.',
        content: 'Full content here...',
        category: 'Sự Nghiệp IT',
        tags: ['Soft Skills', 'Communication', 'Teamwork'],
        readTime: 14,
        publishedAt: '2024-01-01',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '8',
        title: 'Xu hướng công nghệ 2024: AI, Blockchain và Cloud Computing',
        excerpt: 'Khám phá những xu hướng công nghệ hot nhất năm 2024 mà mọi IT professional nên biết.',
        content: 'Full content here...',
        category: 'Chuyên Môn IT',
        tags: ['Technology Trends', 'AI', 'Blockchain'],
        readTime: 22,
        publishedAt: '2023-12-28',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '9',
        title: 'Làm việc remote: Tips để thành công trong môi trường làm việc từ xa',
        excerpt: 'Remote work đang trở thành xu hướng. Hãy học cách làm việc hiệu quả từ xa.',
        content: 'Full content here...',
        category: 'Sự Nghiệp IT',
        tags: ['Remote Work', 'Productivity', 'Work Life'],
        readTime: 16,
        publishedAt: '2023-12-25',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '10',
        title: 'Code Review: Best practices để review code hiệu quả',
        excerpt: 'Code review là một phần quan trọng trong quy trình phát triển phần mềm. Học cách review code tốt.',
        content: 'Full content here...',
        category: 'Chuyên Môn IT',
        tags: ['Code Review', 'Best Practices', 'Development'],
        readTime: 18,
        publishedAt: '2023-12-22',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '11',
        title: 'Chuyển đổi nghề nghiệp sang IT: Hành trình từ zero đến hero',
        excerpt: 'Câu chuyện của những người đã thành công chuyển đổi sang nghề IT từ các ngành khác.',
        content: 'Full content here...',
        category: 'Chuyện IT',
        tags: ['Career Change', 'Success Story', 'Motivation'],
        readTime: 20,
        publishedAt: '2023-12-20',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '12',
        title: 'Testing trong phát triển phần mềm: Unit test, Integration test và E2E test',
        excerpt: 'Testing là một phần không thể thiếu trong phát triển phần mềm. Tìm hiểu các loại test khác nhau.',
        content: 'Full content here...',
        category: 'Chuyên Môn IT',
        tags: ['Testing', 'Quality Assurance', 'Development'],
        readTime: 24,
        publishedAt: '2023-12-18',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    }
];

export const mockVideos: VideoContent[] = [
    {
        id: '1',
        title: 'HireMate Talks! | CODE YOUR LIFE',
        thumbnail: '/images/videos/video1.jpg',
        duration: '15:30',
        views: 12500
    },
    {
        id: '2',
        title: 'HireMate Talks! | FIND YOUR TEAM',
        thumbnail: '/images/videos/video2.jpg',
        duration: '12:45',
        views: 8900
    },
    {
        id: '3',
        title: 'HireMate Talks! | TECH INTERVIEWS',
        thumbnail: '/images/videos/video1.jpg',
        duration: '18:20',
        views: 15600
    },
    {
        id: '4',
        title: 'HireMate Talks! | SALARY NEGOTIATION',
        thumbnail: '/images/videos/video2.jpg',
        duration: '14:15',
        views: 11200
    },
    {
        id: '5',
        title: 'HireMate Talks! | REMOTE WORK',
        thumbnail: '/images/videos/video1.jpg',
        duration: '16:40',
        views: 9800
    },
    {
        id: '6',
        title: 'HireMate Talks! | CAREER GROWTH',
        thumbnail: '/images/videos/video2.jpg',
        duration: '13:25',
        views: 13400
    },
    {
        id: '7',
        title: 'HireMate Talks! | STARTUP LIFE',
        thumbnail: '/images/videos/video1.jpg',
        duration: '17:50',
        views: 8700
    },
    {
        id: '8',
        title: 'HireMate Talks! | TECH TRENDS',
        thumbnail: '/images/videos/video2.jpg',
        duration: '15:10',
        views: 15200
    },
    {
        id: '9',
        title: 'HireMate Talks! | SOFT SKILLS',
        thumbnail: '/images/videos/video1.jpg',
        duration: '12:30',
        views: 10900
    },
    {
        id: '10',
        title: 'HireMate Talks! | LEADERSHIP',
        thumbnail: '/images/videos/video2.jpg',
        duration: '19:45',
        views: 12800
    },
    {
        id: '11',
        title: 'HireMate Talks! | NETWORKING',
        thumbnail: '/images/videos/video1.jpg',
        duration: '14:20',
        views: 9600
    },
    {
        id: '12',
        title: 'HireMate Talks! | WORK-LIFE BALANCE',
        thumbnail: '/images/videos/video2.jpg',
        duration: '16:15',
        views: 11800
    }
];
