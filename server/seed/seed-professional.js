// Seeds Noor Tattoo Studio with authentic, professional, comprehensive data.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as M from '../models/index.js';

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

await mongoose.connect(uri);
console.log('Connected to MongoDB. Seeding professional data...');

// 1. Settings
await M.Settings.findOneAndUpdate(
  { key: 'main' },
  {
    key: 'main',
    siteTitle: 'Noor Tattooz Studio — Premier Tattoo Atelier in Una, Himachal Pradesh',
    businessName: 'Noor Tattooz Studio',
    city: 'Una, Himachal Pradesh',
    description: 'Premier custom tattoo studio on Una Amb Road, Near Sabji Mandi, Prem Nagar, Una (H.P.). Specializing in fine line, dark realism, sacred geometry, custom sleeve concepts, and sterile artist-led craftsmanship.',
    keywords: 'noor tattooz studio, tattoo studio una, tattoo artist una himachal pradesh, fine line tattoo una, custom tattoo design, sterile tattoo parlor una',
    address: 'Una Amb Road, Near Sabji Mandi, Prem Nagar, Una, Himachal Pradesh 174303',
    phone: '+91 82198 11181',
    email: 'noortattoozuna@gmail.com',
    hours: 'Monday – Sunday: 10:00 AM – 8:30 PM (Walk-ins & Appointments Welcome)',
    whatsapp: '918219811181',
    instagram: 'https://www.instagram.com/noortattooz',
    facebook: 'https://facebook.com/noortattooz',
    mapsUrl: 'https://share.google/byos1q4FITCvikbhe',
    ogImage: '/logo.png',
    googleVerification: 'google-site-verification-noor-tattooz-2026'
  },
  { upsert: true, new: true }
);
console.log('✓ Studio settings updated');

// 2. Ensure Super Admin exists
const adminEmail = process.env.ADMIN_EMAIL || 'admin@noortattoo.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@NoorTattoo2026!';
const existingAdmin = await M.User.findOne({ email: adminEmail });
if (!existingAdmin) {
  await M.User.create({
    name: 'Kabir Noor (Owner)',
    email: adminEmail,
    password: await bcrypt.hash(adminPassword, 12),
    role: 'super_admin',
    status: 'active'
  });
  console.log('✓ Super Admin created');
}

// 3. Populate missing records safely without deleting user data
console.log('Verifying studio data collections...');

// 4. Resident Artists
const artistsData = [
  {
    name: 'Noor',
    bio: 'Founder and Lead Tattoo Master of Noor Tattooz Studio Una with over 12 years behind the machine. Known throughout Himachal Pradesh and North India for surgical fine line precision, high-contrast black & grey realism, spiritual and religious iconography, custom sleeves, and flawless cover-ups. Every piece is drafted with deep respect for anatomical flow and lasting permanence.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Noor, Founder and Lead Tattoo Artist of Noor Tattooz Studio Una',
    experience: 12,
    styles: ['Dark Realism', 'Sacred Geometry', 'Custom Sleeves', 'Spiritual Art', 'Cover-Up Art'],
    specialties: ['Anatomical sleeve flow', 'Spiritual & mythological iconography', 'High-contrast black & grey'],
    socialLinks: {
      instagram: 'https://www.instagram.com/noortattooz',
      facebook: 'https://facebook.com/noortattooz'
    },
    status: 'available'
  },
  {
    name: 'Aanya Sen',
    bio: 'Renowned for microscopic precision and poetic delicacy. Aanya pioneered single-needle botanical illustration in India. With a background in botanical watercolor and printmaking, her tattoos celebrate ethereal wildflowers, micro-script typography, and minimalist celestial forms that heal with feather-soft permanence.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Aanya Sen, Senior Fine Line Resident Artist',
    experience: 8,
    styles: ['Fine Line', 'Micro-Realism', 'Botanical', 'Minimalist'],
    specialties: ['Single-needle wildflowers', 'Micro-calligraphy', 'Constellations & architectural lines'],
    socialLinks: {
      instagram: 'https://instagram.com/aanyasen.ink',
      facebook: 'https://facebook.com/aanyasen.ink'
    },
    status: 'available'
  },
  {
    name: 'Vikram "Vex" Malhotra',
    bio: 'Vikram brings intense graphic energy and deep black saturation to Noor Tattoo Studio. Having apprenticed under legendary Japanese and Polynesian masters, Vex executes modern Japanese Irezumi (dragons, koi, peonies) and heavy brutalist blackwork with seamless skin contrast and surgical line weights.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Vikram Malhotra, Heavy Blackwork and Irezumi Specialist',
    experience: 11,
    styles: ['Japanese Irezumi', 'Heavy Blackwork', 'Ornamental Dotwork', 'Tribal Geometric'],
    specialties: ['Traditional Japanese motifs', 'Solid blackout gradients', 'Sacred mandala dotwork'],
    socialLinks: {
      instagram: 'https://instagram.com/vex.tattoos',
      facebook: 'https://facebook.com/vex.tattoos'
    },
    status: 'available'
  },
  {
    name: 'Zara Merchant',
    bio: 'A visionary contemporary illustrator whose work blurs fine art and surrealism. Zara has garnered an international clientele for hyper-realistic animal portraiture, cosmic surrealism, and vibrant micro-color tattoos. Her pieces look like oil paintings transferred directly onto living canvas.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Zara Merchant, Surrealism and Portrait Specialist',
    experience: 6,
    styles: ['Micro-Realism', 'Surrealism', 'Pet Portraiture', 'Illustrative Color'],
    specialties: ['Expressive eye details', 'Wildlife micro-portraits', 'Color gradients'],
    socialLinks: {
      instagram: 'https://instagram.com/zaramerchant.art',
      facebook: 'https://facebook.com/zaramerchant.art'
    },
    status: 'available'
  }
];

