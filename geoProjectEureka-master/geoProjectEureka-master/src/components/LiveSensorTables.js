// LiveSensorTables.js
// =============================================================================
// React component: renders per-device sensor tables for a live-monitor project.
//
// Drop this file into your frontend at: src/components/LiveSensorTables.js
//
// Then in the project detail view component (wherever you render the 27
// standard fields), check `project.isLiveMonitor` and render this component
// instead of (or alongside) the normal fields. Example:
//
//   {project.isLiveMonitor ? (
//     <LiveSensorTables project={project} autoRefresh={true} />
//   ) : (
//     <NormalProjectFields project={project} />
//   )}
//
// Auto-refresh: when enabled, re-fetches the project every 30 seconds so the
// tables update live as new readings arrive. Pass `autoRefresh={true}` for
// today's project; pass `false` for historical days (data is frozen).
// =============================================================================

import React, { useEffect, useState, useCallback } from "react";

const REFRESH_INTERVAL_MS = 30000; // 30 seconds

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5101/api";

const fmtTime = (ts) => {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "—";
  }
};

const fmtNum = (v, digits = 1) =>
  v === undefined || v === null || isNaN(v) ? "—" : Number(v).toFixed(digits);

export default function LiveSensorTables({ project: initial, autoRefresh = true }) {
  const [project, setProject] = useState(initial);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Determine if the project's day is today (vs. historical)
  const today = new Date().toISOString().slice(0, 10);
  const isToday = project?.dayKey === today;
  const shouldAutoRefresh = autoRefresh && isToday;

  const refresh = useCallback(async () => {
    if (!project?._id) return;
    setRefreshing(true);
    try {
      // Backend endpoint: /api/data/getOneProject?itemId=<id>
      const r = await fetch(
        `${BACKEND_URL}/data/getOneProject?itemId=${project._id}`
      );
      if (r.ok) {
        const fresh = await r.json();
        // getOneProject returns the flattened object directly (not wrapped in .data)
        setProject({
          _id: fresh._id || project._id,
          dayKey: fresh.dayKey,
          sensorDevices: fresh.sensorDevices || [],
          isLiveMonitor: fresh.isLiveMonitor,
        });
        setLastRefresh(new Date());
      }
    } catch (e) {
      console.warn("Refresh failed:", e);
    } finally {
      setRefreshing(false);
    }
  }, [project?._id]);

  useEffect(() => {
    if (!shouldAutoRefresh) return;
    const t = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(t);
  }, [shouldAutoRefresh, refresh]);

  if (!project) return null;

  const devices = project.sensorDevices || [];
  const totalReadings = devices.reduce(
    (s, d) => s + (d.readings?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header / status */}
      <div className="flex items-center justify-between rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
        <div>
          <div className="text-sm text-slate-500">
            Live Sensor Monitor — {project.dayKey}
            {isToday && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="text-xl font-bold mt-1">
            {devices.length} device{devices.length === 1 ? "" : "s"} ·{" "}
            {totalReadings} reading{totalReadings === 1 ? "" : "s"}
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Last refresh: {fmtTime(lastRefresh)}</div>
          {shouldAutoRefresh && (
            <div className="mt-1">
              Auto-refresh: {refreshing ? "refreshing…" : "every 30s"}
            </div>
          )}
          <button
            onClick={refresh}
            className="mt-2 px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={refreshing}
          >
            Refresh now
          </button>
        </div>
      </div>

      {/* One table per device */}
      {devices.length === 0 ? (
        <div className="text-center text-slate-500 p-8">
          No sensor readings yet for {project.dayKey}.
        </div>
      ) : (
        devices.map((device) => (
          <DeviceTable key={device.device_id} device={device} />
        ))
      )}
    </div>
  );
}

function DeviceTable({ device }) {
  // Show most recent first
  const readings = [...(device.readings || [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const latest = readings[0];

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Device header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">📡 {device.device_id}</span>
            {device.location && (
              <span className="text-sm text-slate-500">
                — {device.location}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {readings.length} reading{readings.length === 1 ? "" : "s"} ·
            first {fmtTime(device.first_seen)} · last {fmtTime(device.last_seen)}
          </div>
        </div>
        {latest && (
          <div className="text-right">
            <div className="text-xs text-slate-500">Latest</div>
            <div className="font-mono text-sm">
              T = {fmtNum(latest.temperature, 1)}°C · H ={" "}
              {fmtNum(latest.humidity, 1)}%
            </div>
          </div>
        )}
      </div>

      {/* Readings table */}
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
            <tr>
              <th className="text-left px-4 py-2">Time</th>
              <th className="text-right px-4 py-2">Temperature</th>
              <th className="text-right px-4 py-2">Humidity</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r, i) => (
              <tr
                key={i}
                className={
                  i % 2 ? "bg-slate-50 dark:bg-slate-900/30" : ""
                }
              >
                <td className="px-4 py-1.5 font-mono">{fmtTime(r.timestamp)}</td>
                <td className="px-4 py-1.5 text-right font-mono">
                  {fmtNum(r.temperature, 2)} °C
                </td>
                <td className="px-4 py-1.5 text-right font-mono">
                  {fmtNum(r.humidity, 1)} %RH
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}