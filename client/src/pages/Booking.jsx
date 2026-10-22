import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Sparkles, Clock, MessageCircle, CheckCircle2, Upload, Calendar } from 'lucide-react';
import { api, errMsg, waLink } from '../api.js';
import { SEO } from '../App.jsx';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number (min 7 digits)'),
  date: z.string().min(1, 'Please select your preferred date'),
  time: z.string().min(1, 'Please choose a preferred time of day'),
  style: z.string().min(1, 'Please select a tattoo style'),
  placement: z.string().min(2, 'Please specify desired body placement (e.g. inner forearm, collarbone)'),
  size: z.string().min(1, 'Please select approximate size'),
  budget: z.string().optional(),
  description: z.string().min(10, 'Please describe your tattoo idea (at least 10 characters)')
});

export const Field = ({ label, error, hint, children }) => (
  <label className="block">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</span>
      {hint && <span className="text-[11px] text-muted/80">{hint}</span>}
    </div>
    {children}
    {error && <span role="alert" className="text-xs text-[var(--error)] mt-1 block">{error.message}</span>}
  </label>
);

export default function Booking() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [msg, setMsg] = useState(null);
  const [waText, setWaText] = useState(null);
  const [s, setS] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setS(r.data)).catch(() => {});
  }, []);

  const handleFileChange = e => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const submit = async v => {
    setMsg(null);
    try {
      let referenceImage = '';
      if (file) {
        const f = new FormData();
        f.append('image', file);
        const upRes = await api.post('/upload/reference', f);
        referenceImage = upRes.data.url;
      }
      const r = await api.post('/bookings', { ...v, referenceImage });
      setMsg({ ok: true, t: r.data.message });
      setWaText(`Hi Noor Tattooz! I just sent a booking request.\nName: ${v.name}\nDate: ${v.date} (${v.time})\nStyle: ${v.style}\nPlacement: ${v.placement}\nSize: ${v.size}`);
      reset();
      setFile(null);
      setFilePreview(null);
    } catch (e) {
      setMsg({ ok: false, t: errMsg(e) });
    }
  };

  const styles = [
    'Fine Line & Single Needle',
    'Dark Realism & Portraits',
    'Japanese Irezumi',
    'Sacred Geometry & Dotwork',
    'Heavy Blackwork',
    'Botanical & Floral',
    'Minimalist & Script',
    'Cover-Up & Scar Camouflage',
    'Custom Bespoke Concept'
  ];

  const sizeOptions = [
    'Micro / Tiny (Under 2 inches)',
    'Small (2 to 3 inches)',
    'Medium (4 to 6 inches)',
    'Large (7 to 10 inches)',
    'Half-Sleeve (Forearm or Upper Arm)',
    'Full Sleeve / Leg Sleeve',
    'Backpiece / Full Torso Project'
  ];

  const budgetOptions = [
    'Under ₹5,000 (Micro / Fine Line)',
    '₹5,000 – ₹12,000 (Medium Custom)',
    '₹12,000 – ₹20,000 (Half-Day / Complex)',
    '₹20,000 – ₹40,000+ (Full Day / Sleeve)',
    'Flexible / Quote needed'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <SEO
        title="Book a Custom Tattoo Session"
        description="Schedule your tattoo consultation or session at Noor Tattooz Studio in Prem Nagar, Una, Himachal Pradesh. Choose your artist, style, and preferred date."
      />

      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-semibold">Reserve Your Date</span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">BOOK A SESSION</h1>
        <p className="text-muted text-sm mt-3 leading-relaxed">
          Submit your concept below. Our concierge reviews your inquiry and confirms your session within 4 business hours.
        </p>
      </div>

      {/* Safety & Protocol Banner */}
      <div className="glass-card p-4 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted border border-gold/20">
        <span className="flex items-center gap-1.5 text-cream font-medium">
          <ShieldCheck size={16} className="text-emerald" />
          Strictly 18+ with Valid ID
        </span>
        <span className="flex items-center gap-1.5 text-cream font-medium">
          <Sparkles size={15} className="text-gold" />
          Free Design Stencil Included
        </span>
        <span className="flex items-center gap-1.5 text-cream font-medium">
          <CheckCircle2 size={15} className="text-emerald" />
          60-Day Touch-Up Guarantee
        </span>
      </div>

      <form onSubmit={handleSubmit(submit)} noValidate className="glass-card p-4 sm:p-8 md:p-10 grid sm:grid-cols-2 gap-4 sm:gap-5 border border-gold/25">
        <Field label="Full Name" error={errors.name}>
          <input className="field" placeholder="e.g. Ayesha Kapur" {...register('name')} autoComplete="name" />
        </Field>

        <Field label="Email Address" error={errors.email}>
          <input type="email" className="field" placeholder="e.g. ayesha@example.com" {...register('email')} autoComplete="email" />
        </Field>

        <Field label="Phone / WhatsApp" error={errors.phone} hint="Digits with country code">
          <input type="tel" className="field" placeholder="e.g. +91 98200 12345" {...register('phone')} autoComplete="tel" />
        </Field>

        <Field label="Preferred Date" error={errors.date}>
          <input type="date" className="field" min={new Date().toISOString().split('T')[0]} {...register('date')} />
        </Field>

        <Field label="Preferred Time of Day" error={errors.time}>
          <select className="field" {...register('time')}>
            <option value="">Choose slot…</option>
            <option value="Morning (11:00 AM - 1:30 PM)">Morning (11:00 AM - 1:30 PM)</option>
            <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
            <option value="Evening (5:30 PM - 8:30 PM)">Evening (5:30 PM - 8:30 PM)</option>
            <option value="Full Day (11:00 AM - 7:00 PM)">Full Day (11:00 AM - 7:00 PM)</option>
          </select>
        </Field>

        <Field label="Tattoo Style" error={errors.style}>
          <select className="field" {...register('style')}>
            <option value="">Select style discipline…</option>
            {styles.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </Field>

        <Field label="Approximate Size" error={errors.size}>
          <select className="field" {...register('size')}>
            <option value="">Select dimensions…</option>
            {sizeOptions.map(sz => <option key={sz} value={sz}>{sz}</option>)}
          </select>
        </Field>

        <Field label="Body Placement" error={errors.placement} hint="Be specific">
          <input className="field" placeholder="e.g. Left inner forearm, Collarbone, Ribs" {...register('placement')} />
        </Field>

        <Field label="Estimated Budget Range" hint="Optional">
          <select className="field" {...register('budget')}>
            <option value="">Select range…</option>
            {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Describe Your Tattoo Idea" error={errors.description} hint="Meaning, elements, symbols or lettering">
            <textarea
              rows="4"
              className="field"
              placeholder="Tell us what you envision: symbols, story, references, typography, or elements you want incorporated..."
              {...register('description')}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Reference Image or Sketch (Optional)" hint="JPG, PNG or WebP · Max 5MB">
            <div className="border border-dashed border-line rounded-xl p-4 text-center hover:border-gold/50 transition">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                id="ref-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="ref-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={24} className="text-gold" />
                <span className="text-xs text-cream font-medium">Click to upload reference image</span>
                <span className="text-[11px] text-muted">Supports inspiration photos, sketches, or photos of the target placement area</span>
              </label>
              {file && (
                <div className="mt-3 flex items-center justify-center gap-3 pt-3 border-t border-line">
                  {filePreview && <img src={filePreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg border border-gold/40" />}
                  <span className="text-xs text-cream font-medium truncate max-w-xs">{file.name}</span>
                </div>
              )}
            </div>
          </Field>
        </div>

        {msg && (
          <div className={`sm:col-span-2 p-4 rounded-xl text-center text-sm font-medium ${
            msg.ok ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}>
            <p>{msg.t}</p>
          </div>
        )}

        {msg?.ok && waText && s.whatsapp && (
          <div className="sm:col-span-2 text-center pt-2">
            <a
              href={waLink(s.whatsapp, waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn ghost w-full flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} className="text-emerald-400" />
              <span>CONTINUE ON WHATSAPP FOR FASTER CONFIRMATION</span>
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="clay-btn sm:col-span-2 mt-3"
        >
          {isSubmitting ? 'PROCESSING YOUR REQUEST…' : 'SUBMIT APPOINTMENT REQUEST'}
        </button>
      </form>
    </div>
  );
}
