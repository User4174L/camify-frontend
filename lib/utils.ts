import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function assetPath(path: string): string {
  if (!path) return path;
  if (path.startsWith(basePath)) return path;
  return `${basePath}${path}`;
}