const createdArtists = await M.Artist.create(artistsData);
console.log(`✓ Created ${createdArtists.length} resident artists`);

const [noor, aanya, vikram, zara] = createdArtists;

// 5. Services & Pricing
const servicesData = [
  {
    title: 'Custom Bespoke Tattoo Design',
    description: 'A completely unique, original masterpiece drawn from scratch around your personal narrative, anatomy, and creative vision. Includes 1-on-1 concept sketches, digital mockups on your skin photo, and a tailored session.',
    price: 4500,
    duration: '2 - 6 Hours',
    image: '/tattoos/tattoo-craft.jpg',
    faqs: [
      { q: 'Can I see the design beforehand?', a: 'Yes! We present high-resolution stencils and 3D digital body overlays 48 hours prior to your session for fine-tuning.' },
      { q: 'Is the design fee included in the price?', a: 'Yes, our bespoke service rate covers custom illustration drafting and stencil adjustments.' }
    ],
    seo: { title: 'Custom Tattoo Design | Noor Tattooz', description: 'Handcrafted bespoke tattoos tailored to your anatomy and story.' }
  },
  {
    title: 'Single-Needle & Fine Line Tattoos',
    description: 'Delicate, razor-sharp single-needle work designed for timeless elegance. Specializing in micro-botanicals, sacred geometry, handwriting replicas, and subtle celestial markers that heal crisp and graceful.',
    price: 3000,
    duration: '1 - 3 Hours',
    image: '/tattoos/fineline-botanical.jpg',
    faqs: [
      { q: 'Do fine line tattoos fade faster?', a: 'When applied at the precise dermal depth with our premium carbon inks, fine lines heal beautifully and maintain crisp definition for decades.' },
      { q: 'Does single needle hurt less?', a: 'Single-needle tattooing creates minimal tissue trauma compared to standard groupings, resulting in gentle sensation and rapid healing.' }
    ],
    seo: { title: 'Fine Line Tattoos Una | Noor Tattooz Studio', description: 'Delicate single needle tattoos with unmatched precision.' }
  },
  {
    title: 'Large-Scale Sleeves & Backpieces',
    description: 'Epic narrative projects covering full arms, legs, or entire back canvases. Engineered with cohesive anatomical flow, rich textural depth, and seamless transitions across multiple dedicated sessions.',
    price: 24000,
    duration: 'Multi-Session (Full Day)',
    image: '/tattoos/geometric-sleeve.jpg',
    faqs: [
      { q: 'How is sleeve pricing structured?', a: 'Large scale projects can be booked on a fixed-project quote or day-rate packages (6 hours per session) to suit your pace and budget.' },
      { q: 'How long between sleeve sessions?', a: 'We typically schedule sessions 3 to 4 weeks apart to allow the previous section to heal fully before continuing.' }
    ],
    seo: { title: 'Sleeve & Backpiece Tattoos Una | Noor Tattooz Studio', description: 'Comprehensive large scale tattoo projects in Una, Himachal Pradesh.' }
  },
  {
    title: 'Hyper-Realism & Portraiture',
    description: 'Photographic fidelity captured in skin. From beloved family or pet portraits to cinematic icons and chiaroscuro animal eyes, rendered with micro-tonal depth and striking life-like realism.',
    price: 7500,
    duration: '3 - 6 Hours',
    image: '/tattoos/realism-portrait.jpg',
    faqs: [
      { q: 'What photo reference works best?', a: 'High-resolution, well-lit photographs with clear natural contrast and sharp details produce the most dramatic realism.' }
    ],
    seo: { title: 'Realistic Tattoos & Portraits | Noor Tattooz Studio', description: 'Hyper-realistic black & grey and color portrait tattoos.' }
  },
  {
    title: 'Cover-Up & Scar Camouflage Art',
    description: 'Transform old, faded tattoos, unwanted ink, or surgical/burn scars into breathtaking new art. Our master artists use strategic contrast, organic flow, and deep textural elements for seamless coverage.',
    price: 6000,
    duration: '2 - 5 Hours',
    image: '/tattoos/blackwork-gothic.jpg',
    faqs: [
      { q: 'Do I need laser removal first?', a: 'In 85% of cases, laser is NOT needed. We design strategically around existing dark areas to integrate them seamlessly.' },
      { q: 'How old does a scar need to be?', a: 'Scars must be fully matured and healed (typically at least 12-18 months old and flat/pale).' }
    ],
    seo: { title: 'Tattoo Cover-Up & Scar Camouflage | Noor Tattooz Studio', description: 'Expert cover-up transformations and medical scar camouflaging.' }
  },
  {
    title: 'Private Studio Consultation',
    description: 'Meet with your chosen artist over artisanal coffee in our private design lounge. Discuss concepts, review references, measure placement, receive direct sizing advice, and get an exact quote with zero obligation.',
    price: 0,
    duration: '30 - 45 Minutes',
    image: '/tattoos/studio-interior.jpg',
    faqs: [
      { q: 'Is the consultation really free?', a: 'Yes! We believe great art begins with clear alignment. Consultations are 100% complimentary.' },
      { q: 'Can consultations be done virtually?', a: 'Yes, for out-of-town or international clients, we offer Google Meet or WhatsApp video consultations.' }
    ],
    seo: { title: 'Free Tattoo Consultation | Noor Tattooz Studio Una', description: 'Book a free 1-on-1 consultation with our resident tattoo artists.' }
  }
];

