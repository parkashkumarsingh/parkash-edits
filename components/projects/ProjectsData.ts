export type ProjectType = "video" | "graphic";

export type VideoCategory =
  | "Social Media Reels & Shorts"
  | "YouTube Videos & Long Form"
  | "Commercials & Brand Ads"
  | "Motion Graphics & Title Animations";

export type GraphicCategory =
  | "Social Media Posts & Banners"
  | "Brand Identity & Logos"
  | "YouTube Thumbnails"
  | "Other Creative Artwork";

export type ProjectCategory = VideoCategory | GraphicCategory;

export interface Project {
  id: string;
  type: ProjectType;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  role: string;
  duration?: string;
  dimensions?: string;
  aspectRatio: string;
  videoUrl?: string;
  mediaUrl: string;
  poster: string;
  modelUrl?: string;
  description: string;
  challenge: string;
  solution: string;
  techSpecs: {
    camera?: string;
    pipeline: string;
    software: string[];
    gradeLut?: string;
    deliverables: string[];
    resolution?: string;
    colorSpace?: string;
  };
  awards?: string[];
  tags: string[];
  featured?: boolean;
  mockupType?: "print" | "apparel" | "packaging" | "sticker" | "billboard" | "pedestal";
  uploadedAt?: string;
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  "Social Media Reels & Shorts",
  "YouTube Videos & Long Form",
  "Commercials & Brand Ads",
  "Motion Graphics & Title Animations",
];

export const GRAPHIC_CATEGORIES: GraphicCategory[] = [
  "Social Media Posts & Banners",
  "Brand Identity & Logos",
  "YouTube Thumbnails",
  "Other Creative Artwork",
];

import initialProjects from "@/data/projects.json";

export const INITIAL_PROJECTS: Project[] = initialProjects as Project[];

// Fallback constant for backwards compatibility
export const PROJECTS = INITIAL_PROJECTS;
