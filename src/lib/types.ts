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
  /** Optional <title> override (editorial rewrites). */
  seoTitle?: string;
  /** Optional meta description override (editorial rewrites). */
  description?: string;
  /** True when the post comes from data/editorial/ (rewritten or new). */
  editorial?: boolean;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parent: string;
  description: string;
  count: number;
}
