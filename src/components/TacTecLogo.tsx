import { memo, useId } from "react";
import clsx from "clsx";

type TacTecLogoProps = {
  className?: string;
  title?: string;
};

function TacTecLogoComponent({ className, title = "TACTEC" }: TacTecLogoProps) {
  const titleId = useId();

  return (
    <svg
      viewBox="0 0 360 120"
      role="img"
      aria-labelledby={titleId}
      className={clsx("h-full w-full", className)}
    >
      <title id={titleId}>{title}</title>
      <rect width="360" height="120" rx="16" fill="currentColor" />
      <g fill="#fff" fontFamily="'Montserrat', 'Helvetica Neue', Arial, sans-serif" fontWeight={700}>
        <text
          x="180"
          y="74"
          textAnchor="middle"
          fontSize="64"
          letterSpacing="18"
        >
          TACT
        </text>
        <text
          x="180"
          y="110"
          textAnchor="middle"
          fontSize="48"
          letterSpacing="40"
        >
          EC
        </text>
      </g>
    </svg>
  );
}

const TacTecLogo = memo(TacTecLogoComponent);

TacTecLogo.displayName = "TacTecLogo";

export default TacTecLogo;
