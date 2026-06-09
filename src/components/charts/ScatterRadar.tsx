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
import type { RadarDataPoint, RadarQuadrant } from '@/types/analysis';

export interface ScatterRadarProps {
  data: RadarDataPoint[];
  riskThreshold?: number;
  onMemberClick?: (memberId: number) => void;
}

const DIRECTION_LABELS: Record<RadarDataPoint['direction'], string> = {
  OVERREPORT: '표면 점수 높음',
  UNDERREPORT: '행동 점수 높음',
};

const QUADRANT_LABELS: Record<RadarQuadrant, string> = {
  STABLE: '안정',
  SILENT_RISK: '주의',
  EXPLICIT_RISK: '위험',
  CONSERVATIVE: '보수적 응답',
};

// 점/배지 색은 위치 사분면(두 점수 모두 반영) 기준으로 통일 — 배경 영역과 항상 일치.
// 베이스라인 40 보정으로 정상 미팅은 저점 구역에서 벗어나므로, 저점에 남는 경우만 실제 위험.
// 좌하단(자기보고·행동 모두 낮음)=위험(red), 우하단(말은 괜찮은데 행동 낮음=숨은 갭)=주의(amber).
const QUADRANT_STYLE: Record<RadarQuadrant, { fill: string; stroke: string; text: string; bg: string }> = {
  STABLE: { fill: 'rgba(32,201,151,0.65)', stroke: '#20C997', text: '#065F46', bg: '#D1FAE5' },
  SILENT_RISK: { fill: 'rgba(245,158,11,0.65)', stroke: '#F59E0B', text: '#92400E', bg: '#FEF3C7' },
  EXPLICIT_RISK: { fill: 'rgba(250,82,82,0.65)', stroke: '#FA5252', text: '#9F1239', bg: '#FED7D7' },
  CONSERVATIVE: { fill: 'rgba(99,102,241,0.55)', stroke: '#6366F1', text: '#3730A3', bg: '#E0E7FF' },
};

// 분기점 45: safety 기준선이 40(발화 없음)이라, 발화가 조금이라도 있으면 상단으로 가도록 BE와 정렬.
const QUADRANT_THRESHOLD = 45;

function getQuadrant(point: RadarDataPoint, threshold: number = QUADRANT_THRESHOLD): RadarQuadrant {
  const sHigh = point.safetyScore >= threshold;
  const svHigh = point.surveyScore >= threshold;
  if (svHigh && sHigh) return 'STABLE';
  if (svHigh && !sHigh) return 'SILENT_RISK';
  if (!svHigh && !sHigh) return 'EXPLICIT_RISK';
  return 'CONSERVATIVE';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: RadarDataPoint }[];
  threshold?: number;
}

function CustomTooltip({ active, payload, threshold }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  const quadrant = getQuadrant(point, threshold);
  const qStyle = QUADRANT_STYLE[quadrant];
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
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <span
          style={{
            background: qStyle.bg,
            color: qStyle.text,
            borderRadius: 20,
            padding: '2px 10px',
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {QUADRANT_LABELS[quadrant]}
        </span>
      </div>
    </div>
  );
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: RadarDataPoint;
  threshold?: number;
  onMemberClick?: (memberId: number) => void;
}

function CustomDot({ cx = 0, cy = 0, payload, threshold, onMemberClick }: CustomDotProps) {
  if (!payload) return null;
  const style = QUADRANT_STYLE[getQuadrant(payload, threshold)];

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
  riskThreshold = QUADRANT_THRESHOLD / 100,
  onMemberClick,
}: ScatterRadarProps) {
  const threshold = riskThreshold * 100;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" strokeOpacity={0.7} />

          {/* 우상단 안정(green), 우하단 주의(amber), 좌하단 위험(red), 좌상단 보수적(indigo) */}
          <ReferenceArea x1={threshold} x2={100} y1={threshold} y2={100} fill="#20C997" fillOpacity={0.2} />
          <ReferenceArea x1={threshold} x2={100} y1={0} y2={threshold} fill="#F59E0B" fillOpacity={0.18} />
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

          <Tooltip content={<CustomTooltip threshold={threshold} />} />

          <Scatter
            data={data}
            shape={(props: object) => (
              <CustomDot
                {...(props as CustomDotProps)}
                threshold={threshold}
                onMemberClick={onMemberClick}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
