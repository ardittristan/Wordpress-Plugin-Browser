export interface ApiResponse {
  info: {
    page: number;
    pages: number;
    results: number;
  };
  plugins: WordpressPlugin[];
}

export interface WordpressPlugin {
  active_installs: number;
  added: string;
  author: string;
  author_profile: string;
  description: string;
  donate_link: string;
  download_link: string;
  downloaded: number;
  homepage: string;
  icons: {
    "1x": string;
    "2x"?: string;
    svg?: string;
  };
  last_updated: string;
  name: string;
  num_ratings: number;
  rating: number;
  ratings: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  requires: number;
  requires_php: number;
  short_description: string;
  slug: string;
  support_threads: number;
  support_threads_resolved: number;
  tags: Object;
  tested: string;
  version: string;
}
