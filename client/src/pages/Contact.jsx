import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Navigation, ShieldCheck } from 'lucide-react';
import { api, errMsg, waLink } from '../api.js';
import { SEO } from '../App.jsx';
import { Field } from './Booking.jsx';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Please provide an inquiry subject'),
  message: z.string().min(10, 'Your message must be at least 10 characters long')
});

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const [msg, setMsg] = useState(null);
  const [s, setS] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setS(r.data)).catch(() => {});
  }, []);

  const submit = async v => {
    try {
      const res = await api.post('/contact', v);
      setMsg({ ok: true, t: res.data.message });
      reset();
    } catch (e) {
      setMsg({ ok: false, t: errMsg(e) });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <SEO
        title="Contact Noor Tattooz Studio Una (H.P.)"
        description="Visit our tattoo atelier on Una Amb Road, Near Sabji Mandi, Prem Nagar, Una, Himachal Pradesh 174303. Get studio directions, call 8219811181 or message our concierge directly."
      />

      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-semibold">Get In Touch</span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">CONTACT THE STUDIO</h1>
        <p className="text-muted text-sm mt-3 leading-relaxed">
          Have questions about a custom tattoo, pricing estimates, healing, or aftercare? Reach out to our concierge or visit our private studio in Una, Himachal Pradesh.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Studio Info Card */}
        <div className="lg:col-span-5 glass-card p-5 sm:p-8 space-y-6 border border-gold/25">
          <div>
            <span className="text-xs text-gold font-semibold uppercase tracking-widest block mb-1">Location & Atelier</span>
            <h2 className="text-xl font-bold text-cream">{s.businessName || 'Noor Tattooz Studio'}</h2>
            <p className="text-xs text-muted mt-1">{s.city || 'Una, Himachal Pradesh'}</p>
          </div>

          <div className="space-y-4 text-sm text-muted">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gold shrink-0 mt-1" />
              <div>
                <strong className="text-cream block">Studio Address</strong>
                <span>{s.address || 'Una Amb Road, Near Sabji Mandi, Prem Nagar, Una, Himachal Pradesh 174303'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-gold shrink-0 mt-1" />
              <div>
                <strong className="text-cream block">Direct Telephone / Call</strong>
                <a href={`tel:${(s.phone || '+918219811181').replace(/\s+/g, '')}`} className="hover:text-gold transition font-medium text-cream">
                  {s.phone || '+91 82198 11181'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={18} className="text-gold shrink-0 mt-1" />
              <div>
                <strong className="text-cream block">Inquiries Email</strong>
                <a href={`mailto:${s.email || 'appointments@noortattooz.com'}`} className="hover:text-gold transition">
                  {s.email || 'appointments@noortattooz.com'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-gold shrink-0 mt-1" />
              <div>
                <strong className="text-cream block">Operating Hours</strong>
                <span className="whitespace-pre-line text-xs">
                  {s.hours || 'Monday – Sunday: 10:00 AM – 8:30 PM\n(Appointments & Walk-ins Welcome)'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-line flex flex-col gap-3">
            {s.whatsapp && (
              <a
                href={waLink(s.whatsapp, 'Hi Noor Tattooz Studio, I would like to inquire about getting a tattoo at your Una studio.')}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn ghost text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="text-emerald-400" />
                <span>CHAT WITH US ON WHATSAPP</span>
              </a>
            )}

            <a
              href={s.mapsUrl || 'https://share.google/byos1q4FITCvikbhe'}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn ghost text-xs flex items-center justify-center gap-2"
            >
              <Navigation size={15} className="text-gold" />
              <span>VIEW ON GOOGLE MAPS</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-[#141418] border border-[#232328] text-xs text-muted">
            <strong className="text-cream block mb-1 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> Studio Protocol
            </strong>
            Visits are primarily by appointment to ensure our artists can focus entirely on current clients without disruption. Please book a consultation before dropping by.
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 glass-card p-5 sm:p-10 border border-gold/25">
          <h2 className="text-2xl font-bold mb-2">Send an Inquiry</h2>
          <p className="text-xs text-muted mb-6">
            Fill in the details below and we will get back to you via email or phone within 4 business hours.
          </p>

          <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
            <Field label="Your Full Name" error={errors.name}>
              <input className="field" placeholder="e.g. Rahul Sharma" {...register('name')} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email Address" error={errors.email}>
                <input type="email" className="field" placeholder="e.g. rahul@example.com" {...register('email')} />
              </Field>

              <Field label="Phone Number (Optional)">
                <input type="tel" className="field" placeholder="e.g. +91 98200 00000" {...register('phone')} />
              </Field>
            </div>

            <Field label="Subject" error={errors.subject}>
              <input className="field" placeholder="e.g. Custom Backpiece Consultation / Pricing Question" {...register('subject')} />
            </Field>

            <Field label="Your Message" error={errors.message}>
              <textarea
                rows="5"
                className="field"
                placeholder="How can our team help you? Please include as many details as possible..."
                {...register('message')}
              />
            </Field>

            {msg && (
              <div className={`p-4 rounded-xl text-center text-sm font-medium ${
                msg.ok ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}>
                {msg.t}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn w-full flex items-center justify-center gap-2 mt-2"
            >
              <Send size={16} />
              <span>{isSubmitting ? 'SENDING MESSAGE…' : 'SEND INQUIRY'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
