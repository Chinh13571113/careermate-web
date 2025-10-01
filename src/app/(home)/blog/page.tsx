import { BlogList } from "@/modules/client/blog/components/BlogList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ITviec Blog - Việc làm IT, Sự nghiệp IT, Chuyên môn IT",
    description: "Blog ITviec - Chia sẻ kiến thức về việc làm IT, sự nghiệp IT, chuyên môn IT và các câu chuyện thú vị trong ngành công nghệ",
};

export default function BlogPage() {
    return <BlogList />;
}
