import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";

interface BlockerPoint {
  text: string;
  x: number;
  y: number;
}

export interface BlockerMapProps {
  points: BlockerPoint[];
}

/** 색상 */
const getColor = (x: number, y: number) => {
  if (x >= 50 && y >= 50) return { fill: "#FEE2E2", stroke: "#FA5252" };
  if (x >= 50 || y >= 50) return { fill: "#FEF9C3", stroke: "#FCC419" };
  return { fill: "#DCFCE7", stroke: "#22C55E" };
};

/** 버블 : Blocker Keyword **/
const CustomBubble = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;

  const width = payload.text.length * 10 + 20;
  const { fill, stroke } = getColor(payload.x, payload.y);

  return (
    <g>
      <rect
        x={cx - width / 2}
        y={cy - 14}
        width={width}
        height={28}
        rx={14}
        fill={fill}
        stroke={stroke}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="#111827"
      >
        {payload.text}
      </text>
    </g>
  );
};

export default function BlockerMap({ points }: BlockerMapProps) {

  
 // 키워드 겹침 완화 <- 랜덤 이동
    const jitter = (val: number) => val + (Math.random() - 0.5) * 7;

    const adjustedPoints = points.map((p) => ({
    ...p,
    jitterx: Math.max(0, Math.min(100, jitter(p.x))),
    jittery: Math.max(0, Math.min(100, jitter(p.y))),
    }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={420}>
        <ScatterChart margin={{ top: 24, right: 32, bottom: 56, left: 56 }}>

          <XAxis type="number" dataKey="jitterx" domain={[0, 100]} />
          <YAxis type="number" dataKey="jittery" domain={[0, 100]} />

          {/* 사분면 */}
          <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#FEF2F2" fillOpacity={0.6} />
          <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="#FEFCE8" fillOpacity={0.6} />
          <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="#FEFCE8" fillOpacity={0.6} />
          <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="#F0FDF4" fillOpacity={0.6} />

          <ReferenceLine x={50} stroke="#D1D5DB" strokeDasharray="4 4" />
          <ReferenceLine y={50} stroke="#D1D5DB" strokeDasharray="4 4" />


          <Scatter
            data={adjustedPoints}
            shape={(props: any) => <CustomBubble {...props} />}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}