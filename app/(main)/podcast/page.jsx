import PodcastClient from "./PodcastClient";

const RSS_URL = "https://anchor.fm/s/128a41cc/podcast/rss"; // 🔴 replace this

// --- Parse RSS ---
async function getEpisodes() {
  try {
    const res = await fetch(RSS_URL, {
      cache: "no-store",
    });

    const xmlText = await res.text();

    const items = xmlText.split("<item>").slice(1);

    return items.map((item, index) => {
      const getTag = (tag) => {
        const match = item.match(new RegExp(`<${tag}>(.*?)</${tag}>`, "s"));
        return match ? match[1] : "";
      };

      const getAttr = (tag, attr) => {
        const match = item.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"`));
        return match ? match[1] : "";
      };

      const title = getTag("title");
      const description = getTag("description")?.replace(/<[^>]+>/g, "");
      const pubDate = getTag("pubDate");
      const guid = getTag("guid");
      const audio = getAttr("enclosure", "url");
      const image =
        getAttr("itunes:image", "href") ||
        "https://images.unsplash.com/photo-1478737270239-2f02b77ac618";

      const id = guid || audio || `ep-${index}`;

      return {
        id,
        title,
        description,
        date: pubDate,
        audio,
        image,
      };
    });
  } catch (err) {
    console.error("RSS parse error:", err);
    return [];
  }
}

// --- Get single episode ---
async function getEpisode(epId) {
  const episodes = await getEpisodes();
  return episodes.find((ep) => String(ep.id) === String(epId));
}

// --- SEO METADATA ---
export async function generateMetadata({ searchParams }) {
  const epId = searchParams?.ep;

  if (!epId) {
    return {
      title: "Podcast | Life Reach Church",
      description: "Listen to powerful sermons and teachings from Life Reach Church.",
    };
  }

  const episode = await getEpisode(epId);

  if (!episode) {
    return {
      title: "Podcast Episode | Life Reach Church",
    };
  }

  const url = `https://lifereachchurch.org/podcast?ep=${encodeURIComponent(epId)}`;

  return {
    title: `${episode.title} | Life Reach Podcast`,
    description: episode.description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: episode.title,
      description: episode.description,
      url,
      siteName: "Life Reach Church",
      images: [
        {
          url: episode.image,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description: episode.description,
      images: [episode.image],
    },
  };
}

// --- STRUCTURED DATA ---
function PodcastSchema({ episode }) {
  if (!episode) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.description,
    datePublished: episode.date,
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: episode.audio,
    },
    image: episode.image,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- PAGE ---
export default async function Page({ searchParams }) {
  const epId = searchParams?.ep;
  const episode = epId ? await getEpisode(epId) : null;

  return (
    <>
      <PodcastSchema episode={episode} />
      <PodcastClient />
    </>
  );
}