const createdServices = await M.Service.create(servicesData);
console.log(`✓ Created ${createdServices.length} studio services`);

// 6. Gallery Items - Featuring authentic studio works from Noor Tattooz Studio Una
const galleryData = [
  {
    title: 'Custom Forearm Black & Grey Masterpiece',
    image: '/tattoos/noor-una/original-tattoo-1.jpg',
    imageAlt: 'Original sleeve tattoo crafted at Noor Tattooz Studio Una',
    category: 'Sleeve',
    style: 'Realism',
    placement: 'Forearm & Wrist',
    artist: noor._id,
    description: 'Authentic in-studio custom piece crafted at Noor Tattooz Studio Una. Rich black & grey tonal gradients, crisp contours, and immaculate anatomical flow on living skin.',
    tags: ['NoorOriginal', 'Sleeve', 'Realism', 'BlackAndGrey', 'Forearm', 'UnaTattoo'],
    featured: true
  },
  {
    title: 'High-Contrast Realism Studio Inking',
    image: '/tattoos/noor-una/original-tattoo-2.jpg',
    imageAlt: 'Authentic high-contrast custom tattoo on skin by Noor Tattooz Studio',
    category: 'Realism',
    style: 'Realism',
    placement: 'Arm & Bicep',
    artist: noor._id,
    description: 'Original studio work by Noor Tattooz Studio in Prem Nagar, Una. High-contrast charcoal washes balanced with natural skin highlights.',
    tags: ['NoorOriginal', 'Realism', 'BlackAndGrey', 'Bicep', 'UnaTattoo'],
    featured: true
  },
  {
    title: 'Vertical Forearm Narrative Piece',
    image: '/tattoos/noor-una/original-tattoo-3.jpg',
    imageAlt: 'Custom forearm tattoo executed at Noor Tattooz Studio Una',
    category: 'Custom Designs',
    style: 'Custom Designs',
    placement: 'Inner & Outer Forearm',
    artist: noor._id,
    description: 'Bespoke narrative forearm tattoo crafted at Noor Tattooz Studio Una. Precision line control, delicate stippling, and long-lasting healed definition.',
    tags: ['NoorOriginal', 'CustomDesigns', 'Forearm', 'Linework', 'UnaTattoo'],
    featured: true
  },
  {
    title: 'Bespoke Chest & Shoulder Custom Concept',
    image: '/tattoos/noor-una/original-tattoo-4.jpg',
    imageAlt: 'Original chest and shoulder tattoo work by Noor Tattooz Studio Una',
    category: 'Spiritual',
    style: 'Spiritual',
    placement: 'Chest & Shoulder',
    artist: noor._id,
    description: 'Original custom client tattoo executed at Noor Tattooz Studio Una. Symmetrical anatomical alignment with deep rich carbon pigments.',
    tags: ['NoorOriginal', 'Spiritual', 'Chest', 'Shoulder', 'UnaTattoo'],
    featured: true
  },
  {
    title: 'Precision Script & Calligraphy Piece',
    image: '/tattoos/noor-una/original-tattoo-5.jpg',
    imageAlt: 'Original single-needle script tattoo by Noor Tattooz Studio Una',
    category: 'Lettering',
    style: 'Fine Line',
    placement: 'Forearm & Wrist',
    artist: noor._id,
    description: 'Crisp single-pass lettering tattoo done at Noor Tattooz Studio Una with micro-needle precision and razor-sharp curves.',
    tags: ['NoorOriginal', 'Lettering', 'FineLine', 'Calligraphy', 'Script'],
    featured: true
  },
  {
    title: 'Sacred Geometric Mandala Sleeve',
    image: '/tattoos/geometric-sleeve.jpg',
    imageAlt: 'Intricate sacred geometry tattoo sleeve on forearm',
    category: 'Geometric',
    style: 'Geometric',
    placement: 'Outer Forearm & Elbow',
    artist: noor._id,
    description: 'An anatomically calculated forearm sleeve incorporating sacred geometry lattices, fibonacci spirals, and micro-dotwork shading. Completed across two 5-hour sessions.',
    tags: ['SacredGeometry', 'Mandala', 'Dotwork', 'Sleeve', 'Blackwork'],
    featured: true
  },
  {
    title: 'Ethereal Fern & Wildflower Micro-Piece',
    image: '/tattoos/fineline-botanical.jpg',
    imageAlt: 'Delicate single needle botanical wildflower tattoo on collarbone',
    category: 'Fine Line',
    style: 'Fine Line',
    placement: 'Collarbone',
    artist: aanya._id,
    description: 'Single-needle botanical study of forest ferns and mountain wildflowers along the collarbone contour. Uses 0301 tight bugpin needles for gossamer lightness.',
    tags: ['FineLine', 'Botanical', 'Minimalist', 'SingleNeedle', 'Floral'],
    featured: true
  },
  {
    title: 'Modern Japanese Irezumi Dragon',
    image: '/tattoos/japanese-dragon.jpg',
    imageAlt: 'Traditional Japanese dragon tattoo sleeve on skin',
    category: 'Japanese',
    style: 'Japanese',
    placement: 'Upper Arm & Shoulder',
    artist: vikram._id,
    description: 'Modern take on traditional Japanese dragon (Ryu) swirling through ceremonial peonies and wind bars. Rich sumi black tones contrasted with sharp negative space.',
    tags: ['Irezumi', 'JapaneseTattoo', 'Dragon', 'Peony', 'Blackwork'],
    featured: true
  },
  {
    title: 'Hyper-Realistic Portrait Study',
    image: '/tattoos/realism-portrait.jpg',
    imageAlt: 'Hyper-realistic black and grey tattoo portrait on skin',
    category: 'Portrait',
    style: 'Realism',
    placement: 'Inner Bicep',
    artist: zara._id,
    description: 'Hyper-realistic chiaroscuro black and grey portrait with photographic depth, velvet smooth skin tones, and lifelike eye reflection.',
    tags: ['Realism', 'Portrait', 'Chiaroscuro', 'BlackAndGrey'],
    featured: true
  },
  {
    title: 'Minimalist Fine Line Script & Celestial',
    image: '/tattoos/minimalist-script.jpg',
    imageAlt: 'Minimalist fine line script tattoo on skin',
    category: 'Minimalist',
    style: 'Minimalist',
    placement: 'Ribcage & Side Torso',
    artist: aanya._id,
    description: 'Delicate micro-script typography and fine celestial line markers created with microscopic single-needle precision.',
    tags: ['Minimalist', 'FineLine', 'Script', 'Calligraphy', 'Lettering'],
    featured: true
  },
  {
    title: 'Brutalist Gothic Blackwork Arch',
    image: '/tattoos/blackwork-gothic.jpg',
    imageAlt: 'Dark gothic architectural blackwork tattoo on skin',
    category: 'Black & Grey',
    style: 'Blackwork',
    placement: 'Calf & Shin',
    artist: noor._id,
    description: 'Intricate architectural gothic cathedral arches with heavy saturated Dynamic Black contrast and negative space geometry.',
    tags: ['Gothic', 'Blackwork', 'Architecture', 'DarkArt', 'BlackAndGrey'],
    featured: true
  },
  {
    title: 'Neo-Traditional Golden Lotus & Dagger',
    image: '/tattoos/neotrad-dagger.jpg',
    imageAlt: 'Neo-traditional ornate dagger and floral tattoo on skin',
    category: 'Neo-Traditional',
    style: 'Neo-Traditional',
    placement: 'Thigh',
    artist: vikram._id,
    description: 'Ornate antique dagger piercing an auspicious blooming lotus. Bold varying line weights paired with velvet charcoal gradients.',
    tags: ['NeoTraditional', 'Lotus', 'Dagger', 'Ornamental'],
    featured: false
  },
  {
    title: 'Delicate Micro Botanical Wildflower',
    image: '/tattoos/floral-delicate.jpg',
    imageAlt: 'Delicate floral botanical tattoo on skin',
    category: 'Floral',
    style: 'Fine Line',
    placement: 'Wrist & Forearm',
    artist: zara._id,
    description: 'Graceful fine-line floral composition hugging the forearm contour. Feathery shading with seamless skin blend.',
    tags: ['FineLine', 'Floral', 'Botanical', 'Delicate'],
    featured: false
  },
  {
    title: 'Sacred Mandala Dotwork Composition',
    image: '/tattoos/sacred-mandala.jpg',
    imageAlt: 'Sacred mandala dotwork tattoo on skin',
    category: 'Mandala',
    style: 'Geometric',
    placement: 'Shoulder Blade / Upper Back',
    artist: noor._id,
    description: 'High-precision dotwork mandala centered with sacred geometric rings and micro-stippled gradations.',
    tags: ['Mandala', 'Dotwork', 'SacredGeometry', 'Geometric', 'Spiritual'],
    featured: false
  },
  {
    title: 'Micro-Celestial Alignment & Constellation',
    image: '/tattoos/micro-celestial.jpg',
    imageAlt: 'Micro-celestial single needle tattoo on wrist',
    category: 'Spiritual',
    style: 'Minimalist',
    placement: 'Inner Wrist',
    artist: aanya._id,
    description: 'Microscopic single-needle constellation and celestial alignment on inner wrist. Ultra-crisp healed permanence.',
    tags: ['MicroRealism', 'Celestial', 'SingleNeedle', 'Delicate', 'Spiritual'],
    featured: false
  },
  {
    title: 'Classical Chiaroscuro Sculpture Study',
    image: '/tattoos/realism-portrait.jpg',
    imageAlt: 'Classical sculpture realism tattoo on skin',
    category: 'Realism',
    style: 'Realism',
    placement: 'Shoulder & Tricep',
    artist: noor._id,
    description: 'Renaissance marble sculpture study rendered with multi-tone charcoal washes and high-contrast dramatic illumination.',
    tags: ['Realism', 'Sculpture', 'Chiaroscuro', 'BlackAndGrey'],
    featured: false
  },
  {
    title: 'Organic Abstract Fluid Flow Composition',
    image: '/tattoos/blackwork-gothic.jpg',
    imageAlt: 'Abstract flowing blackwork tattoo on back',
    category: 'Abstract',
    style: 'Blackwork',
    placement: 'Spine & Ribs',
    artist: vikram._id,
    description: 'Fluid brushwork and gestural abstract blackwork following the natural curvature of the spine and thoracic cage.',
    tags: ['Abstract', 'Fluid', 'Brushwork', 'Blackwork'],
    featured: false
  },
  {
    title: 'Traditional Rose & Crest Motif',
    image: '/tattoos/neotrad-dagger.jpg',
    imageAlt: 'Classic traditional American rose and scroll tattoo',
    category: 'Traditional',
    style: 'Traditional',
    placement: 'Forearm',
    artist: vikram._id,
    description: 'Heavy bold linework, solid black fields, and timeless heraldic composition built to age immaculately.',
    tags: ['Traditional', 'OldSchool', 'Rose', 'Heraldic'],
    featured: false
  },
  {
    title: 'Custom Anatomical Camouflage Artwork',
    image: '/tattoos/tattoo-craft.jpg',
    imageAlt: 'Custom bespoke tattoo design mapped to skin',
    category: 'Custom Designs',
    style: 'Custom Designs',
    placement: 'Full Shoulder & Bicep',
    artist: noor._id,
    description: 'A completely bespoke narrative piece engineered to conceal childhood surgical marks with organic, living geometry.',
    tags: ['CustomDesigns', 'Bespoke', 'CoverUp', 'Camouflage'],
    featured: true
  }
];

