import { useLanguage } from "@/contexts/LanguageContext";
import { useId } from "react";

/** A quiet, hand-drawn Thai basil sprig outside the existing photograph. */
export function HeroBotanical() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 140 190"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="hero-botanical pointer-events-none absolute -bottom-4 -left-36 hidden h-48 w-36 text-brass/40 xl:block"
    >
      <path pathLength="1" d="M22 182C59 149 96 99 111 20" />
      <path pathLength="1" d="M42 161C7 157 5 132 9 112C35 118 49 136 42 161ZM42 161L14 120" />
      <path pathLength="1" d="M62 136C64 101 89 93 112 94C109 118 89 139 62 136ZM62 136L103 101" />
      <path pathLength="1" d="M81 102C50 97 41 73 46 51C71 58 88 77 81 102ZM81 102L51 59" />
      <path pathLength="1" d="M97 68C99 38 118 30 135 29C133 51 119 68 97 68ZM97 68L129 35" />
      <path pathLength="1" d="M110 27C94 15 98 3 104 1C115 9 117 17 110 27Z" />
    </svg>
  );
}

/** Four existing flavour names form a slowly turning culinary seal. */
export function HeroFlavourSeal() {
  const { t } = useLanguage();
  const circleId = useId();
  const flavours = `${t.aboutSour} · ${t.aboutSpicy} · ${t.aboutSalt} · ${t.aboutSweet} · `;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 120 120"
      className="hero-flavour-seal pointer-events-none absolute -right-1 -top-9 size-20 text-brass-strong sm:-right-8 sm:-top-8 sm:size-28"
    >
      <defs>
        <path id={circleId} d="M60 17a43 43 0 1 1 0 86a43 43 0 1 1 0-86" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="hsl(var(--background))" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="hsl(var(--brass) / 0.5)" strokeWidth="0.75" />
      <circle cx="60" cy="60" r="31" fill="none" stroke="hsl(var(--brass) / 0.4)" strokeWidth="0.75" />
      <text className="hero-seal-type fill-current font-body text-[10px] font-medium uppercase" textLength="265" lengthAdjust="spacing">
        <textPath href={`#${circleId}`}>{flavours}</textPath>
      </text>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M48 76C61 62 68 47 72 39" />
        <path d="M59 61C44 62 42 51 43 46C56 46 61 52 59 61ZM64 54C64 42 72 39 79 39C78 49 72 55 64 54ZM53 69C39 70 37 62 37 58C48 56 54 61 53 69ZM60 60C70 57 78 59 81 64C73 72 64 72 60 60Z" />
      </g>
    </svg>
  );
}

/** Three translucent wisps lift from the soup without changing the image crop. */
export function HeroSteam() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 120 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="hero-steam pointer-events-none absolute left-[32%] top-[20%] h-[28%] w-[36%] text-primary-foreground/70 blur-[0.7px]"
    >
      <path d="M26 148C6 125 44 111 27 87S14 43 32 17" />
      <path d="M59 155C79 132 43 113 61 87S77 49 59 10" />
      <path d="M94 148C75 124 111 107 95 81S83 42 99 18" />
    </svg>
  );
}
