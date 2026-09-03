"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";

const DESKTOP_WIDTH = 1440;

export default function WebsitePreviewFrame({
  url,
  title,
  label,
  desktopHeight = 960,
  className = "",
  chromeClassName = "",
  viewportClassName = "",
  action,
  canEmbed = true,
}) {
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateScale = () => {
      const width = viewport.clientWidth || DESKTOP_WIDTH;
      setScale(Math.min(width / DESKTOP_WIDTH, 1));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const chromeAction = action || (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-8 w-8 place-items-center rounded-md text-white/48 transition hover:bg-white/10 hover:text-white"
      aria-label={`Open ${title}`}
    >
      <Maximize2 size={15} />
    </a>
  );

  return (
    <div className={`w-full max-w-full overflow-hidden rounded-[1.35rem] border bg-[#0d1214] shadow-[0_35px_100px_rgba(0,0,0,0.18)] ${className}`}>
      <div className={`flex h-12 items-center justify-between border-b border-white/10 bg-[#151b1e] px-4 ${chromeClassName}`}>
        <div className="flex shrink-0 gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="mx-3 min-w-0 max-w-[62%] truncate rounded-md border border-white/10 bg-black/30 px-4 py-1 text-center text-[10px] font-bold text-white/48">
          {label || url}
        </div>
        <div className="shrink-0">{chromeAction}</div>
      </div>

      <div ref={viewportRef} className={`relative overflow-hidden bg-white ${viewportClassName}`} style={{ height: Math.round(desktopHeight * scale) || desktopHeight }}>
        {canEmbed ? (
          <iframe
            src={url}
            title={title}
            loading="lazy"
            allowFullScreen
            className="absolute left-0 top-0 border-0"
            style={{
              width: DESKTOP_WIDTH,
              height: desktopHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        ) : (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center bg-[#f4efe4] p-8 text-center text-[#2f3438]">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/38">Preview unavailable</p>
            <h3 className="mt-4 max-w-md text-3xl font-black tracking-tight">{title}</h3>
            <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-black/56">
              This live site blocks embedded previews, so open it in a new tab.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#ad5b2b] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#8d4822]"
            >
              Open site <Maximize2 size={15} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
