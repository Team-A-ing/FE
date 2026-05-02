import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import type { RadarMember } from '@/types/analysis';

export interface ScatterRadarProps {
  data: RadarMember[];
  riskThreshold?: number;
  onMemberClick?: (memberId: string) => void;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: RadarMember;
  onMemberClick?: (memberId: string) => void;
}

function CustomDot({ cx = 0, cy = 0, payload, onMemberClick }: CustomDotProps) {
  if (!payload) return null;
  const isRisk = payload.surfaceScore > 40 && payload.inferredScore < 50;

  return (
    <g
      style={{ cursor: onMemberClick ? 'pointer' : 'default' }}
      onClick={() => onMemberClick?.(payload.memberId)}
    >
      <circle
        cx={cx}
        cy={cy}
        r={18}
        fill={isRisk ? '#FDA4AF' : '#5EEAD4'}
        fillOpacity={0.85}
        stroke={isRisk ? '#F43F5E' : '#14B8A6'}
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={500}
        fill={isRisk ? '#9F1239' : '#134E4A'}
      >
        {payload.name}
      </text>
    </g>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: RadarMember }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 mb-1">{d.name}</p>
      <p className="text-gray-500">표면 만족도: <span className="text-gray-800 font-medium">{d.surfaceScore}</span></p>
      <p className="text-gray-500">추론 만족도: <span className="text-gray-800 font-medium">{d.inferredScore}</span></p>
    </div>
  );
}

export default function ScatterRadar({
  data,
  riskThreshold = 0.5,
  onMemberClick,
}: ScatterRadarProps) {
  const threshold = riskThreshold * 100;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#E5E7EB"
            strokeOpacity={0.7}
          />
          {/* Silent Risk zone: high surface (>threshold), low inferred (<threshold) */}
          <ReferenceArea
            x1={0}
            x2={threshold}
            y1={0}
            y2={threshold}
            fill="rgba(239,68,68,0.08)"
            fillOpacity={1}
          />
          <XAxis
            type="number"
            dataKey="surfaceScore"
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            label={{
              value: '표면 만족도',
              position: 'insideBottom',
              offset: -15,
              style: { fontSize: 11, fill: '#9CA3AF' },
            }}
          />
          <YAxis
            type="number"
            dataKey="inferredScore"
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            label={{
              value: '추론 만족도',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fontSize: 11, fill: '#9CA3AF' },
            }}
          />
          <ReferenceLine
            x={threshold}
            stroke="#D1D5DB"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <ReferenceLine
            y={threshold}
            stroke="#D1D5DB"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={data}
            shape={(props: object) => (
              <CustomDot
                {...(props as CustomDotProps)}
                onMemberClick={onMemberClick}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
