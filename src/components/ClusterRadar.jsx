import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { clusterScores } from '../lib/compare.js'
import { useTheme } from '../lib/useTheme.js'

const SHORT = {
  health: 'Health',
  legal: 'Legal',
  identity: 'Identity',
  safety: 'Safety',
  expression: 'Expression',
  everyday: 'Everyday',
}

// Cluster-level overview: higher = more free/safe on that theme (0–100).
export default function ClusterRadar({ origin, dest }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const gridStroke = dark ? '#334155' : '#e2e8f0'
  const tickFill = dark ? '#94a3b8' : '#64748b'
  const originColor = dark ? '#64748b' : '#94a3b8'

  const sameCountry = origin.code === dest.code
  const data = clusterScores(origin, dest).map((c) => ({
    subject: SHORT[c.cluster] || c.label,
    origin: c.origin ?? 0,
    dest: c.dest ?? 0,
  }))

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <h3 className="mb-1 font-semibold text-ink">Freedom & safety by theme</h3>
      <p className="mb-2 text-xs text-ink3">Further from the centre = more free / safe (0–100).</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke={gridStroke} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: tickFill }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            {!sameCountry && (
              <Radar
                name={origin.name}
                dataKey="origin"
                stroke={originColor}
                fill={originColor}
                fillOpacity={0.2}
              />
            )}
            <Radar name={dest.name} dataKey="dest" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
            <Legend wrapperStyle={{ fontSize: 12, color: tickFill }} />
            <Tooltip
              formatter={(v) => `${v}/100`}
              contentStyle={{
                background: dark ? '#1e293b' : '#fff',
                border: `1px solid ${gridStroke}`,
                borderRadius: 8,
                color: dark ? '#f1f5f9' : '#1e293b',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
