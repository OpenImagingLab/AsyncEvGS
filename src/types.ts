export interface Author {
  name: string;
  affiliations: number[];
  url?: string;
  isEqualContribution?: boolean;
  isCorresponding?: boolean;
}

export interface Link {
  label: string;
  url: string;
  icon: 'pdf' | 'github' | 'youtube' | 'database';
}

export interface ComparisonItem {
  id: string;
  label: string;
  category: 'Real-World' | 'Synthetic';
  scene: string;
  videoBaseline: string;
  videoOurs: string;
  description: string;
}

export interface MetricPoint {
  epoch: number;
  psnr: number;
  ssim: number;
  lpips: number;
}

export interface SceneMetrics {
  scene: string;
  methods: {
    [method: string]: {
      psnr: number;
      ssim: number;
      lpips: number;
    };
  };
  best: {
    psnr: string;
    ssim: string;
    lpips: string;
  };
}

export interface DatasetMetrics {
  name: string;
  caption: string;
  scenes: SceneMetrics[];
}

export interface ProjectData {
  title: string;
  conference?: string;
  authors: Author[];
  institutions: string[];
  contactEmails?: string[];
  abstract: string;
  links: Link[];
  heroVideoUrl: string; // Placeholder for video URL
  methodDescription: string;
  methodImageUrl: string;
  comparisons: ComparisonItem[];
  metrics: MetricPoint[];  quantitativeResults: DatasetMetrics[];}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
