declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const metadata: {
    slug: string;
    title: string;
    excerpt: string;
    chapter: number;
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}