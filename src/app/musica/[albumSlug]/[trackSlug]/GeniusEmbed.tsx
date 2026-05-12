"use client";

import { useEffect, useMemo, useState } from "react";

type GeniusEmbedProps = {
  songId: string;
  title: string;
  geniusUrl?: string;
};

const minEmbedHeight = 640;
const maxEmbedHeight = 6000;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function GeniusEmbed({
  songId,
  title,
  geniusUrl = "",
}: GeniusEmbedProps) {
  const [height, setHeight] = useState(minEmbedHeight);

  const srcDoc = useMemo(() => {
    const safeSongId = escapeHtml(songId);
    const safeTitle = escapeHtml(title);
    const safeUrl = escapeHtml(
      geniusUrl || `https://genius.com/songs/${songId}`,
    );

    return `<!doctype html>
<html>
  <head>
    <base target="_blank" />
    <meta charset="utf-8" />
    <style>
      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        color: #f9ebf4 !important;
        overflow: hidden !important;
      }

      .rg_embed_link {
        display: block;
        min-height: 64px;
        padding: 16px;
        box-sizing: border-box;
        background: #ffff64;
        color: #111;
        font-family: monospace;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
      }

      .rg_embed_link a {
        color: #111;
        text-decoration: none;
      }

      .rg_embed_analytics {
        display: none !important;
      }
    </style>
  </head>

  <body>
    <div
      id="rg_embed_link_${safeSongId}"
      class="rg_embed_link"
      data-song-id="${safeSongId}"
    >
      <a href="${safeUrl}" target="_blank" rel="noreferrer">
        Read “${safeTitle}” on Genius
      </a>
    </div>

    <script
      crossorigin="anonymous"
      src="https://genius.com/songs/${safeSongId}/embed.js"
    ></script>

    <style>
      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        color: #f9ebf4 !important;
        overflow: hidden !important;
      }

      .rg_embed {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        overflow: visible !important;
        background: transparent !important;
        color: #f9ebf4 !important;
        box-shadow: none !important;
      }

      .rg_embed_header {
        background: transparent !important;
        border-bottom: 1px solid rgba(241, 187, 223, 0.16) !important;
        padding: 16px 20px !important;
      }

      .rg_embed_logo {
        color: #f1bbdf !important;
        font-family: monospace !important;
        font-size: 10px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.22em !important;
      }

      .rg_embed_body {
        background: transparent !important;
        color: #f9ebf4 !important;
        padding: 28px 24px 40px !important;
        overflow: visible !important;
      }

      .rg_embed_body,
      .rg_embed_body p {
        font-family: Georgia, "Times New Roman", serif !important;
        font-size: 18px !important;
        line-height: 1.85 !important;
        color: rgba(249, 235, 244, 0.88) !important;
      }

      .rg_embed_body p {
        margin: 0 !important;
      }

      .rg_embed_footer {
        background: rgba(255, 255, 255, 0.035) !important;
        border-top: 1px solid rgba(241, 187, 223, 0.14) !important;
        padding: 18px 20px !important;
        color: rgba(249, 235, 244, 0.62) !important;
      }

      .rg_embed_footer a {
        color: rgba(249, 235, 244, 0.8) !important;
        text-decoration: none !important;
      }

      .rg_embed_footer .song_title {
        color: #f1bbdf !important;
        font-family: monospace !important;
        font-size: 12px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.14em !important;
      }

      iframe.rg_embed_analytics,
      .rg_embed_analytics,
      iframe[src*="embed_analytics"] {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        pointer-events: none !important;
      }

      @media (max-width: 640px) {
        .rg_embed_header {
          padding: 14px 16px !important;
        }

        .rg_embed_body {
          padding: 22px 18px 34px !important;
        }

        .rg_embed_body,
        .rg_embed_body p {
          font-size: 16px !important;
          line-height: 1.75 !important;
        }
      }
    </style>

    <script>
      function sendHeight() {
        var embed = document.querySelector(".rg_embed");

        var nextHeight = Math.max(
          embed ? embed.getBoundingClientRect().height : 0,
          ${minEmbedHeight}
        );

        window.parent.postMessage(
          {
            type: "genius-embed-height",
            songId: "${safeSongId}",
            height: Math.ceil(nextHeight)
          },
          "*"
        );
      }

      window.addEventListener("load", sendHeight);
      window.addEventListener("resize", sendHeight);

      var count = 0;
      var interval = window.setInterval(function () {
        sendHeight();
        count += 1;

        if (count > 24) {
          window.clearInterval(interval);
        }
      }, 500);
    </script>
  </body>
</html>`;
  }, [songId, title, geniusUrl]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.data?.type === "genius-embed-height" &&
        event.data?.songId === songId &&
        typeof event.data?.height === "number"
      ) {
        setHeight(
          Math.min(Math.max(event.data.height, minEmbedHeight), maxEmbedHeight),
        );
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [songId]);

  return (
    <iframe
      title={`Genius lyrics embed — ${title}`}
      srcDoc={srcDoc}
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      style={{
        width: "100%",
        height,
        border: 0,
        display: "block",
      }}
    />
  );
}
