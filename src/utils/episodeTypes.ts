export interface EpisodeType {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  durationAsString: string;
  file: File
}

interface File {
  url: string;
  type: string;
  duration: number;
  durationAsString?: string;
}

export type HomeProps = {
  latestEpisodes: EpisodeType[];
  allEpisodes: EpisodeType[];
}