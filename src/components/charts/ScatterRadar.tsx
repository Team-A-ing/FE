import {
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { RadarDataPoint, RadarQuadrant, RadarRiskLevel } from '@/types/analysis';

export interface ScatterRadarProps {
  data: RadarDataPoint[];
  riskThreshold?: number;
  onMemberClick?: (memberId: number) => void;
}

const RISK_STYLE: Record<RadarRiskLevel, { fill: string; stroke: string; text: string; bg: string }> = {
  DANGER: { fill: 'rgba(255,146,138,0.60)', stroke: '#FF928A', text: '#9F1239', bg: '#FED7D7' },
  WARNING: { fill: 'rgba(251,191,36,0.50)', stroke: '#F59E0B', text: '#92400E', bg: '#fef4e2' },
  SAFE: { fill: 'rgba(209,250,229,0.80)', stroke: '#69d4b1', text: '#065F46', bg: '#D1FAE5' },
  CAUTION: { fill: 'rgba(209,213,219,0.70)', stroke: '#9CA3AF', text: '#374151', bg: '#E0E7FF' },
};

const RISK_LABELS: Record<RadarRiskLevel, string> = {
  DANGER: '위험',
  WARNING: '주의',
  CAUTION: '관찰',
  SAFE: '안전',
};

const DIRECTION_LABELS: Record<RadarDataPoint['direction'], string> = {
  OVERREPORT: '표면 점수 높음',
  UNDERREPORT: '행동 점수 높음',
};

const QUADRANT_LABELS: Record<RadarQuadrant, string> = {
  STABLE: '안정',
  SILENT_RISK: '조용한 위험',
  EXPLICIT_RISK: '명시적 위험',
  CONSERVATIVE: '보수적 응답',
};

function getQuadrant(point: RadarDataPoint): RadarQuadrant {
  if (point.surveyScore >= 50 && point.safetyScore >= 50) return 'STABLE';
  if (point.surveyScore >= 50 && point.safetyScore < 50) return 'SILENT_RISK';
  if (point.surveyScore < 50 && point.safetyScore < 50) return 'EXPLICIT_RISK';
  return 'CONSERVATIVE';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: RadarDataPoint }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const risk = RISK_STYLE[point.riskLevel];
  const quadrant = getQuadrant(point);
  const barWidth = 160;
  const surveyWidth = (point.surveyScore / 100) * barWidth;
  const safetyWidth = (point.safetyScore / 100) * barWidth;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        minWidth: 220,
        fontSize: 12,
      }}
    >
      <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>{point.memberName}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#6B7280', marginBottom: 8 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span>Survey Score</span>
            <strong style={{ color: '#111827' }}>{point.surveyScore}%</strong>
          </div>
          <div style={{ height: 6, width: barWidth, background: '#E5E7EB', borderRadius: 4 }}>
            <div style={{ width: surveyWidth, height: '100%', background: '#5EEAD4', borderRadius: 4 }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span>Safety Score</span>
            <strong style={{ color: '#111827' }}>{point.safetyScore}%</strong>
          </div>
          <div style={{ height: 6, width: barWidth, background: '#E5E7EB', borderRadius: 4 }}>
            <div style={{ width: safetyWidth, height: '100%', background: 'rgba(99,102,241,0.55)', borderRadius: 4 }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, color: '#6B7280' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Honesty Gap</span>
          <strong style={{ color: '#111827' }}>{point.honestyGap}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>현재 상태</span>
          <strong style={{ color: '#111827' }}>{DIRECTION_LABELS[point.direction]}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>사분면</span>
          <strong style={{ color: '#111827' }}>{QUADRANT_LABELS[quadrant]}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <span
          style={{
            background: risk.bg,
            color: risk.text,
            borderRadius: 20,
            padding: '2px 10px',
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {RISK_LABELS[point.riskLevel]}
        </span>
      </div>
    </div>
  );
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: RadarDataPoint;
  onMemberClick?: (memberId: number) => void;
}

function CustomDot({ cx = 0, cy = 0, payload, onMemberClick }: CustomDotProps) {
  if (!payload) return null;
  const style = RISK_STYLE[payload.riskLevel];

  return (
    <g
      style={{ cursor: onMemberClick ? 'pointer' : 'default' }}
      onClick={() => onMemberClick?.(payload.memberId)}
    >
      <circle cx={cx} cy={cy} r={8} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} />
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontSize={11}
        fontWeight={500}
        fill={style.text}
      >
        {payload.memberName}
      </text>
    </g>
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
          <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" strokeOpacity={0.7} />

          <ReferenceArea x1={threshold} x2={100} y1={threshold} y2={100} fill="#20C997" fillOpacity={0.2} />
          <ReferenceArea x1={threshold} x2={100} y1={0} y2={threshold} fill="#FCC419" fillOpacity={0.2} />
          <ReferenceArea x1={0} x2={threshold} y1={0} y2={threshold} fill="#FA5252" fillOpacity={0.2} />
          <ReferenceArea x1={0} x2={threshold} y1={threshold} y2={100} fill="#E0E7FF" fillOpacity={0.32} />

          <XAxis
            type="number"
            dataKey="surveyScore"
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            label={{
              value: 'Survey Score',
              position: 'insideBottom',
              offset: -15,
              style: { fontSize: 11, fill: '#9CA3AF' },
            }}
          />
          <YAxis
            type="number"
            dataKey="safetyScore"
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            label={{
              value: 'Safety Score',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fontSize: 11, fill: '#9CA3AF' },
            }}
          />
          <ReferenceLine x={threshold} stroke="#D1D5DB" strokeDasharray="4 4" strokeWidth={1} />
          <ReferenceLine y={threshold} stroke="#D1D5DB" strokeDasharray="4 4" strokeWidth={1} />

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