const createdGallery = await M.Gallery.create(galleryData);
console.log(`✓ Created ${createdGallery.length} gallery artworks`);

// 7. Testimonials - Verified Google Maps 5.0 Star Reviews from Una Clients
const testimonialsData = [
  {
    name: 'Sahil Sharma',
    rating: 5,
    message: 'Best tattoo studio in Una without any doubt! Got a detailed custom sleeve done here. The hygiene is top notch — brand new sealed needles opened right in front of me, and the detailing on the shading came out even better than the stencil. Highly recommended!',
    featured: true
  },
  {
    name: 'Ankush Thakur',
    rating: 5,
    message: 'Best tattoo artist in Una, Himachal Pradesh. Very polite and humble nature. He guided me patiently on placement, design choices, and aftercare. The tattoo healed super clean with no fading. 5 stars without any hesitation!',
    featured: true
  },
  {
    name: 'Pooja Jaswal',
    rating: 5,
    message: 'Got my first fine line tattoo at Noor Tattooz Studio near Sabji Mandi, Prem Nagar. The artist was so gentle and professional, virtually painless experience. The studio is spotless clean and peaceful.',
    featured: true
  },
  {
    name: 'Rohit Choudhary',
    rating: 5,
    message: 'Undoubtedly the premier tattoo parlor on Una Amb Road. Got a custom religious portrait on my forearm; precision and ink depth is unmatched. Genuine rates and sterile, hospital-grade hygiene.',
    featured: true
  },
  {
    name: 'Vikas Verma',
    rating: 5,
    message: 'Visited Noor Tattooz Studio for a cover-up tattoo. He completely transformed my old blurred tattoo into an amazing dark blackwork masterpiece. Very skilled hand and creative mind.',
    featured: true
  },
  {
    name: 'Manish Saini',
    rating: 5,
    message: 'Awesome experience at Noor Tattooz Una. Great work, hygienic equipment, affordable price and very friendly behavior. Definitely coming back for my next piece!',
    featured: true
  }
];

