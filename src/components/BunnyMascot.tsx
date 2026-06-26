const DEFAULT_BUNNY_IMAGE_SRC = "/assets/mascot/bunny.png";

type BunnyMascotProps = {
  size?: number;
  variant?: "svg" | "image";
  src?: string;
  className?: string;
};

export default function BunnyMascot({ size = 88, variant = "svg", src = DEFAULT_BUNNY_IMAGE_SRC, className = "" }: BunnyMascotProps) {
  const mascotClassName = ["bunny-mascot", className].filter(Boolean).join(" ");

  if (variant === "image") {
    return (
      <img
        width={size}
        height={size}
        src={src}
        alt="うさぎキャラクター"
        className={mascotClassName}
      />
    );
  }

  return (
<svg
  width={size}
  height={size}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 128 128"
  role="img"
  aria-labelledby="bunny-mascot-title bunny-mascot-desc"
  className={mascotClassName}
>
  <title id="bunny-mascot-title">今ここボードのうさぎアイコン</title>
  <desc id="bunny-mascot-desc">クリーム色のぽってりした垂れ耳うさぎ。太い黒線、薄いピンクの内耳、少し無表情な顔。</desc>

  <defs>
    <style>
      {`
      .outline {
        fill: #fffaf0;
        stroke: #050505;
        stroke-width: 6.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .line {
        fill: none;
        stroke: #050505;
        stroke-width: 6.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .thin-line {
        fill: none;
        stroke: #050505;
        stroke-width: 5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .eye {
        fill: #050505;
      }
      .inner-ear {
        fill: #ffd8cf;
        stroke: #050505;
        stroke-width: 5.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      `}
    </style>
  </defs>

  <path className="outline" d="M20.5 81.5c-8.3 8.1-8.3 19.6-1.6 25.8 7.1 6.5 21.7 5.7 29.8-2.5 7.5-7.6 7.7-18.4 1.3-24.5-7.1-6.9-21.1-6.9-29.5 1.2z"/>

  <path className="outline" d="M38.3 27.3C23.6 38.2 12.2 55.9 9.2 73.8 7.4 84.4 9.4 92.2 15 96c6.4 4.4 15.6.3 21.3-9.5 5.1-8.8 6.7-20.1 10.6-30.4 2.9-7.6 7.5-15.2 10.6-21.7 2.2-4.5-1.4-9.1-6.3-9.6-4.3-.4-8.6.2-12.9 2.5z"/>

  <path className="outline" d="M43.6 22.8c4.2-2.8 8.7-4.1 13.4-3.1 2.4.5 3.6 1.7 5.7 1.2 20-4.2 41.7 3.1 51 18.5 4 6.7 6.6 13.4 7.2 21.1 4.5 4.4 6.1 9.5 4.4 15.1 6.5 6.3 8 15.5 3.5 23.3-4.8 8.4-15.5 12.6-27.3 12.1-8.5 6.8-25.7 9.9-42.7 7.3-15.5-2.3-28.8-8.5-34.7-17.3-5-7.4-3.8-16.1 2.9-23.3-1.5-8.2 1.7-16.3 8.2-21.1 2.3-7.8 6-15.6 11.5-22.8-4.9-.5-6.7-7.3-3.1-11z"/>

  <path className="inner-ear" d="M50.7 39.8c-6.6 8-10.7 17.5-13.1 27-1.2 4.9-3.1 10.7-5.6 16.4 8.4-4.8 14.3-13.2 18.3-21.2 3.5-7 6.9-14.7 8.1-23.7.6-4-4.1-2.9-7.7 1.5z"/>

  <path className="outline" d="M34.6 105.1c1.2-8 8-13.1 18.2-13.1s17 5.1 18.2 13.1c1.3 8.4-4.6 14.2-18.2 14.2s-19.5-5.8-18.2-14.2z"/>
  <path className="outline" d="M96.4 98.2c2-7 8.3-11.1 16.4-10.2 8.5.9 13.8 7.2 12.8 14.8-1 7.4-7.2 11.8-16.4 10.8-9.1-1-14.8-8.2-12.8-15.4z"/>

  <path className="thin-line" d="M48.5 108.3v8.1"/>
  <path className="thin-line" d="M58.3 108.3v8.1"/>
  <path className="thin-line" d="M111.3 101.9c1.8 2.9 2.4 5.8 2 9"/>
  <path className="thin-line" d="M119.4 101.5c1.7 2.7 2.1 5.3 1.6 8.2"/>

  <path className="line" d="M61.7 52.1l10.8 2.4"/>
  <path className="line" d="M95.1 54.8l10.2.9"/>
  <circle className="eye" cx="67.6" cy="64.3" r="2.8"/>
  <circle className="eye" cx="102.5" cy="66.6" r="2.8"/>
  <path className="line" d="M85.7 77.6l7 5.1 7-3.5"/>
  <path className="line" d="M92.7 82.7c.1 5.2-1.9 9.4-6.4 11.8"/>
  <path className="line" d="M92.7 82.7c.7 5.2 3.4 8.6 7.9 9.8"/>
</svg>
  );
}
