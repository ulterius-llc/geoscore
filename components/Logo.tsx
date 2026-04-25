interface LogoProps {
  className?: string;
  withBg?: boolean;
}

export function Logo({ className, withBg = false }: LogoProps) {
  if (withBg) {
    return (
      <svg
        className={className}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="32" height="32" rx="8" fill="#0f172a" />
        <circle
          cx="16"
          cy="16"
          r="9"
          stroke="#5eead4"
          strokeWidth="1.6"
          fill="none"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="4.5"
          ry="9"
          stroke="#5eead4"
          strokeWidth="1.6"
          fill="none"
        />
        <line
          x1="7"
          y1="16"
          x2="25"
          y2="16"
          stroke="#5eead4"
          strokeWidth="1.6"
        />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden
    >
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.6" />
      <ellipse
        cx="16"
        cy="16"
        rx="5.5"
        ry="11"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <line
        x1="5"
        y1="16"
        x2="27"
        y2="16"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
