/**
 * Seeds job_listings with realistic sample data for local development
 * (Firebase Emulator Suite) or a fresh project.
 *
 * Usage:
 *   1) Local emulator (recommended, no real credentials needed):
 *        firebase emulators:start --only firestore
 *        FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/seedFirestore.js
 *
 *   2) Real project (requires a service account key):
 *        GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/seedFirestore.js
 */
const admin = require('firebase-admin')

admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'assam-jobs-repository' })
const db = admin.firestore()

// Approximate district-HQ coordinates, used to place map pins
const DISTRICT_COORDS = {
  'Kamrup Metropolitan': [26.1445, 91.7362],
  Jorhat: [26.7509, 94.2037],
  Dibrugarh: [27.4728, 94.9120],
  Nagaon: [26.3479, 92.6839],
  Sivasagar: [26.9850, 94.6380],
  Barpeta: [26.3223, 91.0064],
  Tinsukia: [27.4924, 95.3597],
  Silchar: [24.8333, 92.7789] // Cachar district HQ
}

const sampleJobs = [
  {
    role: 'Junior Assistant', department: 'Assam Public Service Commission',
    salary: '₹14,000 – ₹49,000/month', minAge: 18, maxAge: 38,
    requiredEducation: '12th', assam_district: 'Kamrup Metropolitan',
    districtRestricted: false, deadline: '2026-09-15',
    applyUrl: 'https://apsc.nic.in', status: 'active'
  },
  {
    role: 'Police Constable (AB/UB)', department: 'Assam Police',
    salary: '₹14,000 – ₹60,500/month', minAge: 18, maxAge: 25,
    requiredEducation: '10th', assam_district: 'Entire Assam',
    districtRestricted: false, deadline: '2026-08-30',
    applyUrl: 'https://slprbassam.in', status: 'active'
  },
  {
    role: 'Graduate Teacher (Science)', department: 'Directorate of Secondary Education',
    salary: '₹30,000 – ₹1,10,000/month', minAge: 21, maxAge: 40,
    requiredEducation: 'graduate', assam_district: 'Jorhat',
    districtRestricted: true, deadline: '2026-08-20',
    applyUrl: 'https://dse.assam.gov.in', status: 'active'
  },
  {
    role: 'Field Sales Executive', department: 'Local Pvt. Ltd. Company',
    salary: '₹12,000 – ₹18,000/month + incentives', minAge: 18, maxAge: 35,
    requiredEducation: '12th', assam_district: 'Dibrugarh',
    districtRestricted: false, deadline: '2026-08-10',
    applyUrl: '', status: 'active'
  },
  {
    role: 'Staff Nurse', department: 'National Health Mission, Assam',
    salary: '₹22,000/month', minAge: 21, maxAge: 40,
    requiredEducation: 'diploma', assam_district: 'Nagaon',
    districtRestricted: false, deadline: '2026-09-01',
    applyUrl: 'https://nhm.assam.gov.in', status: 'active'
  },
  {
    role: 'Forest Guard', department: 'Assam Forest Department',
    salary: '₹14,000 – ₹49,000/month', minAge: 18, maxAge: 28,
    requiredEducation: '10th', assam_district: 'Sivasagar',
    districtRestricted: false, deadline: '2026-07-25', // already past -> demonstrates archiving
    applyUrl: '', status: 'active'
  }
]

async function seed() {
  const batch = db.batch()
  sampleJobs.forEach((job) => {
    const ref = db.collection('job_listings').doc()
    const coords = DISTRICT_COORDS[job.assam_district]
    batch.set(ref, {
      ...job,
      lat: coords ? coords[0] : null,
      lng: coords ? coords[1] : null,
      postedAt: admin.firestore.FieldValue.serverTimestamp()
    })
  })
  await batch.commit()
  console.log(`Seeded ${sampleJobs.length} job_listings documents.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
