/**
 * AEGIS ALERT - Multi-Hazard Chart & Analytics Visualizer
 * Renders high-performance interactive forecast and trend charts using Chart.js or SVG fallbacks.
 * Covers 6-Hour predictive forecasts, 24h/7d/30d historical analytics, and risk distribution radars.
 *
 * NOTE: PROTOTYPE DEMO CHARTS - NOT FOR REAL-WORLD EMERGENCY DECISION MAKING
 */

export class ChartsController {
  constructor() {
    this.charts = {};
  }

  /**
   * Initializes or updates the 6-Hour Forecast Chart
   */
  renderForecastChart(canvasId, location, liveForecast = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    let labels = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"];
    let rainData = [18, 48, 65, 82, 70, 35];
    let floodRiskData = [35, 58, 74, 88, 85, 62];
    let lightningRiskData = [15, 30, 60, 85, 90, 40];

    if (liveForecast && liveForecast.labels && liveForecast.labels.length > 0) {
      labels = liveForecast.labels;
      rainData = liveForecast.rain;
      floodRiskData = liveForecast.floodRisk;
      lightningRiskData = liveForecast.lightningRisk;
    }

    if (window.Chart) {
      if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
      }

      const ctx = canvas.getContext("2d");
      this.charts[canvasId] = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Flood Inundation Risk (%)",
              data: floodRiskData,
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointRadius: 5,
              pointBackgroundColor: "#0284c7"
            },
            {
              label: "Rainfall Rate (mm/h)",
              data: rainData,
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderWidth: 2,
              fill: false,
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: "#059669"
            },
            {
              label: "Lightning / Thunderstorm Risk (%)",
              data: lightningRiskData,
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: "#d97706"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { labels: { color: "#cbd5e1", font: { family: "Inter, sans-serif", size: 11 } } },
            tooltip: {
              backgroundColor: "#0f172a",
              titleColor: "#38bdf8",
              bodyColor: "#f1f5f9",
              borderColor: "#334155",
              borderWidth: 1
            }
          },
          scales: {
            x: { grid: { color: "rgba(255, 255, 255, 0.06)" }, ticks: { color: "#94a3b8" } },
            y: {
              min: 0,
              max: 100,
              grid: { color: "rgba(255, 255, 255, 0.06)" },
              ticks: { color: "#94a3b8", callback: (v) => `${v}%` }
            }
          }
        }
      });
    } else {
      this.renderSvgForecastFallback(canvas, labels, floodRiskData, rainData);
    }
  }

  /**
   * Renders the 24h / 7d / 30d Analytics Multi-Hazard Trend Chart
   */
  renderAnalyticsTrends(canvasId, timeRange = "24h") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    let labels, floodData, rainData, tempData, aqiData;

    if (timeRange === "24h") {
      labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"];
      floodData = [25, 30, 48, 76, 88, 82, 78];
      rainData = [10, 15, 38, 68, 74, 52, 42];
      tempData = [24, 23, 26, 32, 34, 29, 28];
      aqiData = [65, 70, 85, 120, 145, 138, 125];
    } else if (timeRange === "7d") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      floodData = [20, 22, 35, 62, 85, 92, 78];
      rainData = [5, 12, 45, 110, 165, 195, 142];
      tempData = [31, 32, 29, 27, 25, 26, 28];
      aqiData = [55, 60, 82, 110, 135, 140, 128];
    } else {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      floodData = [18, 32, 74, 82];
      rainData = [45, 98, 240, 310];
      tempData = [33, 31, 28, 27];
      aqiData = [60, 75, 115, 130];
    }

    if (window.Chart) {
      if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
      }

      const ctx = canvas.getContext("2d");
      this.charts[canvasId] = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Flood Inundation Risk (%)",
              data: floodData,
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.2)",
              fill: true,
              tension: 0.35
            },
            {
              label: "Rainfall Intensity Index",
              data: rainData,
              borderColor: "#10b981",
              fill: false,
              tension: 0.35
            },
            {
              label: "Air Quality Index (AQI)",
              data: aqiData,
              borderColor: "#a855f7",
              borderDash: [4, 4],
              fill: false,
              tension: 0.35
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: "#cbd5e1", font: { size: 11 } } }
          },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8" } },
            y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8" } }
          }
        }
      });
    }
  }

  /**
   * Renders the Multi-Hazard Risk Distribution Radar Chart
   */
  renderRiskRadar(canvasId, risks) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const r = risks?.hazards || {};
    const dataValues = [
      r.rainfall?.score || 65,
      r.flood?.score || 78,
      r.landslide?.score || 55,
      r.lightning?.score || 62,
      r.heat?.score || 35,
      r.pollution?.score || 48
    ];

    if (window.Chart) {
      if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
      }

      const ctx = canvas.getContext("2d");
      this.charts[canvasId] = new window.Chart(ctx, {
        type: "radar",
        data: {
          labels: ["🌧️ Rainfall", "🌊 Flood", "⛰️ Landslide", "⚡ Lightning", "🌡️ Heat", "🌫️ Pollution"],
          datasets: [
            {
              label: "Multi-Hazard Threat Profile",
              data: dataValues,
              backgroundColor: "rgba(239, 68, 68, 0.25)",
              borderColor: "#ef4444",
              borderWidth: 2,
              pointBackgroundColor: "#f43f5e",
              pointBorderColor: "#ffffff",
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 100,
              grid: { color: "rgba(255, 255, 255, 0.1)" },
              angleLines: { color: "rgba(255, 255, 255, 0.15)" },
              pointLabels: { color: "#cbd5e1", font: { size: 11, weight: "bold" } },
              ticks: { display: false }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }

  /**
   * Renders Weather Station Sensor Variance Bar Chart (SIH26073)
   */
  renderSensorVarianceChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const ctx = canvas.getContext("2d");
    this.charts[canvasId] = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: ["AWS-101 (HYD)", "AWS-102 (GHY)", "AWS-103 (VSP - Anomaly)", "AWS-104 (DED)", "AWS-105 (WAY)", "AWS-106 (MUM)"],
        datasets: [
          {
            label: "Sensor Variance Error (σ)",
            data: [0.12, 0.18, 3.42, 0.15, 0.21, 0.16],
            backgroundColor: [
              "#10b981", "#10b981", "#ef4444", "#10b981", "#10b981", "#10b981"
            ],
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: (ctx) => ctx.dataIndex === 2 ? "⚠️ Quality Control: Sensor Zero-Point Drift Flagged" : "✅ Calibration: Verified Healthy"
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 10 } } },
          y: {
            grid: { color: "rgba(255,255,255,0.06)" },
            ticks: { color: "#94a3b8" },
            title: { display: true, text: "Standard Deviations from Cluster Mean", color: "#64748b" }
          }
        }
      }
    });
  }

  renderSvgForecastFallback(canvas, labels, flood, rain) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.parentElement?.clientWidth || canvas.width || 400;
    const h = 200;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = 30 + (i * 35);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Draw Flood Line
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const stepX = (w - 70) / (labels.length - 1);
    flood.forEach((val, idx) => {
      const x = 45 + (idx * stepX);
      const y = h - 45 - (val / 100 * (h - 75));
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Rain Line
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    rain.forEach((val, idx) => {
      const x = 45 + (idx * stepX);
      const y = h - 45 - (val / 100 * (h - 75));
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Points & Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter, sans-serif";
    labels.forEach((lbl, idx) => {
      const x = 45 + (idx * stepX);
      ctx.fillText(lbl.split(" ")[0], x - 12, h - 15);
    });
  }
}
