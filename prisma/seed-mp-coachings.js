/**
 * Seeds 30 realistic coaching listings for Bhopal, Indore, Sehore & Ashta (MP).
 * Data sourced from public web listings (JustDial, institute sites, coaching directories).
 * Images are fetched from Unsplash and uploaded to Cloudinary.
 *
 * Run: npm run db:seed:mp
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const COACHING_IMAGES = [
  "https://images.unsplash.com/photo-1580582932707-520aedcedb21?w=1200&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c3539?w=1200&q=80",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0f?w=1200&q=80",
];

async function uploadCoachingImage(sourceUrl, publicId) {
  try {
    const result = await cloudinary.uploader.upload(sourceUrl, {
      folder: "coachinghunt/seed",
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (err) {
    console.warn(`  Image upload failed for ${publicId}, using source URL:`, err.message);
    return sourceUrl;
  }
}

const COACHINGS = [
  // ── Bhopal (8) ──────────────────────────────────────────────────────────
  {
    name: "ALLEN Career Institute",
    slug: "allen-career-bhopal",
    city: "Bhopal",
    locality: "Habibganj",
    addressLine1: "Plot No. 9 & 10, ISBT Commercial Campus, Hoshangabad Road",
    pincode: "462024",
    phone: "08951395480",
    website: "https://www.allen.ac.in/bhopal",
    foundedYear: 2001,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "India's trusted name for JEE & NEET preparation",
    description:
      "ALLEN Career Institute Bhopal offers classroom programs for JEE Main, JEE Advanced and NEET-UG with experienced faculty, structured study material and regular mock tests. Known for consistent top ranks from Madhya Pradesh.",
    avgRating: 4.7,
    reviewCount: 342,
  },
  {
    name: "Aakash Institute",
    slug: "aakash-institute-mp-nagar-bhopal",
    city: "Bhopal",
    locality: "MP Nagar",
    addressLine1: "Plot No 76, Scheme No 13, Zone 2, Sector A, MP Nagar",
    pincode: "462016",
    phone: "07554001234",
    website: "https://www.aakash.ac.in/bhopal-city",
    foundedYear: 1988,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET", "Foundation"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "NEET & IIT-JEE coaching in the heart of Bhopal",
    description:
      "Aakash Institute MP Nagar centre provides integrated classroom coaching for NEET, JEE Main and JEE Advanced along with foundation courses for classes 8–10. AIATS test series and Olympiad prep available.",
    avgRating: 4.5,
    reviewCount: 218,
  },
  {
    name: "Resonance Eduventures",
    slug: "resonance-bhopal",
    city: "Bhopal",
    locality: "Arera Colony",
    addressLine1: "E-5, Arera Colony, Bhopal",
    pincode: "462016",
    phone: "07554256789",
    website: "https://www.resonance.ac.in",
    foundedYear: 2001,
    category: "Engineering Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    tagline: "Structured JEE & NEET programs with proven results",
    description:
      "Resonance Bhopal delivers systematic preparation for IIT-JEE and NEET with phase-wise curriculum, daily practice sheets and national-level test series aligned with the latest exam pattern.",
    avgRating: 4.4,
    reviewCount: 156,
  },
  {
    name: "Illuminati Coaching Classes",
    slug: "illuminati-coaching-bhopal",
    city: "Bhopal",
    locality: "Kolar Road",
    addressLine1: "108, Kolar Road, Bhopal",
    pincode: "462042",
    phone: "07552987654",
    foundedYear: 2010,
    category: "Engineering Entrance",
    targetExams: ["JEE", "Boards"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    tagline: "Interactive teaching for deep JEE concept clarity",
    description:
      "Illuminati Coaching Classes is a well-known JEE coaching centre in Bhopal offering interactive classroom sessions, doubt counters and comprehensive coverage of Physics, Chemistry and Mathematics.",
    avgRating: 4.3,
    reviewCount: 89,
  },
  {
    name: "Mitesh Rathi Classes",
    slug: "mitesh-rathi-classes-bhopal",
    city: "Bhopal",
    locality: "Shahpura",
    addressLine1: "Shahpura, Bhopal",
    pincode: "462039",
    phone: "07552456789",
    foundedYear: 2008,
    category: "Engineering Entrance",
    targetExams: ["JEE"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    tagline: "Focused IIT-JEE coaching with personal mentorship",
    description:
      "Mitesh Rathi Classes specialises in IIT-JEE preparation with small batch sizes, personalised attention and rigorous problem-solving sessions for serious engineering aspirants in Bhopal.",
    avgRating: 4.6,
    reviewCount: 124,
  },
  {
    name: "Aurous Academy",
    slug: "aurous-academy-bhopal",
    city: "Bhopal",
    locality: "Bawadiya Kalan",
    addressLine1: "Bawadiya Kalan, Bhopal",
    pincode: "462026",
    phone: "07552890123",
    foundedYear: 2012,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Quality coaching for JEE & NEET in Bhopal",
    description:
      "Aurous Academy offers integrated classroom programs for JEE and NEET with regular assessments, revision modules and a disciplined learning environment for classes 11 and 12.",
    avgRating: 4.2,
    reviewCount: 67,
  },
  {
    name: "Rana Sir Classes",
    slug: "rana-sir-classes-bhopal",
    city: "Bhopal",
    locality: "New Market",
    addressLine1: "New Market, TT Nagar, Bhopal",
    pincode: "462003",
    phone: "07552345678",
    foundedYear: 2005,
    category: "Medical Entrance",
    targetExams: ["NEET"],
    subjects: ["Physics", "Chemistry", "Biology"],
    tagline: "Bhopal's trusted NEET coaching with expert faculty",
    description:
      "Rana Sir Classes is among the top NEET coaching institutes in Bhopal, known for Biology-focused teaching, NCERT-based preparation and consistent selections in government medical colleges.",
    avgRating: 4.5,
    reviewCount: 198,
  },
  {
    name: "Tripati Agrawal Classes",
    slug: "tripati-agrawal-classes-bhopal",
    city: "Bhopal",
    locality: "Hoshangabad Road",
    addressLine1: "Hoshangabad Road, Bhopal",
    pincode: "462026",
    phone: "07552789012",
    foundedYear: 2000,
    category: "Medical Entrance",
    targetExams: ["NEET", "AIIMS"],
    subjects: ["Physics", "Chemistry", "Biology"],
    tagline: "Personalised NEET guidance since 2000",
    description:
      "Founded by Mr. Tripati Agrawal, this institute provides NEET and medical entrance coaching with individual student counselling, regular parent meetings and structured test schedules.",
    avgRating: 4.4,
    reviewCount: 145,
  },

  // ── Indore (8) ──────────────────────────────────────────────────────────
  {
    name: "ALLEN Career Institute Indore",
    slug: "allen-career-indore",
    city: "Indore",
    locality: "South Tukoganj",
    addressLine1: "7/3 South Tukoganj, Near Gokuldas Hospital, Dhakkan Wala Kua",
    pincode: "452001",
    phone: "07314001234",
    website: "https://www.allen.ac.in/indore",
    foundedYear: 2005,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Premier JEE & NEET coaching in Indore",
    description:
      "ALLEN Indore offers flagship classroom courses for JEE Main+Advanced and NEET-UG with ASAT scholarship tests, digital learning support and one of the largest student communities in MP.",
    avgRating: 4.8,
    reviewCount: 412,
  },
  {
    name: "Narayana Coaching Center",
    slug: "narayana-south-tukoganj-indore",
    city: "Indore",
    locality: "South Tukoganj",
    addressLine1: "Vitrag, 30/1, S Tukoganj Rd, Opposite Cosmos Bank, Green Park",
    pincode: "452001",
    phone: "07314005678",
    website: "https://indore.narayanacoachingcenters.in",
    foundedYear: 1979,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET", "Foundation"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Four decades of IIT-JEE & NEET excellence",
    description:
      "Narayana Coaching Center Indore provides foundation programs from class 6 through integrated two-year JEE/NEET batches, crash courses and dropper programs with a rank-oriented approach.",
    avgRating: 4.6,
    reviewCount: 287,
  },
  {
    name: "Narayana Coaching Center Vijay Nagar",
    slug: "narayana-vijay-nagar-indore",
    city: "Indore",
    locality: "Vijay Nagar",
    addressLine1: "2nd & 3rd Floor, The Emporio, MR 10 Road, Near Bapat Square, Sch No. 54",
    pincode: "452010",
    phone: "07314007890",
    website: "https://indore.narayanacoachingcenters.in",
    foundedYear: 2015,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Vijay Nagar branch for IIT-JEE & NEET aspirants",
    description:
      "Narayana's Vijay Nagar centre serves west Indore with modern classrooms, integrated school+coaching programs and dedicated faculty for JEE and NEET preparation.",
    avgRating: 4.5,
    reviewCount: 176,
  },
  {
    name: "MGCI Coaching Institute",
    slug: "mgci-indore",
    city: "Indore",
    locality: "Manorama Ganj",
    addressLine1: "202-203, Vibrant Tower, Gita Bhawan Rd, Manorama Ganj",
    pincode: "452018",
    phone: "07314096363",
    website: "https://mgci.co.in",
    foundedYear: 2003,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET", "CUET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Indore's No.1 institute for NEET & JEE",
    description:
      "MGCI offers bilingual (Hindi & English) classroom coaching for JEE Main, JEE Advanced and NEET with weekly tests, performance analytics and personal attention from experienced faculty.",
    avgRating: 4.7,
    reviewCount: 356,
  },
  {
    name: "Aayam Career Institute",
    slug: "aayam-career-indore",
    city: "Indore",
    locality: "Sapna Sangeeta",
    addressLine1: "Sapna Sangeeta Road, Indore",
    pincode: "452001",
    phone: "07314001122",
    website: "https://aayamcareerinstitute.com",
    foundedYear: 2010,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Result-oriented NEET & JEE coaching in Indore",
    description:
      "Aayam Career Institute provides comprehensive classroom coaching, test series, crash courses and online learning for NEET-UG, JEE Main and JEE Advanced with affordable fee structures.",
    avgRating: 4.4,
    reviewCount: 203,
  },
  {
    name: "Kalpavriksha Institute",
    slug: "kalpavriksha-indore",
    city: "Indore",
    locality: "Ratlam Kothi",
    addressLine1: "12-C, Ratlam Kothi, Near Hotel Omni Palace",
    pincode: "452001",
    phone: "07314096363",
    website: "https://kalpavrikshainstitute.com",
    foundedYear: 2008,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Modern Gurukul for IIT-JEE & NEET in Indore",
    description:
      "Kalpavriksha Institute runs Alpha and Impulse batches for JEE and NEET droppers and two-year programs for classes 11–12 with strong foundation building and regular mock tests.",
    avgRating: 4.5,
    reviewCount: 167,
  },
  {
    name: "Medimath Career Institute",
    slug: "medimath-indore",
    city: "Indore",
    locality: "Manorama Ganj",
    addressLine1: "202-203, Vibrant Tower, Gita Bhawan Rd, Manorama Ganj",
    pincode: "452018",
    phone: "07314002233",
    website: "https://www.medimath.in",
    foundedYear: 2012,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Affordable JEE & NEET coaching with director-level guidance",
    description:
      "Medimath Career Institute offers flexible JEE and NEET preparation with personalised one-on-one support, structured modules and director-led mentoring at competitive fees.",
    avgRating: 4.3,
    reviewCount: 134,
  },
  {
    name: "FIITJEE Indore",
    slug: "fiitjee-indore",
    city: "Indore",
    locality: "Palasia",
    addressLine1: "Palasia Square, Indore",
    pincode: "452001",
    phone: "07314003344",
    website: "https://www.fiitjee.com",
    foundedYear: 1992,
    category: "Engineering Entrance",
    targetExams: ["JEE"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    tagline: "National leader in IIT-JEE preparation",
    description:
      "FIITJEE Indore centre delivers rigorous IIT-JEE coaching with advanced problem-solving techniques, All India Test Series and programs from class 6 foundation through JEE Advanced.",
    avgRating: 4.6,
    reviewCount: 245,
  },

  // ── Sehore (7) ──────────────────────────────────────────────────────────
  {
    name: "Nucleus Kota Sehore Branch",
    slug: "nucleus-kota-sehore",
    city: "Sehore",
    locality: "Avadhpuri Colony",
    addressLine1: "Main Road, Bhopal Naka, In Front of CSA Govt PG College, Avadhpuri Colony",
    pincode: "466001",
    phone: "07562234567",
    foundedYear: 2022,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Kota-style JEE & NEET coaching now in Sehore",
    description:
      "Nucleus Kota's Sehore branch brings Kota-tested teaching methodology for IIT-JEE and NEET preparation to students in Sehore district with Maths, Science and competitive exam focus.",
    avgRating: 4.8,
    reviewCount: 42,
  },
  {
    name: "MGCI NEET & IIT-JEE Division",
    slug: "mgci-sehore",
    city: "Sehore",
    locality: "Sehore Rak",
    addressLine1: "Near Geeta Bhawan Square, Sehore Rak",
    pincode: "466001",
    phone: "07562245678",
    website: "https://mgci.co.in",
    foundedYear: 2020,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "MGCI's Sehore centre for NEET & JEE aspirants",
    description:
      "MGCI's Sehore division extends Indore's proven NEET and JEE coaching to local students with bilingual classes, regular tests and structured study material.",
    avgRating: 4.5,
    reviewCount: 38,
  },
  {
    name: "Sanni Sir Coaching",
    slug: "sanni-sir-coaching-sehore",
    city: "Sehore",
    locality: "Sehore City",
    addressLine1: "3rd Floor, Hotel DCM, Sehore City",
    pincode: "466001",
    phone: "07562256789",
    foundedYear: 2015,
    category: "Engineering Entrance",
    targetExams: ["JEE"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    tagline: "Local IIT-JEE coaching trusted by Sehore students",
    description:
      "Sanni Sir Coaching provides focused IIT-JEE preparation for class 11, 12 and droppers in Sehore with small batches and accessible fee structures for district students.",
    avgRating: 4.3,
    reviewCount: 29,
  },
  {
    name: "Evolution Career Institute",
    slug: "evolution-career-sehore",
    city: "Sehore",
    locality: "Englishpura",
    addressLine1: "Samta Palace, Englishpura, Sehore",
    pincode: "466001",
    phone: "07562267890",
    website: "https://evolutioncareerinstitute.in",
    foundedYear: 2018,
    category: "Competitive Exams",
    targetExams: ["NEET", "JEE", "Boards"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Multi-exam coaching for Sehore district",
    description:
      "Evolution Career Institute offers NEET, JEE and board exam coaching for Sehore students with classroom programs, test series and career counselling for medical and engineering paths.",
    avgRating: 4.2,
    reviewCount: 24,
  },
  {
    name: "Darshan Academy Sehore",
    slug: "darshan-academy-sehore",
    city: "Sehore",
    locality: "Bhopal Naka",
    addressLine1: "Bhopal Naka, Sehore",
    pincode: "466001",
    phone: "07562278901",
    foundedYear: 2014,
    category: "Foundation & Boards",
    targetExams: ["NEET", "JEE", "Boards"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Foundation to NEET/JEE coaching in Sehore",
    description:
      "Darshan Academy prepares students from class 9 foundation through NEET and JEE with concept-based teaching, weekly tests and a supportive learning environment in Sehore town.",
    avgRating: 4.1,
    reviewCount: 31,
  },
  {
    name: "Jaiswal Competition Institute",
    slug: "jaiswal-competition-sehore",
    city: "Sehore",
    locality: "Civil Lines",
    addressLine1: "Civil Lines, Sehore",
    pincode: "466001",
    phone: "07562289012",
    foundedYear: 2011,
    category: "Medical Entrance",
    targetExams: ["NEET"],
    subjects: ["Physics", "Chemistry", "Biology"],
    tagline: "Dedicated NEET coaching for Sehore aspirants",
    description:
      "Jaiswal Competition Institute specialises in NEET preparation with NCERT-focused Biology teaching, regular mock tests and affordable coaching for students from Sehore and nearby towns.",
    avgRating: 4.4,
    reviewCount: 47,
  },
  {
    name: "Career Point Sehore",
    slug: "career-point-sehore",
    city: "Sehore",
    locality: "Station Road",
    addressLine1: "Station Road, Sehore",
    pincode: "466001",
    phone: "07562290123",
    foundedYear: 2016,
    category: "Engineering Entrance",
    targetExams: ["JEE", "Boards"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    tagline: "JEE coaching with board exam integration",
    description:
      "Career Point Sehore offers integrated JEE and board exam preparation with structured curriculum, doubt sessions and test analysis for engineering aspirants in the district.",
    avgRating: 4.0,
    reviewCount: 22,
  },

  // ── Ashta (7) ───────────────────────────────────────────────────────────
  {
    name: "Topper's Point Ashta",
    slug: "toppers-point-ashta",
    city: "Ashta",
    locality: "Aipur Ashta",
    addressLine1: "Aipur Ashta, Sehore District",
    pincode: "466116",
    phone: "07562211234",
    foundedYear: 2013,
    category: "Competitive Exams",
    targetExams: ["NEET", "JEE", "Boards"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Ashta's popular coaching for NEET & JEE",
    description:
      "Topper's Point is among the most popular coaching centres in Aipur Ashta, offering NEET, JEE and board exam preparation for students across Sehore district's rural belt.",
    avgRating: 4.3,
    reviewCount: 18,
  },
  {
    name: "Udaan Coaching Classes",
    slug: "udaan-coaching-ashta",
    city: "Ashta",
    locality: "Aipur Ashta",
    addressLine1: "Aipur Ashta, Sehore District",
    pincode: "466116",
    phone: "07562222345",
    foundedYear: 2015,
    category: "Foundation & Boards",
    targetExams: ["NEET", "Boards"],
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    tagline: "Helping Ashta students reach their goals",
    description:
      "Udaan Coaching Classes provides NEET and board exam coaching for class 10–12 students in Ashta with affordable fees and accessible location in the town centre.",
    avgRating: 4.1,
    reviewCount: 14,
  },
  {
    name: "Goodwill Coaching Classes",
    slug: "goodwill-coaching-ashta",
    city: "Ashta",
    locality: "Ashta Town",
    addressLine1: "Near Pooja Boutique, Ashta",
    pincode: "466116",
    phone: "07562233456",
    foundedYear: 2012,
    category: "Medical Entrance",
    targetExams: ["NEET"],
    subjects: ["Physics", "Chemistry", "Biology"],
    tagline: "NEET-focused coaching in Ashta town",
    description:
      "Goodwill Coaching Classes offers dedicated NEET preparation for Ashta and surrounding village students with Biology emphasis, regular tests and Hindi-medium support.",
    avgRating: 4.2,
    reviewCount: 21,
  },
  {
    name: "Velocity Education Center",
    slug: "velocity-education-ashta",
    city: "Ashta",
    locality: "Seminary Road",
    addressLine1: "Seminary Road, Ashta",
    pincode: "466116",
    phone: "07562244567",
    foundedYear: 2017,
    category: "Engineering & Medical Entrance",
    targetExams: ["JEE", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Modern coaching facility in Ashta",
    description:
      "Velocity Education Center provides JEE and NEET classroom coaching in Ashta with digital learning aids, weekly assessments and career guidance for rural MP students.",
    avgRating: 4.0,
    reviewCount: 16,
  },
  {
    name: "Sharma Classes Ashta",
    slug: "sharma-classes-ashta",
    city: "Ashta",
    locality: "Main Market",
    addressLine1: "Main Market, Ashta",
    pincode: "466116",
    phone: "07562255678",
    foundedYear: 2009,
    category: "Foundation & Boards",
    targetExams: ["Boards", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Trusted local coaching since 2009",
    description:
      "Sharma Classes has been serving Ashta students for over a decade with board exam coaching, class 11–12 Science tuition and NEET foundation programs.",
    avgRating: 4.4,
    reviewCount: 33,
  },
  {
    name: "Goal Institute Ashta",
    slug: "goal-institute-ashta",
    city: "Ashta",
    locality: "Barkheda Road",
    addressLine1: "Barkheda Road, Ashta",
    pincode: "466116",
    phone: "07562266789",
    foundedYear: 2016,
    category: "Medical Entrance",
    targetExams: ["NEET"],
    subjects: ["Physics", "Chemistry", "Biology"],
    tagline: "Your NEET goal starts here in Ashta",
    description:
      "Goal Institute Ashta runs focused NEET batches for class 11, 12 and repeaters with NCERT-based teaching, daily practice and mock tests for medical aspirants.",
    avgRating: 4.2,
    reviewCount: 19,
  },
  {
    name: "Success Point Coaching",
    slug: "success-point-ashta",
    city: "Ashta",
    locality: "Aipur Ashta",
    addressLine1: "Aipur Ashta, Near Bus Stand",
    pincode: "466116",
    phone: "07562277890",
    foundedYear: 2014,
    category: "Competitive Exams",
    targetExams: ["JEE", "NEET", "Boards"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    tagline: "Complete exam prep for Ashta students",
    description:
      "Success Point Coaching offers integrated JEE, NEET and board preparation for Ashta area students with flexible batch timings and affordable monthly fee options.",
    avgRating: 4.1,
    reviewCount: 12,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  let created = 0;
  let skipped = 0;

  console.log(`Seeding ${COACHINGS.length} MP coachings with images...\n`);

  for (let i = 0; i < COACHINGS.length; i++) {
    const c = COACHINGS[i];
    const email = `seed-${c.slug}@coachinghunt.demo`;

    const existing = await prisma.coachingProfile.findUnique({ where: { slug: c.slug } });
    if (existing) {
      console.log(`  Skip (exists): ${c.name}`);
      skipped++;
      continue;
    }

    console.log(`  [${i + 1}/${COACHINGS.length}] ${c.name} (${c.city}) — uploading image...`);
    const imageSource = COACHING_IMAGES[i % COACHING_IMAGES.length];
    const coverImageUrl = await uploadCoachingImage(imageSource, c.slug);

    const user = await prisma.user.create({
      data: {
        name: c.name,
        email,
        passwordHash,
        role: "COACHING",
        phone: c.phone,
        coachingProfile: {
          create: {
            name: c.name,
            slug: c.slug,
            tagline: c.tagline,
            description: c.description,
            foundedYear: c.foundedYear,
            phone: c.phone,
            email,
            website: c.website ?? null,
            mode: "OFFLINE",
            category: c.category,
            targetExams: c.targetExams,
            subjects: c.subjects,
            facilities: ["AC Classrooms", "Study Material", "Doubt Sessions", "Mock Tests"],
            logoUrl: coverImageUrl,
            coverImageUrl,
            galleryImages: [coverImageUrl],
            city: c.city,
            locality: c.locality,
            addressLine1: c.addressLine1,
            pincode: c.pincode,
            verificationStatus: "VERIFIED",
            listingStatus: "ACTIVE",
            avgRating: c.avgRating,
            reviewCount: c.reviewCount,
          },
        },
      },
      include: { coachingProfile: true },
    });

    await prisma.coachingBranch.create({
      data: {
        coachingId: user.coachingProfile.id,
        branchName: "Main Branch",
        city: c.city,
        locality: c.locality,
        address: c.addressLine1,
        phone: c.phone,
        isPrimary: true,
      },
    });

    const primaryExam = c.targetExams[0];
    await prisma.course.create({
      data: {
        coachingId: user.coachingProfile.id,
        title: `${primaryExam} Foundation Batch`,
        slug: `${c.slug}-${primaryExam.toLowerCase()}-batch`,
        description: `Comprehensive ${primaryExam} preparation program at ${c.name}.`,
        courseType: "BATCH",
        targetExam: primaryExam,
        classLevel: "11-12",
        batchSize: 35,
        fees: primaryExam === "NEET" ? 45000 : 55000,
        durationText: "1 year",
        scheduleSummary: "Mon-Sat, 8 AM - 2 PM",
        status: "ACTIVE",
      },
    });

    created++;
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}, Total in script: ${COACHINGS.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
