import React, { useState, useEffect } from 'react';
import {
  Download,
  CheckCircle2,
  HardDriveDownload,
  RefreshCw,
  BookOpen,
  MapPin,
  CheckSquare,
  Trash2,
  Inbox,
} from 'lucide-react';
import { DownloadResource } from '@shared';
import { ApiService } from '../services/api';

export const DownloadsPage: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadResource[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    setIsLoading(true);
    try {
      const res = await ApiService.getDownloads();
      if (res.success && res.data) {
        setDownloads(res.data);
      }
    } catch {
      // Local fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    setUpdatingId(id);
    try {
      await ApiService.toggleDownload(id);
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, status: d.status === 'Downloaded' ? 'Available' : 'Downloaded' }
            : d
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setUpdatingId(null), 400);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Survival Guide':
        return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'Offline Maps':
        return <MapPin className="w-5 h-5 text-amber-400" />;
      default:
        return <CheckSquare className="w-5 h-5 text-emerald-400" />;
    }
  };

  const totalCachedBytes = downloads
    .filter((d) => d.status === 'Downloaded')
    .reduce((acc, curr) => acc + curr.sizeBytes, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Download className="w-5 h-5" />
            <span>DOWNLOADS & OFFLINE RESOURCE REPOSITORY</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage device-cached safety guides, vector maps, and checklists for zero-connectivity environments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadDownloads}
            disabled={isLoading}
            aria-label="Refresh download list"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
            Device Cache: <span className="text-cyan-400 font-bold">{(totalCachedBytes / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
        </div>
      </div>

      {/* Downloads List */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <div className="font-mono text-xs text-slate-300">Loading cached resource inventory...</div>
          </div>
        ) : downloads.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
              <Inbox className="w-7 h-7 text-slate-500" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-200">No Resources Available</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Offline survival guides and topographic map packs will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {downloads.map((item) => {
              const isDownloaded = item.status === 'Downloaded';
              const isUpdating = updatingId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-slate-100">{item.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isDownloaded ? 'badge-green' : 'badge-cyan'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Category: {item.category} • Size: {item.sizeFormatted}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    disabled={isUpdating}
                    aria-label={isDownloaded ? `Remove ${item.title} from cache` : `Download ${item.title} to device`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                      isDownloaded
                        ? 'bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow'
                    }`}
                  >
                    {isUpdating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : isDownloaded ? (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Cache</span>
                      </>
                    ) : (
                      <>
                        <HardDriveDownload className="w-3.5 h-3.5" />
                        <span>Download to Device</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
