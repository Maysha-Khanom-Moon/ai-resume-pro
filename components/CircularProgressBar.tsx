// components/CircularProgressBar.tsx

interface CircularProgressBarProps {
  progress: number; // Progress percentage (0-100)
  size: number; // Size of the circle
  strokeWidth: number; // Width of the progress stroke
}

const CircularProgressBar = ({ progress, size, strokeWidth }: CircularProgressBarProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="transform rotate-90"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className="text-gray-300"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-teal-500"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
    </svg>
  );
};

export default CircularProgressBar;
