'use client'

import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { SeasonalDay } from '../lib/weather'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatXTick(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  if (d.getDate() === 1) return MONTHS[d.getMonth()]
  return ''
}

interface Props {
  data: SeasonalDay[]
}

export default function SeasonalChart({ data }: Props) {
  const chartData = data.map(d => ({
    date: d.date,
    High: d.tempMax,
    Low: d.tempMin,
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="date"
          tickFormatter={formatXTick}
          stroke="#475569"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <YAxis
          stroke="#475569"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          unit="°C"
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(value: number, name: string) => [`${value}°C`, name]}
        />
        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12, paddingTop: 8 }} />
        <Area type="monotone" dataKey="High" stroke="#f97316" fill="#f9731620" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="Low" stroke="#38bdf8" fill="#38bdf820" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
