"use client";

const COLORS = [
  "#6366f1", // indigo
  "#f43f5e", // rose
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
];

type Slice = {
  category: string;
  amount: number;
};

export default function ExpensePieChart({
  data,
  total,
  size = "default",
  centerLabel,
}: {
  data: Slice[];
  total: number;
  size?: "default" | "small";
  centerLabel?: string;
}) {
  if (data.length === 0 || total === 0) return null;

  const radius = 80;
  const cx = 100;
  const cy = 100;
  let cumulativePercent = 0;

  function getCoordinatesForPercent(percent: number) {
    const x = cx + radius * Math.cos(2 * Math.PI * percent - Math.PI / 2);
    const y = cy + radius * Math.sin(2 * Math.PI * percent - Math.PI / 2);
    return [x, y];
  }

  let slices;
  if (data.length === 1) {
    slices = (
      <circle
        key={data[0].category}
        cx={cx}
        cy={cy}
        r={radius}
        fill={COLORS[0]}
        className="transition-opacity duration-200 hover:opacity-80"
      />
    );
  } else {
    slices = data.map((item, i) => {
      const percent = item.amount / total;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;

      const [startX, startY] = getCoordinatesForPercent(startPercent);
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const pathData = [
        `M ${cx} ${cy}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`,
      ].join(" ");

      return (
        <path
          key={item.category}
          d={pathData}
          fill={COLORS[i % COLORS.length]}
          className="transition-opacity duration-200 hover:opacity-80"
          stroke="white"
          strokeWidth="2"
        />
      );
    });
  }

  const sizeClass =
    size === "small" ? "w-28 h-28" : "w-40 h-40 md:w-48 md:h-48";
  const innerRadius = size === "small" ? 35 : 45;
  const mainFontSize = size === "small" ? "text-[12px]" : "text-[18px]";
  const subFontSize = size === "small" ? "text-[9px]" : "text-[11px]";

  return (
    <div className="flex flex-col items-center gap-3 ">
      <svg viewBox="0 0 200 200" className={sizeClass}>
        {slices}
        {/* Center circle for donut effect */}
        <circle cx={cx} cy={cy} r={innerRadius} fill="white" />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className={`fill-slate-800 ${mainFontSize} font-bold`}
        >
          ₹{total.toLocaleString("en-IN")}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          className={`fill-slate-400 ${subFontSize} font-medium `}
        >
          {centerLabel || "Total"}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {data.map((item, i) => (
          <div key={item.category} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-[11px] font-medium text-slate-600">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
