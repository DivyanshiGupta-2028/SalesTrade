export interface Blog {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  featuredImage?: string;
  authorId: number;
  categoryId: number;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
  allowComments?: boolean;
  publishDate?: string;
}