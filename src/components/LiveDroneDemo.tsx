import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './ui/GlassCard';

const API_URL = 'https://jibexbanks-verd.hf.space';

export function LiveDroneDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile || !selectedFile.type.match(/image\/(jpeg|png)/)) {
      setError('Please upload a JPG or PNG image.');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setFile(selectedFile);
    setScanData(null);
    setSelectedZone(null);
    setError(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Reset so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const runScan = async () => {
    if (!file) return;

    setIsLoading(true);
    setScanData(null);
    setError(null);

    const form = new FormData();
    form.append('image', file);

    try {
      const res = await fetch(`${API_URL}/scan`, { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setScanData(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const severityColor = (s: number) => {
    if (s >= 0.75) return '#c0392b';
    if (s >= 0.60) return '#e74c3c';
    if (s >= 0.45) return '#e85d26';
    if (s >= 0.30) return '#f5a623';
    if (s >= 0.20) return '#d4c84a';
    if (s >= 0.10) return '#aed581';
    return '#2e7d32';
  };

  return (
    <div className="drone-demo-root font-sora text-[#e8f0e0]">
      <style>{`
        .drone-demo-root {
          --bg: #0d1408;
          --surface: #141a0e;
          --card-bg: #1a2212;
          --border: #2a3820;
          --border-hi: #3d5428;
          --green: #5cdb6f;
          --green-dim: #2d6a3f;
          --amber: #f5a623;
          --orange: #e85d26;
          --red: #c0392b;
          --red-bright: #e74c3c;
          --text: #e8f0e0;
          --muted: #6b8060;
          --font-head: 'Sora', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--green);
          letter-spacing: 0.1em;
          padding: 5px 12px;
          border: 1px solid var(--green-dim);
          border-radius: 20px;
          background: rgba(92, 219, 111, 0.05);
        }
        .live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--green);
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        .drop-zone {
          border: 1.5px dashed var(--border-hi);
          border-radius: 14px;
          background: var(--card-bg);
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .drop-zone.drag-over {
          border-color: var(--green);
          background: #1e2c16;
        }
        .drop-icon {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
        }
        .drop-icon svg { width: 24px; height: 24px; stroke: var(--green); fill: none; }
        .drop-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
        .drop-sub   { font-size: 12px; color: var(--muted); }

        .scan-btn {
          width: 100%;
          padding: 13px;
          background: var(--green);
          color: #0d1408;
          border: none;
          border-radius: 10px;
          font-family: var(--font-head);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          letter-spacing: 0.02em;
        }
        .scan-btn:hover:not(:disabled) { opacity: 0.88; }
        .scan-btn:active:not(:disabled) { transform: scale(0.98); }
        .scan-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: #0d1408;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .state-empty {
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--card-bg);
          min-height: 400px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          color: var(--muted);
          font-size: 13px;
          gap: 12px;
        }

        .metric-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 12px;
          text-align: center;
        }
        .metric-val {
          font-size: 28px; font-weight: 700; line-height: 1;
          margin-bottom: 4px;
        }
        .metric-lbl {
          font-size: 10px; font-family: var(--font-mono);
          color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase;
        }

        .action-banner {
          border-radius: 10px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .banner-critical { background: rgba(192,57,43,0.15); border: 1px solid rgba(192,57,43,0.3); color: var(--red-bright); }
        .banner-moderate { background: rgba(232,93,38,0.12); border: 1px solid rgba(232,93,38,0.25); color: var(--orange); }
        .banner-ok       { background: rgba(92,219,111,0.1);  border: 1px solid rgba(92,219,111,0.2); color: var(--green); }

        .heatmap-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
        }
        .card-label {
          font-size: 10px; font-family: var(--font-mono);
          color: var(--muted); letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 12px;
        }

        .heatmap-container {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          background: #111;
        }
        .h-cell {
          cursor: pointer;
          transition: filter 0.12s, outline 0.1s;
          outline: 1px solid rgba(0,0,0,0.15);
        }
        .h-cell:hover { filter: brightness(1.35); z-index: 5; }
        .h-cell.sel   { outline: 2px solid white; z-index: 10; }

        .zone-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .zone-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-family: var(--font-mono);
          padding: 3px 10px; border-radius: 12px; font-weight: 500;
        }
        .badge-critical { background: rgba(192,57,43,0.2);  color: var(--red-bright); }
        .badge-moderate { background: rgba(232,93,38,0.15); color: var(--orange); }
        .badge-low      { background: rgba(245,166,35,0.15); color: var(--amber); }
        .badge-healthy  { background: rgba(92,219,111,0.12); color: var(--green); }

        .treat-item {
          font-size: 11px; color: var(--text);
          padding: 5px 0 5px 12px;
          position: relative;
          border-bottom: 1px solid var(--border);
          line-height: 1.5;
        }
        .treat-item::before { content: '→'; position: absolute; left: 0; color: var(--green); font-weight: 600; }
      `}</style>

      <GlassCard className="p-0 border-white/5 bg-[#0d1408] overflow-hidden rounded-[2rem] shadow-2xl">
        <header className="flex items-center justify-between p-[18px_32px] border-b border-[#2a3820] bg-[#141a0e]">
          <div className="text-[20px] font-bold tracking-[-0.5px]">
            <em className="text-[#5cdb6f] not-italic">Verd</em> 
            <span className="text-[14px] font-light text-[#6b8060] ml-[6px]">Drone Field Analysis</span>
          </div>
          <div className="live-badge"><div className="live-dot"></div>DEMO MODE</div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-[20px] p-[32px_24px] items-start max-w-[1200px] mx-auto">
          
          {/* LEFT: Upload panel */}
          <div className="flex flex-col gap-[14px]">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/jpeg,image/png" 
              className="hidden"
            />

            {!previewUrl ? (
              <div 
                className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
              >
                <div className="flex flex-col items-center">
                  <div className="drop-icon">
                    <svg viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                    </svg>
                  </div>
                  <div className="drop-title">Upload drone image</div>
                  <div className="drop-sub">JPG or PNG · drag & drop or click</div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-[12px] overflow-hidden group">
                <img 
                  src={previewUrl} 
                  alt="preview" 
                  className="w-full block max-h-[220px] object-cover rounded-[12px]"
                />
                <button 
                  onClick={() => {
                    setPreviewUrl(null);
                    setFile(null);
                    setScanData(null);
                    setSelectedZone(null);
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-[10px] right-[10px] bg-[rgba(13,20,8,0.8)] text-[#5cdb6f] border border-[#2d6a3f] rounded-[20px] p-[5px_14px] text-[12px] font-semibold cursor-pointer font-sora hover:bg-[#1a2212] transition-colors"
                >
                  Change image
                </button>
              </div>
            )}

            <button 
              className={`scan-btn ${isLoading ? 'flex items-center justify-center gap-2' : ''}`}
              disabled={!file || isLoading}
              onClick={runScan}
            >
              {isLoading ? (
                <><span className="btn-spinner"></span> Analysing...</>
              ) : (
                'Analyse Field'
              )}
            </button>

            {error && (
              <div className="bg-[rgba(192,57,43,0.1)] border border-[rgba(192,57,43,0.3)] rounded-[10px] p-[14px_16px] color-[#e74c3c] text-[13px] leading-[1.6]">
                <strong>Connection error</strong><br />
                {error}<br /><br />
                Make sure the FastAPI server is running at <code>{API_URL}</code> and CORS is enabled.
              </div>
            )}
          </div>

          {/* RIGHT: Result panel */}
          <div className="flex flex-col gap-[16px]">
            {!scanData ? (
              <div className="state-empty">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#5cdb6f" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
                <span>Upload a drone image and click Analyse Field</span>
              </div>
            ) : (
              <div className="flex flex-col gap-[14px]">
                {/* Scan meta */}
                <div className="flex items-center gap-[16px] text-[11px] font-mono text-[#6b8060] flex-wrap">
                  <span>ID <strong className="text-[#e8f0e0]">{scanData.scan_id}</strong></span>
                  <span>File <strong className="text-[#e8f0e0]">{scanData.filename}</strong></span>
                  <span>Grid <strong className="text-[#e8f0e0]">{scanData.grid_rows}×{scanData.grid_cols}</strong></span>
                  <span>Affected <strong className="text-[#e8f0e0]">{scanData.summary.affected_pct}%</strong></span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px]">
                  <div className="metric-card">
                    <div className="metric-val text-[#e74c3c]">{scanData.summary.critical_zones}</div>
                    <div className="metric-lbl">Critical</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val text-[#e85d26]">{scanData.summary.moderate_zones}</div>
                    <div className="metric-lbl">Moderate</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val text-[#f5a623]">{scanData.summary.low_zones}</div>
                    <div className="metric-lbl">Low risk</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-val text-[#5cdb6f]">{scanData.summary.healthy_zones}</div>
                    <div className="metric-lbl">Healthy</div>
                  </div>
                </div>

                {/* Action banner */}
                <div className={`action-banner ${
                  scanData.summary.critical_zones > 6 ? 'banner-critical' : 
                  scanData.summary.moderate_zones > 6 ? 'banner-moderate' : 'banner-ok'
                }`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
                  </svg>
                  {scanData.summary.recommended_action}
                  {scanData.summary.diseases_detected.length > 0 && (
                    <> — <em>{scanData.summary.diseases_detected.join(', ')}</em></>
                  )}
                </div>

                {/* Heatmap + zone detail */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_270px] gap-[14px]">
                  <div className="heatmap-card">
                    <div className="card-label">Disease intensity map — click a zone</div>
                    <div className="heatmap-container">
                      <img src={previewUrl!} alt="field" className="w-full block opacity-[0.45] rounded-[10px]" />
                      <div 
                        className="absolute inset-0 grid" 
                        style={{ 
                          gridTemplateColumns: `repeat(${scanData.grid_cols}, 1fr)`,
                          gridTemplateRows: `repeat(${scanData.grid_rows}, 1fr)`
                        }}
                      >
                        {scanData.zones.map((z: any, idx: number) => (
                          <div 
                            key={idx}
                            className={`h-cell ${selectedZone === z ? 'sel' : ''}`}
                            style={{ background: severityColor(z.severity) + 'cc' }}
                            title={`${z.disease} · ${z.severity_label}`}
                            onClick={() => setSelectedZone(z)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-[8px] mt-[10px]">
                      <span className="text-[10px] text-[#6b8060] font-mono">Healthy</span>
                      <div className="flex-1 h-[6px] rounded-[3px] bg-gradient-to-r from-[#2e7d32] via-[#aed581] via-[#f9a825] via-[#e65100] to-[#c0392b]"></div>
                      <span className="text-[10px] text-[#6b8060] font-mono">Critical</span>
                    </div>
                  </div>

                  <div className="zone-card">
                    <div className="card-label">Zone detail</div>
                    {!selectedZone ? (
                      <div className="text-[#6b8060] text-[12px] text-center m-auto leading-[1.7]">
                        Tap any zone on<br />the heatmap to inspect it.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[10px]">
                        <div className="card-label mt-0">Zone — row {selectedZone.row + 1} · col {selectedZone.col + 1}</div>
                        
                        <div className="flex items-center justify-between flex-wrap gap-[8px]">
                          <div className="text-[15px] font-semibold">{selectedZone.disease}</div>
                          <span className={`zone-badge badge-${selectedZone.severity_label}`}>
                            {selectedZone.severity_label.toUpperCase()}
                          </span>
                        </div>

                        <div className="h-[5px] bg-[#2a3820] rounded-[3px] overflow-hidden">
                          <div 
                            className="h-full rounded-[3px] transition-[width] duration-400" 
                            style={{ 
                              width: `${Math.round(selectedZone.severity * 100)}%`,
                              background: severityColor(selectedZone.severity)
                            }}
                          ></div>
                        </div>

                        <div className="flex flex-col gap-[6px]">
                          <div className="flex justify-between text-[11px] py-[4px] border-b border-[#2a3820]">
                            <span className="text-[#6b8060] font-mono">Severity</span>
                            <span className="font-medium">{Math.round(selectedZone.severity * 100)}%</span>
                          </div>
                          <div className="flex justify-between text-[11px] py-[4px] border-b border-[#2a3820]">
                            <span className="text-[#6b8060] font-mono">Confidence</span>
                            <span className="font-medium">{Math.round(selectedZone.confidence * 100)}%</span>
                          </div>
                          {selectedZone.disease !== 'Healthy' && (
                            <>
                              <div className="flex justify-between text-[11px] py-[4px] border-b border-[#2a3820]">
                                <span className="text-[#6b8060] font-mono">Yield impact</span>
                                <span className="font-medium text-[#e85d26] text-right max-w-[160px]">{selectedZone.yield_impact}</span>
                              </div>
                              <div className="flex justify-between text-[11px] py-[4px] border-b border-[#2a3820]">
                                <span className="text-[#6b8060] font-mono">Spread</span>
                                <span className="font-medium text-right max-w-[160px]">{selectedZone.spread_note}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {selectedZone.disease !== 'Healthy' ? (
                          <div className="flex flex-col gap-[4px]">
                            <div className="text-[9px] font-mono text-[#6b8060] tracking-[0.1em] uppercase">Recommended actions</div>
                            {selectedZone.treatments.map((t: string, i: number) => (
                              <div key={i} className="treat-item">{t}</div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[#5cdb6f] text-[12px] font-medium">✓ This zone is healthy. No action required.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </GlassCard>
    </div>
  );
}
