type NavItem = {
  label: string;
  href: string;
  requiresAuth?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "홈", href: "/" },
  { label: "단어장 공유", href: "/shared/lists" },
  { label: "학습 자료", href: "#" },
  { label: "단어 학습", href: "/word", requiresAuth: true },
];
