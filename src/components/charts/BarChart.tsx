import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  barColor?: string;
  defaultBarColor?: string;
  barCategoryGap?: string | number;
  bottomBarColor?: string;
  showBottomBar?: boolean;
  heightClassName?: string;
  widthClassName?: string;
  yDomain?: [number, number];
}

const DEFAULT_CURRENT_BAR_COLOR = '#2dd4bf';
const DEFAULT_BAR_COLOR = '#d1d5db';

export default function BarChart({
  data,
  barColor = DEFAULT_CURRENT_BAR_COLOR,
  defaultBarColor = DEFAULT_BAR_COLOR,
  barCategoryGap = '16%',
  bottomBarColor = barColor,
  showBottomBar = true,
  heightClassName = 'h-28',
  widthClassName = 'w-full',
  yDomain = [0, 100],
}: BarChartProps) {
  return (
    <div className={`relative pt-1 ${heightClassName} ${widthClassName}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 18, left: 4 }}
          barCategoryGap={barCategoryGap}
        >
          <YAxis hide domain={yDomain} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            dy={10}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((item, index) => (
              <Cell
                key={`${item.label}-${index}`}
                fill={item.color ?? defaultBarColor}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
      {showBottomBar && (
        <div
          className="pointer-events-none absolute bottom-[26px] left-1 right-1 h-1 rounded-full"
          style={{ backgroundColor: bottomBarColor }}
        />
      )}
    </div>
  );
}
