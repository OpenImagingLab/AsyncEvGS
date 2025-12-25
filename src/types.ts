export interface Author {
  name: string;
  affiliation?: string;
  url?: string;
  isEqualContribution?: boolean;
}

export interface Link {
  label: string;
  url: string;
  icon: 'pdf' | 'github' | 'youtube' | 'database';
}

export interface ComparisonItem {
  id: string;
  label: string;
  imageLeft: string;
  imageRight: string;
  description: string;
}

export interface MetricPoint {
  epoch: number;
  psnr: number;
  ssim: number;
  lpips: number;
}

export interface ProjectData {
  title: string;
  conference?: string;
  authors: Author[];
  abstract: string;
  links: Link[];
  heroVideoUrl: string; // Placeholder for video URL
  methodDescription: string;
  methodImageUrl: string;
  comparisons: ComparisonItem[];
  metrics: MetricPoint[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
