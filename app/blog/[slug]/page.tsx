import { redirect } from "next/navigation";

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/notes/${params.slug}`);
}
