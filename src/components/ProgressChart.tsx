"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface ProgressPoint {
  date: string;
  estOneRepMax: number;
  weightKg: number;
  reps: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ProgressChart({ data, unitLabel }: { data: ProgressPoint[]; unitLabel: string }) {
  if (data.length < 2) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-zinc-800 text-sm text-zinc-500">
        Log a couple more sets to see your progress curve.
      </div>
    );
  }

  return (
    <div className="h-56 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#3f3f46" }}
          />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
            labelFormatter={(v) => formatDate(String(v))}
            formatter={(value, name) => [
              name === "estOneRepMax" ? `${Number(value).toFixed(1)} ${unitLabel}` : String(value),
              name === "estOneRepMax" ? "Est. 1RM" : String(name),
            ]}
          />
          <Line
            type="monotone"
            dataKey="estOneRepMax"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ r: 2, fill: "#34d399" }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