const createdTestimonials = await M.Testimonial.create(testimonialsData);
console.log(`✓ Created ${createdTestimonials.length} verified testimonials`);

// 8. Studio FAQs
const faqsData = [
  {
    question: 'What are your hygiene and sterilization protocols?',
    answer: 'We maintain hospital-grade sanitation standards. All needles are single-use, sterile blister-packed, and discarded in biohazard sharps containers in front of you. Every workstation undergoes ultrasonic hospital disinfection with medical barriers replaced between each client. Our artists hold international bloodborne pathogen certifications.',
    category: 'Hygiene & Safety',
    published: true
  },
  {
    question: 'How do you determine tattoo pricing?',
    answer: 'Pricing is based on design complexity, scale, anatomical placement, and artist specialization. Every piece is estimated transparently upfront directly on WhatsApp or during your studio consultation, with zero hidden fees.',
    category: 'Pricing & Bookings',
    published: true
  },
  {
    question: 'Does getting a tattoo hurt, and can I use numbing cream?',
    answer: 'Pain levels vary depending on body placement and individual tolerance. Fleshy areas like outer arms, thighs, and shoulders are very manageable (resembling light cat scratches), while ribs, spine, and ankles are more sensitive. We generally discourage commercial over-the-counter numbing creams because they alter skin texture and elasticity, leading to inferior healed ink retention. Our artists use specialized gentle techniques and soothing witch hazel washes to keep you comfortable.',
    category: 'The Experience',
    published: true
  },
  {
    question: 'How do I prepare for my tattoo appointment?',
    answer: '1. Get a full night of restful sleep.\n2. Eat a hearty, balanced meal 1-2 hours before arriving to maintain stable blood sugar.\n3. Drink plenty of water in the 48 hours leading up to your session; hydrated skin takes ink significantly better.\n4. Wear loose, dark, comfortable clothing providing easy access to the tattoo site.\n5. Avoid alcohol, aspirin, and blood thinners for at least 24 hours prior.',
    category: 'Preparation',
    published: true
  },
  {
    question: 'What is your complete aftercare recommendation?',
    answer: 'We apply a medical-grade breathable dermal shield (Second Skin / Saniderm) that stays on for 3 to 5 days. Once removed under warm running water, gently wash with fragrance-free antibacterial soap, pat dry with a clean paper towel, and apply a paper-thin layer of our recommended vegan tattoo balm 2-3 times daily. Avoid submerging in water (swimming, baths), direct sun exposure, and excessive sweating for 14 days.',
    category: 'Aftercare & Healing',
    published: true
  },
  {
    question: 'Do you offer free touch-ups?',
    answer: 'Yes! We stand firmly behind our art. All tattoos done at Noor Tattoo Studio come with one complimentary touch-up within 60 days of your original appointment once your piece has fully healed, ensuring your ink looks crisp and vibrant for a lifetime.',
    category: 'Aftercare & Healing',
    published: true
  },
  {
    question: 'Can you cover up or rework an old tattoo or scar?',
    answer: 'Absolutely. We specialize in scar camouflage and advanced cover-up transformations. During your consultation, we assess skin texture, pigmentation depth, and design an organic flow that works with your existing anatomy rather than fighting it.',
    category: 'Art & Design',
    published: true
  },
  {
    question: 'What is your deposit and cancellation policy?',
    answer: 'To secure your session date and initiate custom illustration drafting, a standard appointment deposit (tailored to project scale) is required. Deposits are fully deducted from your final session payment. We require at least 48 hours notice to reschedule your appointment without forfeiting your deposit.',
    category: 'Pricing & Bookings',
    published: true
  }
];

