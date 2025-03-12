import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>
  | ReturnType<typeof getProfileTag>;

export const CACHE_TAGS = {
  wordlists: "wordlists",
  sharedWordlists: "sharedWordlists",
  userWords: "userWords",
  comments: "comments",
  bookmarks: "bookmarks",
  likes: "likes",
  profile: {
    wordlists: "wordlists",
    sharedWordlists: "sharedWordlists",
    bookmarks: "bookmarks",
    likes: "likes",
  },
} as const;

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const;
}

export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}

export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

export function getProfileTag(
  userId: string,
  tag: keyof typeof CACHE_TAGS.profile
) {
  return `user:${userId}-${CACHE_TAGS.profile[tag]}`;
}

export function clearFullCache() {
  revalidateTag("*");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidTags[] }
) {
  return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, "*"] }));
}

export function revalidateDbCache({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS;
  userId?: string;
  id?: string;
}) {
  revalidateTag(getGlobalTag(tag));
  if (userId) {
    revalidateTag(getUserTag(userId, tag));
  }
  if (id) {
    revalidateTag(getIdTag(id, tag));
  }
}
