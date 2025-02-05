type NavItem = {
  label: string;
  href: string;
  requiresAuth?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "홈", href: "/" },
  { label: "학습 경로", href: "/learning-path" },
  { label: "학습 자료", href: "/resources" },
  { label: "내 프로필", href: "/profile", requiresAuth: true },
];
