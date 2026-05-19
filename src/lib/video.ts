export type VideoInfo = {
  embedUrl: string;
  thumbnailUrl: string | null;
  type: "youtube" | "vimeo";
};

export function parseVideoUrl(url: string): VideoInfo | null {
  if (!url) return null;

  // YouTube — handles watch, youtu.be, embed, shorts
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (yt) {
    return {
      embedUrl: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`,
      type: "youtube",
    };
  }

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}?byline=0&portrait=0&title=0`,
      thumbnailUrl: null,
      type: "vimeo",
    };
  }

  return null;
}
