// src/pages/PredictionHistory/predictionHistory.js
//
// Lists geothermal predictions saved to the backend (from VR or the website).
// Add to your router:
//   import PredictionHistory from "../pages/PredictionHistory/predictionHistory";
//   <Route path="/history" element={<PredictionHistory/>}/>

import React, { useState, useEffect } from "react";
import axios from "axios";

// Backend base URL (Node/Express on 5101). Change when you deploy.
const BACKEND_URL = "http://localhost:5101/api";

const probColor = (p) =>
  p >= 0.7 ? "#16a34a" : p >= 0.5 ? "#ca8a04" : "#6b7280";

const probLabel = (p) =>
  p >= 0.7 ? "High potential" : p >= 0.5 ? "Moderate potential" : "Low potential";

const PredictionHistory = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BACKEND_URL}/predictions/all`);
      setRows(res.data);
    } catch (e) {
      setError(
        e.response
          ? `Server error: ${e.response.status}`
          : "Cannot reach backend. Is it running on port 5101?"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/predictions/${id}`);
      setDetail(res.data);
    } catch (e) {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const fmt = (d) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Prediction History</h1>
        <button className="px-4 py-2 bg-sky-600 text-white rounded" onClick={load}>
          Refresh
        </button>
      </div>
      <p className="text-gray-500 mb-6">
        Geothermal predictions saved from VR sessions and the website.
      </p>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="bg-gray-50 border rounded-lg p-6 text-center text-gray-500">
          No predictions saved yet. Take a screenshot in VR, or run one on the{" "}
          <a href="/predict" className="text-sky-600 underline">prediction page</a>.
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Site</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Centre</th>
                <th className="text-right px-4 py-3">Mean P</th>
                <th className="text-left px-4 py-3">Verdict</th>
                <th className="text-right px-4 py-3">Max P</th>
                <th className="text-right px-4 py-3">High-prospect</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3">{(r.site_name || "—").replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-gray-200">
                      {r.source || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {r.center_lat != null
                      ? `${r.center_lat.toFixed(3)}, ${r.center_lon.toFixed(3)}`
                      : "—"}
                  </td>
                  <td
                    className="px-4 py-3 text-right font-bold"
                    style={{ color: probColor(r.summary?.mean_probability ?? 0) }}
                  >
                    {r.summary?.mean_probability != null
                      ? `${(r.summary.mean_probability * 100).toFixed(0)}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.summary?.mean_probability != null ? (
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                        style={{ backgroundColor: probColor(r.summary.mean_probability) }}
                      >
                        {probLabel(r.summary.mean_probability)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.summary?.max_probability != null
                      ? r.summary.max_probability.toFixed(2)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.summary?.n_high_prospect ?? "—"} / {r.summary?.n_points ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-sky-600 underline" onClick={() => openDetail(r._id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(detail || detailLoading) && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading ? (
              <p>Loading…</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    {(detail.site_name || "Prediction").replace(/_/g, " ")}
                  </h2>
                  <button
                    className="text-gray-400 text-2xl leading-none"
                    onClick={() => setDetail(null)}
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {fmt(detail.createdAt)} · {detail.source} ·{" "}
                  {detail.center_lat?.toFixed(4)}, {detail.center_lon?.toFixed(4)}
                </p>

                {/* Prominent verdict + percentage */}
                <div
                  className="text-2xl font-bold mb-2"
                  style={{ color: probColor(detail.summary?.mean_probability ?? 0) }}
                >
                  {((detail.summary?.mean_probability ?? 0) * 100).toFixed(0)}% —{" "}
                  {probLabel(detail.summary?.mean_probability ?? 0)}
                </div>

                {/* Area / grid extent */}
                {detail.bbox && (
                  <p className="text-sm text-gray-500 mb-1">
                    Analyzed area: {detail.grid_n}×{detail.grid_n} grid (
                    {detail.summary?.n_points} points) over bbox{" "}
                    [{detail.bbox.lat_min?.toFixed(4)}, {detail.bbox.lon_min?.toFixed(4)}] – [
                    {detail.bbox.lat_max?.toFixed(4)}, {detail.bbox.lon_max?.toFixed(4)}]
                  </p>
                )}

                <p className="text-sm text-gray-500 mb-4">
                  mean{" "}
                  <b style={{ color: probColor(detail.summary?.mean_probability ?? 0) }}>
                    {detail.summary?.mean_probability?.toFixed(2)}
                  </b>{" "}
                  · max {detail.summary?.max_probability?.toFixed(2)} · min{" "}
                  {detail.summary?.min_probability?.toFixed(2)} ·{" "}
                  {detail.summary?.n_high_prospect} of {detail.summary?.n_points} points
                  high-prospect
                </p>
                {detail.points && detail.points.length > 0 && (
                  <MiniGrid points={detail.points} />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MiniGrid = ({ points }) => {
  const n = Math.round(Math.sqrt(points.length));
  const color = (p) => (p >= 0.7 ? "#16a34a" : p >= 0.5 ? "#ca8a04" : "#9ca3af");
  const sorted = [...points].sort((a, b) => b.lat - a.lat || a.lon - b.lon);
  return (
    <div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {sorted.map((pt, i) => (
          <div
            key={i}
            title={`${pt.lat.toFixed(4)}, ${pt.lon.toFixed(4)} → ${pt.probability.toFixed(2)}`}
            className="aspect-square rounded-sm"
            style={{
              backgroundColor: color(pt.probability),
              opacity: 0.4 + pt.probability * 0.6,
            }}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Each cell = a sampled location, colored by probability (grey low, yellow moderate, green high).
      </p>
    </div>
  );
};

export default PredictionHistory;
