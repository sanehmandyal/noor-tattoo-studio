import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Feather,
  UploadCloud,
  Trash2,
  Check,
  Sparkles,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Star,
  Plus,
  Eye,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';
import { api, errMsg, img } from '../api.js';
import { isOwnerWork } from '../utils/ownerWorks.js';

const QUICK_STYLES = [
  'Realism',
  'Fine Line',
  'Black & Grey',
  'Sacred Geometry',
  'Custom Sleeve',
  'Portrait',
  'Japanese',
  'Cover-Up',
  'Mandala'
];

const QUICK_PLACEMENTS = [
  'Forearm',
  'Full Sleeve',
  'Chest',
  'Upper Back',
  'Full Back',
  'Leg / Calf',
  'Thigh',
  'Hand / Wrist',
  'Custom Body Placement'
];

export default function AdminOwnerWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [err, setErr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [noorArtistId, setNoorArtistId] = useState('6ad9c1b90d8f98908ab0b30f');
  const [deletingId, setDeletingId] = useState(null);

  // Picture upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Realism');
  const [selectedPlacement, setSelectedPlacement] = useState('Forearm');
  const [featured, setFeatured] = useState(true);
  const [customDescription, setCustomDescription] = useState('');

  const fileInputRef = useRef(null);

  // Fetch Noor's Artist ID from DB dynamically
  const loadArtistAndWorks = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      let resolvedId = noorArtistId;
      try {
        const artistRes = await api.get('/artists?limit=50');
        const artists = artistRes.data.items || [];
        const noor = artists.find(a => a.name?.toLowerCase().includes('noor'));
        if (noor?._id) {
          resolvedId = noor._id;
          setNoorArtistId(noor._id);
        }
      } catch {
        // Fallback to confirmed MongoDB Atlas ID
      }

      // Fetch all gallery items to display Noor's works
      const galleryRes = await api.get('/gallery?limit=100');
      const allItems = galleryRes.data.items || [];

      // Filter artworks created by Noor
      const noorWorks = allItems.filter(isOwnerWork);

      setWorks(noorWorks);
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [noorArtistId]);

  useEffect(() => {
    loadArtistAndWorks();
  }, [loadArtistAndWorks]);

  // Handle local file selection
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErr('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setErr('');
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // If title is empty, prefill a nice default
    if (!title.trim()) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      setTitle(`Noor Original: ${cleanName.length > 3 ? cleanName : 'Custom Tattoo Art'}`);
    }
  };

  // Drag and drop handlers
  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = e => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        if (!title.trim()) {
          const cleanName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          setTitle(`Noor Original: ${cleanName.length > 3 ? cleanName : 'Custom Tattoo Art'}`);
        }
      } else {
        setErr('Only image files (JPG, PNG, WebP) are supported.');
      }
    }
  };

  // Clear current upload selection
  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setTitle('');
    setCustomDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload picture and publish artwork
  const handlePublish = async e => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      setErr('Please select or drop an image file first.');
      return;
    }

    setPublishing(true);
    setErr('');
    setSuccessMsg('');

    try {
      // Step 1: Upload the picture file
      const fd = new FormData();
      fd.append('image', selectedFile);

      setUploading(true);
      const uploadRes = await api.post('/admin/upload', fd);
      const imageUrl = uploadRes.data.url;
      setUploading(false);

      if (!imageUrl) {
        throw new Error('Image upload failed to return a valid URL.');
      }

      // Step 2: Auto-publish the gallery record with Noor as the artist
      const finalTitle = title.trim() || `Noor Original Tattoo Art #${Date.now().toString().slice(-4)}`;
      const payload = {
        title: finalTitle,
        image: imageUrl,
        imageAlt: `${finalTitle} by Founder Noor at Noor Tattooz Studio Una`,
        category: "Owner Work",
        style: selectedStyle,
        placement: selectedPlacement,
        artist: noorArtistId,
        tags: ['OwnerWork', 'AdminUpload', 'NoorOriginal', 'FounderCollection', selectedStyle.toLowerCase()],
        featured: featured,
        description:
          customDescription.trim() ||
          `Authentic bespoke tattoo artwork handcrafted by founder & lead master artist Noor at Noor Tattooz Studio, Prem Nagar, Una.`
      };

      await api.post('/admin/gallery', payload);

      setSuccessMsg(`Artwork "${finalTitle}" published successfully to the website!`);
      clearSelection();
      await loadArtistAndWorks();

      // Clear success banner after 6 seconds
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (error) {
      setErr(errMsg(error));
    } finally {
      setPublishing(false);
      setUploading(false);
    }
  };

  // Delete artwork
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this tattoo artwork from the website?')) {
      return;
    }

    setDeletingId(id);
    setErr('');
    try {
      await api.delete(`/admin/gallery/${id}`);
      setWorks(prev => prev.filter(w => w._id !== id));
      setSuccessMsg('Artwork deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle featured state
  const handleToggleFeatured = async work => {
    try {
      const updatedFeatured = !work.featured;
      await api.put(`/admin/gallery/${work._id}`, { featured: updatedFeatured });
      setWorks(prev =>
        prev.map(w => (w._id === work._id ? { ...w, featured: updatedFeatured } : w))
      );
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 border border-gold/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-gold/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold/15 text-gold border border-gold/40">
              <Feather size={14} className="text-gold" />
              Founder & Master Artist Showcase
            </span>
            <span className="text-xs text-emerald font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} /> Live Database Connected
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-cream">
            Upload Owner's Tattoo Artworks
          </h2>
          <p className="text-xs md:text-sm text-silver/80 leading-relaxed">
            Quickly upload photos of tattoo works created by studio founder Noor. Simply select or drop a picture below to publish it directly to the studio website portfolio and homepage showcase.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {err && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald/40 bg-emerald/10 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-lg">
          <CheckCircle2 size={16} className="text-emerald shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. STREAMLINED PICTURE-ONLY UPLOAD STUDIO */}
      {/* ========================================================= */}
      <div className="glass-card p-6 md:p-8 border border-gold/25 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#143526]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gold/20 text-gold grid place-items-center border border-gold/40">
              <UploadCloud size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream">Upload New Artwork Picture</h3>
              <p className="text-xs text-muted">Zero-friction publishing directly to Founder's gallery</p>
            </div>
          </div>
          {selectedFile && (
            <button
              onClick={clearSelection}
              className="text-xs text-muted hover:text-red-400 flex items-center gap-1 transition"
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
          )}
        </div>

        {/* Dropzone Area */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gold/40 hover:border-gold rounded-2xl p-8 sm:p-12 text-center bg-[#03130c]/70 hover:bg-[#071f14] transition cursor-pointer flex flex-col items-center justify-center gap-4 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="h-16 w-16 rounded-2xl bg-gold/15 text-gold border border-gold/30 grid place-items-center group-hover:scale-110 transition duration-300 shadow-lg shadow-gold/10">
              <UploadCloud size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-cream group-hover:text-gold transition">
                Click to browse photo or drag & drop artwork image here
              </p>
              <p className="text-xs text-muted">
                Supports camera photos: High-res JPG, PNG, or WebP. Automatically converted and optimized.
              </p>
            </div>
            <button
              type="button"
              className="clay-btn text-xs !py-2 !px-5 inline-flex items-center gap-2 mt-2"
            >
              <ImageIcon size={14} />
              <span>Select Artwork Photo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Live Picture Preview & Quick Controls */}
            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Picture Thumbnail */}
              <div className="md:col-span-5 relative group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gold/50 shadow-2xl bg-[#04120b] relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#030e09]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-gold border border-gold/30 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Noor Masterpiece Preview</span>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="absolute top-3 right-3 h-7 w-7 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 grid place-items-center transition"
                    title="Change picture"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-[11px] text-muted text-center mt-2 truncate">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>

              {/* Smart Details (Pre-filled, zero hassle!) */}
              <div className="md:col-span-7 space-y-4">
                {/* Artwork Title (Optional, has auto-default) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-silver flex items-center justify-between">
                    <span>Artwork Title / Concept</span>
                    <span className="text-[10px] text-gold font-normal">Pre-filled (edit if desired)</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Dark Realism Lion Sleeve, Sacred Mandala..."
                    className="field w-full text-xs"
                  />
                </div>

                {/* Quick Style Pills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-silver">
                    Tattoo Art Discipline (Click to pick)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_STYLES.map(st => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setSelectedStyle(st)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                          selectedStyle === st
                            ? 'bg-gold text-[#04110b] font-bold border-gold shadow'
                            : 'bg-[#04130d] text-silver border-[#143526] hover:border-gold/40'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Body Placement Pills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-silver">
                    Body Placement (Click to pick)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PLACEMENTS.map(pl => (
                      <button
                        type="button"
                        key={pl}
                        onClick={() => setSelectedPlacement(pl)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                          selectedPlacement === pl
                            ? 'bg-emerald text-[#03110b] font-bold border-emerald shadow'
                            : 'bg-[#04130d] text-silver border-[#143526] hover:border-emerald/40'
                        }`}
                      >
                        {pl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feature on Homepage Checkbox */}
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#03110b] border border-[#143526] cursor-pointer hover:border-gold/30 transition">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={e => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded accent-gold cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-cream block">Feature on Studio Homepage</span>
                    <span className="text-muted text-[11px]">
                      Display this piece in the "Artworks by Founder Noor" showcase on the front page.
                    </span>
                  </div>
                </label>

                {/* Artistic Notes (Optional) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-silver">
                    Artistic Notes / Story (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={customDescription}
                    onChange={e => setCustomDescription(e.target.value)}
                    placeholder="Short description of the client's concept, hours taken, or needle setup (optional)..."
                    className="field w-full text-xs"
                  />
                </div>

                {/* Big Action Publish Button */}
                <div className="pt-2">
                  <button
                    onClick={handlePublish}
                    disabled={publishing || uploading}
                    className="w-full clay-btn !py-3.5 !px-6 text-sm font-bold inline-flex items-center justify-center gap-2 shadow-2xl shadow-gold/20"
                  >
                    {publishing ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>{uploading ? 'UPLOADING PICTURE TO CLOUD…' : 'SAVING TO NOOR PORTFOLIO…'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>PUBLISH ARTWORK TO WEBSITE NOW</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-muted text-center mt-2">
                    Attaches artist <strong className="text-gold">Noor (Founder)</strong> automatically and publishes live to the website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. LIVE MANAGEMENT GRID OF NOOR'S PUBLISHED ARTWORKS */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-display font-bold text-cream">
                Published Artworks by Founder Noor
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold/15 text-gold border border-gold/30">
                {works.length} Total
              </span>
            </div>
            <p className="text-xs text-muted">
              All live pieces currently tagged to Noor on the public website
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadArtistAndWorks}
              disabled={loading}
              className="clay-btn ghost text-xs !py-1.5 !px-3 inline-flex items-center gap-1.5"
              title="Refresh list"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <a
              href="/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn ghost text-xs !py-1.5 !px-3 inline-flex items-center gap-1.5"
            >
              <span>View Gallery</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center text-muted text-sm border border-gold/15 flex flex-col items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
            <span>Loading Noor's portfolio artworks from database…</span>
          </div>
        ) : !works.length ? (
          <div className="glass-card p-12 text-center text-muted text-sm border border-gold/15 space-y-2">
            <p className="text-cream font-medium">No artworks published yet for Noor.</p>
            <p className="text-xs text-muted">
              Use the upload area above to upload your first tattoo picture!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {works.map(work => (
              <div
                key={work._id}
                className="glass-card p-3 border border-gold/20 hover:border-gold/50 transition flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Artwork Image */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#05150e] relative mb-3">
                    <img
                      src={img(work.image)}
                      alt={work.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Style Pill */}
                    <span className="absolute top-2 left-2 bg-[#04120b]/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-gold border border-gold/30">
                      {work.style || 'Custom'}
                    </span>
                    {/* Featured Star Badge */}
                    {work.featured && (
                      <span className="absolute top-2 right-2 bg-gold/90 text-[#03110b] p-1 rounded-full shadow" title="Featured on Homepage">
                        <Star size={11} className="fill-[#03110b]" />
                      </span>
                    )}
                  </div>

                  {/* Artwork Details */}
                  <h4 className="font-bold text-cream text-xs line-clamp-1 group-hover:text-gold transition">
                    {work.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted">
                    <span>{work.placement || 'Custom Placement'}</span>
                    <span>·</span>
                    <span className="text-emerald font-medium">By Noor</span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="mt-3 pt-3 border-t border-[#143526] flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleFeatured(work)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold transition ${
                      work.featured ? 'text-gold hover:text-silver' : 'text-muted hover:text-cream'
                    }`}
                    title="Toggle Homepage feature"
                  >
                    <Star size={12} className={work.featured ? 'fill-gold' : ''} />
                    <span>{work.featured ? 'Featured' : 'Standard'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(work._id)}
                    disabled={deletingId === work._id}
                    className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-[11px] font-semibold p-1 hover:bg-red-500/10 rounded transition"
                    title="Delete permanently"
                  >
                    <Trash2 size={12} />
                    <span>{deletingId === work._id ? 'Deleting…' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
