
export interface LectureInfo {
  location: string;
  dateTime: string;
  target: string;
  topic: string;
  reaction: string;
}

export interface GeneratedPost {
  platform: 'Instagram' | 'NaverBlog';
  content: string;
}

export interface GenerationResponse {
  instagram: string;
  naverBlog: string;
}
