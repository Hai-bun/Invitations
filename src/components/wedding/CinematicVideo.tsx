import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Language, t } from "@/lib/i18n";

/** A media URL is treated as video only when it ends in a known video extension. */
const isVideoSource = (url: string): boolean =>
  /\.(mp4|webm|ogg|ogv|mov)(\?|#|$)/i.test(url);

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

interface CinematicVideoProps {
  /** Video or image URL used as the full-bleed backdrop. */
  src: string;
  /** Still shown while the video buffers, and whenever autoplay is unavailable. */
  poster?: string;
  /** Mirrors the wedding's global animation toggle. */
  animate?: boolean;
  /** Render the mute/unmute control so guests can opt into audio. */
  allowAudio?: boolean;
  language: Language;
  className?: string;
}

/**
 * Full-bleed cinematic backdrop.
 *
 * Browsers only autoplay muted video, so playback always starts silent and the
 * guest opts into sound. When autoplay is refused anyway (iOS Low Power Mode,
 * data-saver, reduced-motion) the poster stays up behind an explicit play button
 * instead of leaving a black hero.
 */
export const CinematicVideo = ({
  src,
  poster,
  animate = true,
  allowAudio = false,
  language,
  className,
}: CinematicVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const isVideo = isVideoSource(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    // Reduced-motion guests get the poster and a play button, never auto-motion.
    if (prefersReducedMotion() || !animate) {
      setPlaying(false);
      return;
    }

    video.muted = true;
    const attempt = video.play();
    if (attempt) {
      attempt.then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  }, [src, isVideo, animate]);

  const startWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    video.play().then(
      () => setPlaying(true),
      () => {
        // Sound was refused too — fall back to silent playback.
        video.muted = true;
        setMuted(true);
        video.play().then(
          () => setPlaying(true),
          () => setPlaying(false),
        );
      },
    );
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!playing) {
      startWithSound();
      return;
    }
    const next = !muted;
    video.muted = next;
    setMuted(next);
  };

  if (!isVideo) {
    return (
      <div
        className={cn("cinematic-media", className)}
        style={
          src
            ? {
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
        aria-hidden
      />
    );
  }

  const soundLabel = playing
    ? t(muted ? "soundOn" : "soundOff", language)
    : t("playFilm", language);

  return (
    <>
      <video
        ref={videoRef}
        className={cn("cinematic-media", className)}
        src={src}
        poster={poster || undefined}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        aria-hidden
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {allowAudio && (
        <button
          type="button"
          onClick={toggleSound}
          title={soundLabel}
          aria-label={soundLabel}
          className="cinematic-sound-toggle">
          {!playing ? (
            <Play className="w-4 h-4" fill="currentColor" />
          ) : muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span className="cinematic-sound-label">{soundLabel}</span>
        </button>
      )}
    </>
  );
};
