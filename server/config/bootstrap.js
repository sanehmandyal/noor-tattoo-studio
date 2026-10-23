import bcrypt from 'bcryptjs';
import * as M from '../models/index.js';

export const ensureSuperAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@noortattoo.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@NoorTattoo2026!';
    let admin = await M.User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await M.User.findOne({ role: 'super_admin' });
    }

    if (!admin) {
      await M.User.create({
        name: 'Noor (Founder)',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: 'super_admin',
        status: 'active'
      });
      console.log(`✓ Created Super Admin user: ${adminEmail}`);
    } else {
      admin.email = adminEmail;
      admin.status = 'active';
      admin.role = 'super_admin';
      admin.password = await bcrypt.hash(adminPassword, 12);
      await admin.save();
      console.log(`✓ Synchronized Super Admin credentials for: ${adminEmail}`);
    }
  } catch (e) {
    console.error('Super admin setup error:', e);
  }
};

export const autoSeedIfEmpty = async () => {
  try {
    // Always guarantee super admin exists and credentials are valid
    await ensureSuperAdmin();

    const settingsCount = await M.Settings.countDocuments({ key: 'main' });
    const artistsCount = await M.Artist.countDocuments();

    // If database already contains data, do not overwrite anything
    if (settingsCount > 0 && artistsCount > 0) {
      return;
    }

    console.log('Database is empty or missing initial data. Initializing production defaults...');

    // 1. Studio Settings
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

    // 2. Super Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@noortattoo.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@NoorTattoo2026!';
    const existingAdmin = await M.User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await M.User.create({
        name: 'Noor (Founder)',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: 'super_admin',
        status: 'active'
      });
    }

    // 3. Resident Artists
    let createdArtists = await M.Artist.find();
    if (createdArtists.length < 4) {
      await M.Artist.deleteMany({ name: 'Demo Artist' });
      const masterArtists = [
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
      for (const a of masterArtists) {
        await M.Artist.findOneAndUpdate({ name: a.name }, a, { upsert: true, new: true });
      }
      createdArtists = await M.Artist.find();
    }

    const noor = createdArtists.find(a => a?.name?.includes('Noor')) || createdArtists[0];
    const aanya = createdArtists.find(a => a?.name?.includes('Aanya')) || createdArtists[1] || noor;
    const vikram = createdArtists.find(a => a?.name?.includes('Vikram')) || createdArtists[2] || noor;
    const zara = createdArtists.find(a => a?.name?.includes('Zara')) || createdArtists[3] || noor;

    // 4. Studio Services
    if ((await M.Service.countDocuments()) === 0) {
      await M.Service.create([
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
          seo: { title: 'Custom Tattoo Design | Noor Tattooz Studio', description: 'Handcrafted bespoke tattoos tailored to your anatomy and story.' }
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
      ]);
    }

    // 5. Gallery Artworks (Including 5 authentic studio tattoos)
    if ((await M.Gallery.countDocuments()) === 0) {
      await M.Gallery.create([
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
      ]);
    }

    // 6. Testimonials (5.0 Google Reviews)
    if ((await M.Testimonial.countDocuments()) === 0) {
      await M.Testimonial.create([
        {
          name: 'Sahil Sharma',
          rating: 5,
          service: 'Custom Realism Sleeve',
          location: 'Una, Himachal Pradesh',
          verified: true,
          source: 'Google Maps Review',
          message: 'Best tattoo studio in Una without any doubt! Got a detailed custom sleeve done here. The hygiene is top notch — brand new sealed needles opened right in front of me, and the detailing on the shading came out even better than the stencil. Highly recommended!',
          featured: true
        },
        {
          name: 'Ankush Thakur',
          rating: 5,
          service: 'Custom Chest & Arm Art',
          location: 'Una, Himachal Pradesh',
          verified: true,
          source: 'Google Maps Review',
          message: 'Best tattoo artist in Una, Himachal Pradesh. Very polite and humble nature. He guided me patiently on placement, design choices, and aftercare. The tattoo healed super clean with no fading. 5 stars without any hesitation!',
          featured: true
        },
        {
          name: 'Pooja Jaswal',
          rating: 5,
          service: 'Fine Line Botanical',
          location: 'Prem Nagar, Una',
          verified: true,
          source: 'Google Maps Review',
          message: 'Got my first fine line tattoo at Noor Tattooz Studio near Sabji Mandi, Prem Nagar. The artist was so gentle and professional, virtually painless experience. The studio is spotless clean and peaceful.',
          featured: true
        },
        {
          name: 'Rohit Choudhary',
          rating: 5,
          service: 'Forearm Religious Portrait',
          location: 'Una Amb Road',
          verified: true,
          source: 'Google Maps Review',
          message: 'Undoubtedly the premier tattoo parlor on Una Amb Road. Got a custom religious portrait on my forearm; precision and ink depth is unmatched. Genuine rates and sterile, hospital-grade hygiene.',
          featured: true
        },
        {
          name: 'Vikas Verma',
          rating: 5,
          service: 'Blackwork Cover-Up Masterpiece',
          location: 'Una, Himachal Pradesh',
          verified: true,
          source: 'Google Maps Review',
          message: 'Visited Noor Tattooz Studio for a cover-up tattoo. He completely transformed my old blurred tattoo into an amazing dark blackwork masterpiece. Very skilled hand and creative mind.',
          featured: true
        },
        {
          name: 'Manish Saini',
          rating: 5,
          service: 'Geometric Forearm Tattoo',
          location: 'Una, Himachal Pradesh',
          verified: true,
          source: 'Google Maps Review',
          message: 'Awesome experience at Noor Tattooz Una. Great work, hygienic equipment, affordable price and very friendly behavior. Definitely coming back for my next piece!',
          featured: true
        }
      ]);
    }

    // 7. FAQs
    if ((await M.FAQ.countDocuments()) === 0) {
      await M.FAQ.create([
        {
          question: 'What are your hygiene and sterilization protocols?',
          answer: 'We maintain hospital-grade sanitation standards. All needles are single-use, sterile blister-packed, and discarded in biohazard sharps containers in front of you. Every workstation undergoes ultrasonic hospital disinfection with medical barriers replaced between each client.',
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
          answer: 'Pain levels vary depending on body placement and individual tolerance. Fleshy areas like outer arms, thighs, and shoulders are very manageable (resembling light cat scratches), while ribs, spine, and ankles are more sensitive. Our artists use specialized gentle techniques and soothing witch hazel washes to keep you comfortable.',
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
          answer: 'We apply a medical-grade breathable dermal shield (Second Skin / Saniderm) that stays on for 3 to 5 days. Once removed under warm running water, gently wash with fragrance-free antibacterial soap, pat dry with a clean paper towel, and apply a paper-thin layer of our recommended vegan tattoo balm 2-3 times daily.',
          category: 'Aftercare & Healing',
          published: true
        },
        {
          question: 'Do you offer free touch-ups?',
          answer: 'Yes! All tattoos done at Noor Tattoo Studio come with one complimentary touch-up within 60 days of your original appointment once your piece has fully healed, ensuring your ink looks crisp and vibrant for a lifetime.',
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
      ]);
    }

    // 8. Blog Posts
    if ((await M.BlogPost.countDocuments()) === 0) {
      await M.BlogPost.create([
        {
          title: 'The Comprehensive Tattoo Aftercare Manual: 30-Day Stage-by-Stage Healing',
          excerpt: 'A master guide from our resident artists on what to expect during days 1 through 30 of tattoo healing, from second-skin removal to long-term SPF preservation.',
          content: 'A tattoo is a collaboration between artist and client: our work is only half complete when you leave the chair. The remaining 50% of your tattoo outcome is determined by your healing discipline over the following month.\n\n### Phase 1: Days 1 to 4 (The Dermal Shield)\nWe apply a medical-grade polyurethane film (Saniderm / SecondSkin). This breathable barrier allows oxygen to reach the skin while sealing in your body natural plasma and healing fluids, preventing scab formation and bacterial contamination.\n\n### Phase 2: Days 5 to 14 (Washing & Hydration)\nWash 2-3 times daily with lukewarm water and a gentle, fragrance-free cleanser. Pat completely dry with a single-use paper towel. Never rub with a bath towel.\n\n### Phase 3: Days 15 to 30 (Peeling & The Silver Skin)\nAround day 7-10, your tattoo will begin light flaking. Never scratch or peel the flakes.',
          featuredImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
          author: 'Noor',
          category: 'Aftercare',
          tags: ['Aftercare', 'Healing', 'SkinCare', 'Tips'],
          published: true,
          publishedAt: new Date(),
          seo: {
            title: 'Tattoo Aftercare Guide | Noor Tattooz Studio Una',
            description: 'Day-by-day healing manual for fine line, realism, and blackwork tattoos.'
          }
        },
        {
          title: 'Fine Line & Single-Needle Tattoos: Debunking Aging & Longevity Myths',
          excerpt: 'Do fine line tattoos fade prematurely? Here is the scientific truth behind single-needle depth, pigment retention, and how to guarantee your micro-ink stays crisp forever.',
          content: 'Fine line and single-needle tattoos have surged in global popularity, yet they remain subject to skepticism: "Will it blur into a smudge in five years?" "Do single lines fade away?"\n\nAs a studio that specializes in single-needle botanical and micro-realism art, here is the technical reality of why fine line tattoos age beautifully when executed correctly.\n\nStandard tattoo outlines use groupings of 3 to 14 needles soldered together. In contrast, single-needle tattooing utilizes a solitary microneedle measuring merely 0.25mm to 0.30mm in diameter, minimizing epidermal tearing.',
          featuredImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
          author: 'Aanya Sen',
          category: 'Artistry',
          tags: ['FineLine', 'SingleNeedle', 'TattooMyths', 'Design'],
          published: true,
          publishedAt: new Date(),
          seo: {
            title: 'Fine Line Tattoos: Aging and Longevity Explained',
            description: 'The science behind fine line tattoo durability and proper technique.'
          }
        }
      ]);
    }

    // 9. Tattoo Styles
    if ((await M.TattooStyle.countDocuments()) === 0) {
      await M.TattooStyle.create([
        {
          name: 'Realism & Portraits',
          slug: 'realism',
          tag: 'Realism',
          badge: 'Photographic Depth',
          image: '/tattoos/realism-portrait.jpg',
          lead: 'Hyper-realistic black & grey and color portraiture captured with photographic fidelity and velvety chiaroscuro transitions.',
          description: 'Realism at Noor Tattooz transcends standard reproduction; it is the art of capturing soul, light, and dimension on living skin. Mastered by resident artists Kabir Noor and Zara Merchant, our realism pieces utilize multi-stage greywash dilutions paired with soft-edge curved magnums to create seamless gradients without harsh outlines.\n\nWhether immortalizing a loved one, a memory portrait, classical Renaissance sculpture, or wildlife eyes, we balance tonal depth to ensure the tattoo will not darken into a muddy mass over time. Contrast is strategically preserved with negative skin highlights so your piece remains luminous for decades.',
          specs: {
            needles: '0803 Bugpin Tight Liners, 1015 & 1217 Curved Soft Magnums',
            healingTime: '14 to 21 Days',
            painLevel: 'Mild to Moderate (Soft blending technique minimizes epidermal trauma)',
            bestPlacements: 'Inner Bicep, Outer Forearm, Calf, Shoulder Panel, Full Back'
          },
          technique: [
            'Multi-pass greywash shading calibrated across 4 distinct tone wells',
            'True-to-life light source mapping preserving chiaroscuro highlights',
            'Skin micro-texture rendering with feather-light needle strokes'
          ],
          order: 1,
          published: true
        },
        {
          name: 'Fine Line & Single-Needle',
          slug: 'fine-line',
          tag: 'Fine Line',
          badge: 'Microscopic Precision',
          image: '/tattoos/fineline-botanical.jpg',
          lead: 'Whisper-soft single-needle botanicals, architectural lines, and delicate calligraphy designed for timeless grace.',
          description: 'Pioneered by Aanya Sen, fine line tattooing at Noor Tattooz treats skin like handmade cotton rag paper. Using specialized 0301 tight bugpin needles (just 0.25mm in diameter), we deposit medical-grade carbon pigment into the upper dermal layer with surgical restraint.\n\nUnlike heavy traditional lines that spread noticeably over time, our disciplined hand speed, minimal machine voltage, and proper needle angling guarantee that lines heal as crisp, sharp, and delicate as a fountain pen stroke. Perfect for delicate wildflowers, micro-script typography, and minimalist celestial diagrams.',
          specs: {
            needles: '0301RL & 0501RL Tight Bugpins (0.20mm – 0.25mm)',
            healingTime: '7 to 10 Days (Minimal skin disruption)',
            painLevel: 'Very Low (Gentle, superficial vibration)',
            bestPlacements: 'Collarbone, Inner Wrist, Ribcage, Spine, Behind the Ear, Ankle'
          },
          technique: [
            'Single-needle controlled depth preventing ink blowout or migration',
            'Botanical accuracy drafted directly from live plant references',
            'Feathered micro-shading with zero trauma to surrounding tissue'
          ],
          order: 2,
          published: true
        },
        {
          name: 'Black & Grey / Dark Art',
          slug: 'black-and-grey',
          tag: 'Black & Grey',
          badge: 'Chiaroscuro & Drama',
          image: '/tattoos/blackwork-gothic.jpg',
          lead: 'Atmospheric gothic architecture, rich charcoal washes, and heavy contrasting shadows built for high visual impact.',
          description: 'Black & Grey is the bedrock of permanent tattooing. At Noor Tattooz, we combine European dark art traditions with modern precision needle cartridges. We avoid premixed dilute inks, custom-mixing our black washes from pure triple-black vegan pigment on the day of your session.\n\nThe result is velvety charcoal shadows, deep saturated blacks that never fade to blue or green, and clean skin highlights that give the design immense three-dimensional weight.',
          specs: {
            needles: '1007RL Lining, 1211M1 Flat Shading, 1215 Curved Mag',
            healingTime: '10 to 14 Days',
            painLevel: 'Moderate',
            bestPlacements: 'Full Sleeves, Calf & Shin, Chest Panels, Forearm'
          },
          technique: [
            'Custom 4-drop greywash gradation system',
            'Saturated deep black pigment saturation using Dynamic Triple Black',
            'Structural anatomical framing ensuring lines move naturally with muscle groups'
          ],
          order: 3,
          published: true
        },
        {
          name: 'Modern Japanese Irezumi',
          slug: 'japanese',
          tag: 'Japanese',
          badge: 'Mythological Mastery',
          image: '/tattoos/japanese-dragon.jpg',
          lead: 'Mythological Ryu dragons, swimming koi, wind bars, and ceremonial peonies engineered for grand bodily canvas.',
          description: 'Headed by Vikram "Vex" Malhotra, our Japanese Irezumi work respects the ancient rules of Horimono while embracing clean contemporary line dynamics. Japanese tattoos are composed as full stories that flow with the body—dragons ascending toward the shoulder, koi swimming against the natural river current of the arm, and clouds (Kumo) framing sacred blossoms.\n\nWe ensure that every element is culturally coherent and placed according to traditional seasonal symbolism.',
          specs: {
            needles: '1209RL & 1211RL Bold Liners, 1223 Magnum for heavy wind bars',
            healingTime: '14 to 20 Days',
            painLevel: 'Moderate to High (Extensive background coverage)',
            bestPlacements: 'Full Sleeves, 7/10 Sleeves, Torso Panels, Full Back'
          },
          technique: [
            'Traditional wind bar (Kaze) and background water flow structuring',
            'High-saturation sumi black tones contrasted with vivid negative space',
            'Mythological storytelling and authentic Horimono composition'
          ],
          order: 4,
          published: true
        },
        {
          name: 'Minimalist & Lettering',
          slug: 'minimalist',
          tag: 'Minimalist',
          badge: 'Understated Elegance',
          image: '/tattoos/minimalist-script.jpg',
          lead: 'Micro-script, personal mantras, coordinates, and subtle geometric silhouettes stripped of all excess noise.',
          description: 'Minimalism requires absolute perfection; when there are only four lines in a tattoo, every millimeter must be immaculate. Our artists use digital typography tools to customize letter kerning, baseline curvature, and micro-spacing to ensure legibility throughout a lifetime.\n\nWe specialize in bespoke script handwriting replicas, meaningful coordinates, subtle date markers, and astrological silhouettes that speak through understated elegance.',
          specs: {
            needles: '0301RL Single Needle, 0503RL Round Liner',
            healingTime: '5 to 7 Days',
            painLevel: 'Low',
            bestPlacements: 'Wrist, Ankle, Ribs, Collarbone, Behind Arm'
          },
          technique: [
            'Custom typography kerning and letter spacing',
            'Micro-needle placement that never spreads into adjacent skin',
            'Personal handwriting vectorization from family letters or notes'
          ],
          order: 5,
          published: true
        },
        {
          name: 'Sacred Geometry & Mandalas',
          slug: 'geometric',
          tag: 'Geometric',
          badge: 'Fibonacci & Symmetry',
          image: '/tattoos/geometric-sleeve.jpg',
          lead: 'Anatomical mandalas, stippled dotwork gradations, and mathematical ratios aligned to bodily symmetry.',
          description: 'Sacred geometry explores the fundamental mathematical patterns of the cosmos: the golden ratio, the seed of life, Sri Yantra, and Platonic solids. Kabir Noor maps each geometric lattice directly onto the client\'s limb or torso, calculating distortion so that circles remain true circles when you rotate your arm or flex your muscles.\n\nEvery shadow is built through individual micro-dots (stippling), creating a mesmerizing sand-mandala texture that ages with magnificent clarity.',
          specs: {
            needles: '0803RL Stippling Liner, 1005RL Structural Liner',
            healingTime: '10 to 14 Days',
            painLevel: 'Mild (Dotwork creates significantly less irritation than solid packing)',
            bestPlacements: 'Forearm Sleeves, Upper Back, Elbow, Knee, Chest Center'
          },
          technique: [
            'Mathematical compass & grid mapping calculated for 3D skin curvature',
            'Stippled dotwork shading creating soft acoustic gradients',
            'Harmonic resonance and sacred symbol accuracy'
          ],
          order: 6,
          published: true
        },
        {
          name: 'Neo-Traditional & Ornamental',
          slug: 'neo-traditional',
          tag: 'Neo-Traditional',
          badge: 'Rich Linework & Motifs',
          image: '/tattoos/neotrad-dagger.jpg',
          lead: 'Dynamic line weight hierarchy, antique daggers, gilded flora, and ornamental heraldry built to withstand the test of time.',
          description: 'Neo-Traditional merges the bold, bulletproof readability of traditional American and European tattooing with intricate modern fine art detailing. Characterized by strong bold outer outlines, delicate internal hatching, and luxurious antique ornamentation, this style looks striking from across the room while revealing intricate subtleties up close.',
          specs: {
            needles: '1209RL Outer Border, 0805RL Fine Internal Hatching, 1215 Curved Mag',
            healingTime: '12 to 16 Days',
            painLevel: 'Moderate',
            bestPlacements: 'Thigh, Outer Bicep, Forearm, Shin, Calves'
          },
          technique: [
            'Dynamic line weight variation creating dramatic depth',
            'Art Nouveau and Victorian ornamentation influences',
            'Deep contrast saturation ensuring readability for decades'
          ],
          order: 7,
          published: true
        },
        {
          name: 'Custom Concepts & Cover-Ups',
          slug: 'custom-designs',
          tag: 'Custom Designs',
          badge: 'Transformative Art',
          image: '/tattoos/tattoo-craft.jpg',
          lead: 'Transformative cover-ups, medical scar camouflaging, and bespoke multidisciplinary concepts engineered exclusively for your story.',
          description: 'No two lives are alike, and no two tattoos at Noor Tattooz are duplicated. If you have an abstract idea that crosses multiple styles—or an unwanted old tattoo or surgical scar that needs reimagining—our master artists engineer bespoke compositions.\n\nWe work with your existing skin texture and coloration, turning imperfections into features and creating transformative art that restores confidence and pride.',
          specs: {
            needles: 'Multidisciplinary custom setup',
            healingTime: '14 to 21 Days',
            painLevel: 'Varies by placement and scar tissue maturation',
            bestPlacements: 'Any body zone requiring transformation or custom storytelling'
          },
          technique: [
            'Strategic dark-to-light camouflage matrix without muddy accumulation',
            'Scar tissue evaluation ensuring gentle epidermal penetration',
            '100% original bespoke illustration created in collaboration with client'
          ],
          order: 8,
          published: true
        }
      ]);
    }

    console.log('✓ Production defaults initialized successfully!');
  } catch (error) {
    console.error('Bootstrap error (non-fatal):', error.message);
  }
};
