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

// ── 위험도 계산 ──────────────────────────────────────────────────────────────
// 차이 비율: |surfaceScore - inferredScore| / 100
// 75% 이상 → 위험, 40% 이상 → 주의 요망, 미만 → 안전
function getRiskLevel(surface: number, inferred: number): {
  level: '위험' | '주의 요망' | '안전';
  gapRatio: number;
} {
  const gapRatio = Math.abs(surface - inferred) / 100;
  if (gapRatio >= 0.75) return { level: '위험', gapRatio };
  if (gapRatio >= 0.40) return { level: '주의 요망', gapRatio };
  return { level: '안전', gapRatio };
}

const RISK_BADGE: Record<'위험' | '주의 요망' | '안전', { bg: string; text: string }> = {
  '위험':    { bg: '#FEE2E2', text: '#EF4444' },
  '주의 요망': { bg: '#FEF3C7', text: '#D97706' },
  '안전':    { bg: '#D1FAE5', text: '#059669' },
};

// ── 커스텀 툴팁 ──────────────────────────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: RadarMember }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  const { level, gapRatio } = getRiskLevel(d.surfaceScore, d.inferredScore);
  const badge = RISK_BADGE[level];

  // 바 위에서 표면/추론 중 작은 값이 왼쪽 끝, 큰 값이 오른쪽 끝
  const lo = Math.min(d.surfaceScore, d.inferredScore);
  const hi = Math.max(d.surfaceScore, d.inferredScore);
  // 전체 바 너비 = 160px
  const BAR_W = 160;
  const loX = (lo / 100) * BAR_W;
  const hiX = (hi / 100) * BAR_W;
  const gapW = hiX - loX;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        minWidth: 200,
        fontSize: 12,
      }}
    >
      {/* 이름 */}
      <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>{d.name}</p>

      {/* 겹친 Bar */}
      <div style={{ position: 'relative', height: 8, width: BAR_W, background: '#E5E7EB', borderRadius: 4, marginBottom: 6 }}>
        {/* 표면 만족도 바 (회색 배경 위에 teal) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: (d.surfaceScore / 100) * BAR_W,
            height: '100%',
            background: '#5EEAD4',
            borderRadius: 4,
          }}
        />
        {/* 추론 만족도 바 (반투명 남색) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: (d.inferredScore / 100) * BAR_W,
            height: '100%',
            background: 'rgba(99,102,241,0.55)',
            borderRadius: 4,
          }}
        />
        {/* 차이 구간 — 빨간색 */}
        <div
          style={{
            position: 'absolute',
            left: loX,
            top: 0,
            width: gapW,
            height: '100%',
            background: '#FA5252',
            borderRadius: 2,
          }}
        />
      </div>

      {/* 라벨 행 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, color: '#6B7280', marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>추론</span>
          <strong style={{ color: '#111827' }}>{d.inferredScore}%</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>표면</span>
          <strong style={{ color: '#111827' }}>{d.surfaceScore}%</strong>
        </div>
      </div>

      {/* 격차 + 뱃지 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#6B7280' }}>
          격차 : <strong style={{ color: '#111827' }}>{Math.round(gapRatio * 100)}%</strong>
        </span>
        <span
          style={{
            background: badge.bg,
            color: badge.text,
            borderRadius: 20,
            padding: '2px 10px',
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {level}
        </span>
      </div>
    </div>
  );
}

// ── 커스텀 노드 ──────────────────────────────────────────────────────────────
interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: RadarMember;
  riskThreshold?: number;
  onMemberClick?: (memberId: string) => void;
}

function CustomDot({ cx = 0, cy = 0, payload, riskThreshold = 50, onMemberClick }: CustomDotProps) {
  if (!payload) return null;

  // 리스크 존: surfaceScore < threshold AND inferredScore < threshold
  const inRiskZone =
    payload.surfaceScore < riskThreshold && payload.inferredScore < riskThreshold;

  const fill   = inRiskZone ? 'rgba(255,146,138,0.60)' : '#5EEAD4';
  const stroke = inRiskZone ? '#FF928A' : '#14B8A6';
  const textFill = inRiskZone ? '#9F1239' : '#134E4A';

  return (
    <g
      style={{ cursor: onMemberClick ? 'pointer' : 'default' }}
      onClick={() => onMemberClick?.(payload.memberId)}
    >
      {/* 리스크 존일 때 외부 그림자 효과 */}
      {inRiskZone && (
        <circle
          cx={cx}
          cy={cy}
          r={23}
          fill="none"
          stroke="#FA5252"
          strokeWidth={1.5}
          strokeOpacity={0.35}
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={18}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={500}
        fill={textFill}
      >
        {payload.name}
      </text>
    </g>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
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

          <ReferenceArea
            x1={threshold}
            x2={100}
            y1={threshold}
            y2={100}
            fill="#20C997"
            fillOpacity={0.2}
          />
          <ReferenceArea
            x1={0}
            x2={threshold}
            y1={0}
            y2={threshold}
            fill="#FCC419"
            fillOpacity={0.2}
          />
          <ReferenceArea
            x1={threshold}
            x2={100}
            y1={0}
            y2={threshold}
            fill="#FA5252"
            fillOpacity={0.2}
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
          <ReferenceLine x={threshold} stroke="#D1D5DB" strokeDasharray="4 4" strokeWidth={1} />
          <ReferenceLine y={threshold} stroke="#D1D5DB" strokeDasharray="4 4" strokeWidth={1} />

          <Tooltip content={<CustomTooltip />} />

          <Scatter
            data={data}
            shape={(props: object) => (
              <CustomDot
                {...(props as CustomDotProps)}
                riskThreshold={threshold}
                onMemberClick={onMemberClick}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
