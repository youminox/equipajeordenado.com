export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  categories: { slug: string; name: string }[];
  date: string;
  modified: string;
  readTime: string;
  content: string;
  excerpt: string;
  featuredImageId: number | null;
  featuredImageUrl: string;
  type: "post" | "page";
  status: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parent: string;
  description: string;
  count: number;
}
