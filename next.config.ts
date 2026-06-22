import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Turbopack requires MDX plugin options to be serializable, so plugins are
// referenced by package name (strings) rather than imported function instances.
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm"]],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: "github-dark-default",
          keepBackground: false,
          defaultLang: "tsx",
        },
      ],
    ],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
