import { BlogList } from "@/modules/client/blog/components/BlogList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CareerMate Blog - IT Jobs, IT Career, IT Expertise",
    description: "CareerMate Blog - Share knowledge about IT jobs, IT careers, IT expertise and interesting stories in the technology industry",
};

export default function BlogPage() {
    return <BlogList />;
}
