import { Metadata } from "next";

export const META = {
  title: "Fluent Journey: 나만의 단어장을 만들고 공유할 수 있는 서비스",
  description:
    "개인 맞춤형 단어장을 만들어 영어 실력을 향상해보세요. 플래시카드로 학습하고, 다른 사용자들과 단어장을 공유할 수 있어요.",
  keyword: ["vocabulary builder", "English learning", "flashcards"],
  url: "https://fluent-journey.vercel.app",
  ogImage: "/card-image2.png",
} as const;

type generateMetadataProps = {
  title?: string;
  description?: string;
  asPath?: string;
  ogImage?: string;
};

export const getMetadata = (metadataProps?: generateMetadataProps) => {
  const { title, description, asPath, ogImage } = metadataProps || {};

  const TITLE = title ? `${title} | ${META.title}` : META.title;
  const DESCRIPTION = description || META.description;
  const PAGE_URL = asPath && asPath.trim() !== "" ? asPath : META.url;
  const OG_IMAGE = ogImage || META.ogImage;

  const metadata: Metadata = {
    metadataBase: new URL(META.url), // URL 객체 타입 필요
    alternates: {
      canonical: PAGE_URL,
    },
    title: TITLE,
    description: DESCRIPTION,
    keywords: [...META.keyword],
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      siteName: TITLE,
      locale: "ko_KR",
      type: "website",
      url: PAGE_URL,
      images: {
        url: OG_IMAGE,
      },
    },
    twitter: {
      title: TITLE,
      description: DESCRIPTION,
      images: {
        url: OG_IMAGE,
      },
    },
  };

  return metadata;
};