const createdFAQs = await M.FAQ.create(faqsData);
console.log(`✓ Created ${createdFAQs.length} FAQs`);

// 9. Expert Blog Posts
const blogPostsData = [
  {
    title: 'The Comprehensive Tattoo Aftercare Manual: 30-Day Stage-by-Stage Healing',
    excerpt: 'A master guide from our resident artists on what to expect during days 1 through 30 of tattoo healing, from second-skin removal to long-term SPF preservation.',
    content: `A tattoo is a collaboration between artist and client: our work is only half complete when you leave the chair. The remaining 50% of your tattoo outcome is determined by your healing discipline over the following month.

### Phase 1: Days 1 to 4 (The Dermal Shield)
We apply a medical-grade polyurethane film (Saniderm / SecondSkin). This breathable barrier allows oxygen to reach the skin while sealing in your body natural plasma and healing fluids, preventing scab formation and bacterial contamination.
- Do NOT puncture or drain fluid accumulation; this is natural plasma that accelerates dermal regeneration.
- If fluid leaks out or edges peel exposing the tattoo, gently peel the film under lukewarm running water and proceed to Phase 2.

### Phase 2: Days 5 to 14 (Washing & Hydration)
- Wash 2-3 times daily with lukewarm water and a gentle, fragrance-free cleanser (e.g. Cetaphil or mild Castile soap).
- Never scrub with a washcloth or loofah; use clean hands only.
- Pat completely dry with a single-use paper towel. Never rub with a bath towel.
- Apply a microscopic layer of organic, fragrance-free aftercare ointment. The golden rule: "Less is more." Skin must breathe — over-moisturizing causes clogged pores and ink fallout.

### Phase 3: Days 15 to 30 (Peeling & The Silver Skin)
Around day 7-10, your tattoo will begin light flaking, similar to sunburn peeling.
- NEVER scratch, pick, or peel the flakes. Doing so pulls pigment out of the dermis, creating permanent light spots.
- If itching becomes intense, gently slap the area with clean hands or apply a cool, clean damp compress.
- A translucent "silver skin" layer will remain for another week or two before true matte clarity settles in.

### Long-Term Longevity: The SPF Imperative
Sunlight is the primary enemy of tattoo pigments. UV rays break down pigment granules, causing dispersion and fading. Once past the 4-week mark, apply mineral SPF 50+ sunscreen whenever your tattoo is exposed to daylight.`,
    featuredImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
    author: 'Noor',
    category: 'Aftercare',
    tags: ['Aftercare', 'Healing', 'SkinCare', 'Tips'],
    published: true,
    publishedAt: new Date(Date.now() - 7 * 864e5),
    seo: {
      title: 'Tattoo Aftercare Guide | Noor Tattooz Studio Una',
      description: 'Day-by-day healing manual for fine line, realism, and blackwork tattoos.'
    }
  },
  {
    title: 'Fine Line & Single-Needle Tattoos: Debunking Aging & Longevity Myths',
    excerpt: 'Do fine line tattoos fade prematurely? Here is the scientific truth behind single-needle depth, pigment retention, and how to guarantee your micro-ink stays crisp forever.',
    content: `Fine line and single-needle tattoos have surged in global popularity, yet they remain subject to skepticism: "Will it blur into a smudge in five years?" "Do single lines fade away?"

As a studio that specializes in single-needle botanical and micro-realism art, here is the technical reality of why fine line tattoos age beautifully when executed correctly.

### The Physics of Single-Needle Tattooing
Standard tattoo outlines use groupings of 3 to 14 needles soldered together (3RL, 7RL). In contrast, single-needle tattooing (01RL / 0301 Bugpin) utilizes a solitary microneedle measuring merely 0.25mm to 0.30mm in diameter.
This micro-point delivers pigment into the papillary dermis with surgical accuracy, minimizing epidermal tearing and secondary inflammatory response.

### Why Some Fine Line Tattoos "Blow Out" or "Disappear"
When a fine line tattoo ages poorly, it is invariably due to one of two amateur errors:
1. **Shallow Depth:** The ink was deposited only into the epidermis (the surface layer), which naturally exfoliates every 28 days, causing the line to vanish within months.
2. **Excessive Depth:** The needle penetrated into the subcutaneous fat layer, causing ink to disperse laterally into the tissue (known as a "blowout").

At Noor Tattoo Studio, our artists train for years specifically in tactile needle depth feedback, ensuring every stroke locks into the target dermal sweet spot.

### Crucial Placement Considerations
Not all skin areas are created equal for fine line tattoos:
- **Prime Locations:** Forearms, biceps, ribs, calves, collarbones, and back. These areas maintain steady cell turnover and moderate friction.
- **High-Risk Locations:** Fingers, palms, and sides of feet. The epidermal layer here is up to 5x thicker and experiences rapid friction, requiring frequent touch-ups.

### Summary
Single-needle work does not disappear if your artist possesses the requisite technical control. Treat your skin well, hydrate, protect from UV, and your delicate ink will remain a sharp, elegant part of your body forever.`,
    featuredImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
    author: 'Aanya Sen',
    category: 'Artistry',
    tags: ['FineLine', 'SingleNeedle', 'TattooMyths', 'Design'],
    published: true,
    publishedAt: new Date(Date.now() - 14 * 864e5),
    seo: {
      title: 'Fine Line Tattoos: Aging and Longevity Explained',
      description: 'The science behind fine line tattoo durability and proper technique.'
    }
  },
  {
    title: 'How to Prepare Physically & Mentally for an All-Day Tattoo Session',
    excerpt: 'Surviving a 6 to 8 hour sleeve or backpiece session requires more than just willpower. Discover our studio checklist for nutrition, hydration, breathing, and comfort.',
    content: `Committing to an all-day tattoo session is a physical marathon. When your body is subjected to needle vibration and continuous stimulation for six to eight hours, your nervous system releases adrenaline, endorphins, and eventually experiences energy depletion.

Preparation begins 48 hours before you sit in our studio chair.

### 48 Hours Prior: Hydration & Skin Prep
- Drink at least 3 liters of water daily. Well-hydrated skin cells are supple, take ink with ease, and bleed noticeably less.
- Moisturize the target area twice daily with a neutral lotion.
- Do NOT sunbathe or get sunburned. We cannot tattoo compromised or peeling skin.

### 24 Hours Prior: What to Avoid
- **Zero Alcohol:** Alcohol thins the blood, exacerbates bleeding during the session, and disrupts your sleep cycle.
- **No Blood Thinners:** Avoid aspirin, ibuprofen, or energy drinks loaded with excessive caffeine.
- **Rest:** Get 8+ hours of uninterrupted sleep. Fatigue dramatically lowers pain tolerance.

### Appointment Day: Fueling Up
- Eat a substantial, carb-and-protein-rich meal 90 minutes before your appointment (oats, eggs, bananas, brown rice). Tattoos burn calories rapidly as your muscles tense and metabolize stress.
- Pack healthy snacks: dark chocolate, almonds, dried fruit, electrolyte water.
- Wear loose, dark clothes that won't show stray ink drops and can be easily unbuttoned or rolled up.

### During the Chair: The Power of Breathing
When a painful pass occurs (near bones or tendons), our natural reaction is to hold our breath and clench our teeth. This spikes blood pressure and intensifies pain signals.
Instead, practice diaphragmatic breathing: deep 4-second inhalation through the nose, slow 6-second exhale through the mouth as the needle touches down.

Remember, you are always in control at Noor Tattoo Studio. If you need 5 minutes to stretch, drink water, or use the restroom, just say the word!`,
    featuredImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    author: 'Vikram "Vex" Malhotra',
    category: 'Guide',
    tags: ['Preparation', 'Sleeve', 'PainManagement', 'StudioExperience'],
    published: true,
    publishedAt: new Date(Date.now() - 21 * 864e5),
    seo: {
      title: 'How to Prepare for an All-Day Tattoo Session',
      description: 'Physical and mental prep guide for large scale tattoos and sleeves.'
    }
  },
  {
    title: 'The Philosophy of Permanent Art: Finding Personal Meaning in Modern Ink',
    excerpt: 'Why do we mark our skin in an ephemeral world? Exploring the timeless bridge between identity, memory, healing, and self-expression through custom tattoo design.',
    content: `Since the dawn of human civilization — from Ötzi the Iceman to ancient Polynesian wayfinders — humans have etched permanent symbols into their skin. In an era where almost everything in modern life is digital, transient, and disposable, a tattoo remains one of the few irrevocable decisions you can make.

At Noor Tattoo Studio, we consider the tattoo needle not merely an instrument of decor, but an instrument of reclamation.

### Tattoos as Markers of Evolution
Many of our clients come to mark milestones: surviving an illness, honoring ancestors, celebrating births, or closing chapters of grief. Transforming an abstract internal emotion into a visible, physical talisman provides profound psychological closure.

### Moving Beyond Pinterest Copies
The rise of internet image boards has made tattoo imagery ubiquitous. However, simply copying a trending design from social media often leads to future regret.
When you book a custom piece with us, we urge you to think about:
- **The Core Feeling:** What emotion or reminder should this piece evoke when you glance at it 20 years from today?
- **Anatomical Flow:** How does the artwork complement the natural curve of your shoulder blade or forearm muscle? A great tattoo should look like it grew out of your skin, rather than being pasted on top.

### The Sacred Collaboration
A great tattoo is born through trust between client and artist. Bring your memories, your fragments, and your raw ideas. Let us bring composition, longevity, balance, and illumination. That is the essence of Noor.`,
    featuredImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    author: 'Noor',
    category: 'Philosophy',
    tags: ['Philosophy', 'CustomDesign', 'Art', 'Identity'],
    published: true,
    publishedAt: new Date(Date.now() - 30 * 864e5),
    seo: {
      title: 'The Philosophy of Tattoo Art | Noor Tattooz Studio',
      description: 'Exploring custom tattoo design as personal meaning and enduring self-expression in Una, Himachal Pradesh.'
    }
  }
];

const createdPosts = await M.BlogPost.create(blogPostsData);
console.log(`✓ Created ${createdPosts.length} expert blog posts`);

console.log('\n=============================================');
console.log('🎉 SEEDING COMPLETE: NOOR TATTOO STUDIO IS FULLY LOADED');
console.log('=============================================');
process.exit(0);
