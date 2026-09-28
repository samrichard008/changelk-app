import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = process.env.VERCEL ? path.resolve('/tmp', 'db.json') : path.resolve(process.cwd(), 'db.json');

// --- Database Interfaces ---
interface User {
  id: string;
  fullName: string;
  phone: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface Petition {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetCount: number;
  currentCount: number;
  creatorId: string;
  createdAt: string;
  status: 'active' | 'closed';
  imageUrl?: string;
}

interface Signature {
  id: string;
  petitionId: string;
  fullName: string;
  phone: string;
  district: string;
  comment: string;
  signatureImageUrl: string;
  createdAt: string;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  createdAt: string;
  status: 'active' | 'closed';
  imageUrl?: string;
}

interface PollVote {
  id: string;
  pollId: string;
  fullName: string;
  phone: string;
  option: 'yes' | 'no' | 'neutral';
  createdAt: string;
  district?: string;
  comment?: string;
  signatureImageUrl?: string;
}

interface Database {
  users: User[];
  petitions: Petition[];
  signatures: Signature[];
  polls: Poll[];
  pollVotes: PollVote[];
}

const DEFAULT_PETITIONS: Petition[] = [
  {
    id: 'pet_save_anojan_01',
    title: 'Save Anojan: Appeal for Presidential Pardon & Royal Clemency from Saudi Arabia',
    slug: 'save-anojan',
    description: `This international public petition campaign is launched to secure a humanitarian Royal Clemency and Presidential Pardon for Anojan, a young Sri Lankan citizen currently facing a death sentence in the Kingdom of Saudi Arabia.\n\nAnojan, hailing from a vulnerable background in Jaffna, Sri Lanka, migrated to Saudi Arabia as a domestic laborer to support his impoverished family. Due to a series of tragic, highly unintended, and unfortunate circumstances, he was convicted and sentenced.\n\nHis grieving family, along with the entire citizenry of Sri Lanka and global humanitarians, make a solemn, peaceful appeal of mercy to His Majesty King Salman bin Abdulaziz Al Saud, the Royal Court, and the Saudi judicial authorities to grant royal mercy and commute his sentence.\n\n**Our Clear Objectives:**\n1. We appeal to the exceptional mercy of His Majesty the King of Saudi Arabia to grant Anojan a Royal Clemency on compassionate grounds.\n2. We urge the President and Ministry of Foreign Affairs of Sri Lanka to immediately accelerate top-level bilateral diplomatic mediation with the Saudi Government to save Anojans life.\n\nEvery single signature adds a beacon of hope and strength. Please sign and share this humanitarian appeal to help return Anojan safely to his elderly parents.`,
    targetCount: 1000000,
    currentCount: 312411,
    creatorId: 'admin-user-id',
    createdAt: new Date().toISOString(),
    status: 'active',
    imageUrl: ''
  },
  {
    id: 'pet_hikkaduwa_02',
    title: "Protect Sri Lanka's Coral Reefs in Hikkaduwa from Commercial Boating",
    slug: 'protect-hikkaduwa-coral-reefs',
    description: `Hikkaduwa Marine Sanctuary is facing critical degradation due to plastic pollution, illegal anchoring, and rising sea temperatures. This petition urges the Department of Wildlife Conservation (DWC) to declare the area a strict marine reserve and restrict commercial motorized boating inside the shallow lagoon.\n\nOur coral reefs are an irreplaceable natural treasure and key to Sri Lanka's marine tourism. We must protect them before they are completely bleached and destroyed.`,
    targetCount: 50000,
    currentCount: 18450,
    creatorId: 'admin-user-id',
    createdAt: new Date().toISOString(),
    status: 'active',
    imageUrl: ''
  },
  {
    id: 'pet_colombo_03',
    title: 'Introduce Safer CCTV-Monitored Public Transport Options for Women in Colombo',
    slug: 'safe-transport-colombo',
    description: `Over 80% of women using public buses and trains in Colombo report facing verbal or physical harassment during transit. We appeal to the Ministry of Transport and Highways to introduce dedicated CCTV-monitored compartments, trained transit marshals, and a direct emergency reporting hotline.\n\nSafe transit is a fundamental right of every citizen. Let us build a safer Colombo for our mothers, sisters, and daughters.`,
    targetCount: 75000,
    currentCount: 42100,
    creatorId: 'admin-user-id',
    createdAt: new Date().toISOString(),
    status: 'active',
    imageUrl: ''
  }
];

// --- Seeding Default DB ---
function seedDefaultDb(): Database {
  const adminId = 'admin-user-id';
  const defaultDb: Database = {
    users: [
      {
        id: adminId,
        fullName: 'Changelk Administrator',
        phone: '+94771234567',
        passwordHash: 'ChangeLKadmin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ],
    petitions: DEFAULT_PETITIONS,
    signatures: [],
    polls: [],
    pollVotes: []
  };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
  } catch (e) {
    // Ignore write failure in read-only environments
  }
  return defaultDb;
}

async function syncDbFromBunny(): Promise<void> {
  const STORAGE_ZONE = 'gnanasara-petition';
  const ACCESS_KEY = 'e09085cd-4065-4aa7-a543641e2577-a063-4a05';
  const ENDPOINT = 'sg.storage.bunnycdn.com';
  const DB_FILENAME = 'db.json';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout protection

    const response = await fetch(`https://${ENDPOINT}/${STORAGE_ZONE}/${DB_FILENAME}`, {
      method: 'GET',
      headers: {
        'AccessKey': ACCESS_KEY,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.text();
      fs.writeFileSync(DB_FILE, data, 'utf-8');
      console.log('Database synchronized successfully from Bunny.net storage!');
    }
  } catch (error) {
    console.warn('Bunny sync non-blocking catch:', error);
  }
}

async function uploadDbToBunny(data: Database): Promise<void> {
  const STORAGE_ZONE = 'gnanasara-petition';
  const ACCESS_KEY = 'e09085cd-4065-4aa7-a543641e2577-a063-4a05';
  const ENDPOINT = 'sg.storage.bunnycdn.com';
  const DB_FILENAME = 'db.json';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch(`https://${ENDPOINT}/${STORAGE_ZONE}/${DB_FILENAME}`, {
      method: 'PUT',
      headers: {
        'AccessKey': ACCESS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data, null, 2),
      signal: controller.signal
    });
    clearTimeout(timeout);
  } catch (err) {
    console.error('Error uploading db.json to Bunny.net:', err);
  }
}

function readDb(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.users) parsed.users = [];
      if (!parsed.petitions) parsed.petitions = [];
      if (!parsed.signatures) parsed.signatures = [];
      if (!parsed.polls) parsed.polls = [];
      if (!parsed.pollVotes) parsed.pollVotes = [];

      // Ensure default petitions exist
      for (const defPet of DEFAULT_PETITIONS) {
        if (!parsed.petitions.some((p: any) => p.slug === defPet.slug || p.id === defPet.id)) {
          parsed.petitions.push(defPet);
        }
      }

      // Ensure admin exists
      const hasAdmin = parsed.users.some((u: any) => (u.phone === '+94771234567' || u.phone === '0771234567') && u.role === 'admin');
      if (!hasAdmin) {
        parsed.users.push({
          id: 'admin-user-id',
          fullName: 'Changelk Administrator',
          phone: '+94771234567',
          passwordHash: 'ChangeLKadmin123',
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      }

      return parsed;
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return seedDefaultDb();
}

async function writeDb(data: Database): Promise<void> {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    await uploadDbToBunny(data);
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

async function uploadToBunny(base64Image: string, filename: string): Promise<string> {
  const STORAGE_ZONE = 'gnanasara-petition';
  const ACCESS_KEY = 'e09085cd-4065-4aa7-a543641e2577-a063-4a05';
  const ENDPOINT = 'sg.storage.bunnycdn.com';
  const CDN_BASE = 'https://gnanasara-petition.b-cdn.net';

  try {
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const response = await fetch(`https://${ENDPOINT}/${STORAGE_ZONE}/${filename}`, {
      method: 'PUT',
      headers: {
        'AccessKey': ACCESS_KEY,
        'Content-Type': 'image/png',
      },
      body: buffer
    });

    if (response.ok) {
      return `${CDN_BASE}/${filename}`;
    }
  } catch (error) {}
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(filename)}`;
}

function generateToken(userId: string, role: string): string {
  return crypto.createHash('sha256').update(userId + '-' + role + '-' + 'changelk-secret-2026').digest('hex');
}

function validateSession(req: express.Request, userId: string, expectedRole?: string): boolean {
  let token = '';
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  if (!token && req.query.token) {
    token = req.query.token as string;
  }
  if (!token || !userId) return false;

  try {
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return false;
    const expectedToken = generateToken(user.id, user.role);
    if (token !== expectedToken) return false;
    if (expectedRole && user.role !== expectedRole) return false;
    return true;
  } catch {
    return false;
  }
}

// --- App and Router Setup ---
const app = express();
app.use(express.json({ limit: '10mb' }));

// Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Non-blocking background sync from Bunny
syncDbFromBunny().catch(() => {});

const router = express.Router();

// Get all petitions
router.get('/petitions', (req, res) => {
  try {
    const db = readDb();
    res.json(db.petitions);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve petitions' });
  }
});

// Get single petition
router.get('/petitions/:slug', (req, res) => {
  try {
    const db = readDb();
    const petition = db.petitions.find(p => p.slug === req.params.slug);
    if (!petition) return res.status(404).json({ error: 'Petition not found' });

    const petitionSignatures = db.signatures
      .filter(s => s.petitionId === petition.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ ...petition, signatures: petitionSignatures });
  } catch {
    res.status(500).json({ error: 'Failed to retrieve petition details' });
  }
});

// Sign petition
router.post('/petitions/:id/sign', async (req, res) => {
  const { id: petitionId } = req.params;
  const { fullName, phone, district, comment, signatureBase64 } = req.body;

  if (!fullName || !phone || !district) {
    return res.status(400).json({ error: 'Missing required signature details' });
  }

  try {
    const db = readDb();
    const petition = db.petitions.find(p => p.id === petitionId);
    if (!petition) return res.status(404).json({ error: 'Petition not found' });

    const existingSig = db.signatures.find(s => s.petitionId === petitionId && s.phone === phone);
    if (existingSig) {
      return res.status(409).json({ error: 'நீங்கள் ஏற்கனவே இந்த மனுவில் கையொப்பமிட்டுள்ளீர்கள்! (You have already signed this petition!)' });
    }

    let user = db.users.find(u => u.phone === phone);
    let accountCreated = false;
    let tempPassword = '';

    if (!user) {
      tempPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
      user = {
        id: 'user_' + crypto.randomUUID(),
        fullName,
        phone,
        passwordHash: tempPassword,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      accountCreated = true;
    }

    let sigImgUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;
    if (signatureBase64 && signatureBase64.startsWith('data:image/png;base64,')) {
      const filename = `sig_${petitionId}_${Date.now()}.png`;
      sigImgUrl = await uploadToBunny(signatureBase64, filename);
    }

    const newSignature: Signature = {
      id: 'sig_' + crypto.randomUUID(),
      petitionId,
      fullName,
      phone,
      district,
      comment: comment || '',
      signatureImageUrl: sigImgUrl,
      createdAt: new Date().toISOString()
    };

    db.signatures.push(newSignature);
    petition.currentCount += 1;
    await writeDb(db);

    res.status(201).json({
      success: true,
      signature: newSignature,
      accountCreated,
      generatedPassword: tempPassword,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch {
    res.status(500).json({ error: 'Failed to register signature' });
  }
});

// Create petition (Admin only)
router.post('/petitions', async (req, res) => {
  const { title, description, targetCount, creatorId, imageUrl, imageBase64 } = req.body;
  if (!title || !description || !targetCount || !creatorId) {
    return res.status(400).json({ error: 'Missing required campaign details' });
  }

  try {
    const db = readDb();
    if (!validateSession(req, creatorId, 'admin')) {
      return res.status(401).json({ error: 'மனுக்களை அட்மின்கள் மட்டுமே உருவாக்க முடியும்! (Only admins can start petitions!)' });
    }

    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || ('petition-' + Date.now());
    let finalImageUrl = imageUrl || '';
    if (imageBase64 && imageBase64.startsWith('data:image/')) {
      finalImageUrl = await uploadToBunny(imageBase64, `petition_${Date.now()}.png`);
    }

    const newPetition: Petition = {
      id: 'pet_' + crypto.randomUUID(),
      title,
      slug: cleanSlug,
      description,
      targetCount: Number(targetCount),
      currentCount: 0,
      creatorId,
      createdAt: new Date().toISOString(),
      status: 'active',
      imageUrl: finalImageUrl
    };

    db.petitions.push(newPetition);
    await writeDb(db);
    res.status(201).json({ success: true, petition: newPetition });
  } catch {
    res.status(500).json({ error: 'Failed to create petition' });
  }
});

// Update petition (Admin only)
router.put('/petitions/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, targetCount, creatorId, imageUrl, imageBase64 } = req.body;

  try {
    const db = readDb();
    if (!validateSession(req, creatorId, 'admin')) {
      return res.status(401).json({ error: 'அட்மின்கள் மட்டுமே மனுக்களை திருத்த முடியும்!' });
    }

    const petition = db.petitions.find(p => p.id === id);
    if (!petition) return res.status(404).json({ error: 'Petition not found' });

    if (title) petition.title = title;
    if (description) petition.description = description;
    if (targetCount) petition.targetCount = Number(targetCount);
    if (imageUrl) petition.imageUrl = imageUrl;
    if (imageBase64 && imageBase64.startsWith('data:image/')) {
      petition.imageUrl = await uploadToBunny(imageBase64, `petition_edit_${Date.now()}.png`);
    }

    await writeDb(db);
    res.json({ success: true, petition });
  } catch {
    res.status(500).json({ error: 'Failed to update petition' });
  }
});

// Delete petition (Admin only)
router.delete('/petitions/:id', async (req, res) => {
  const { id } = req.params;
  const creatorId = (req.body && req.body.creatorId) || req.query.creatorId as string;

  try {
    const db = readDb();
    if (!validateSession(req, creatorId, 'admin')) {
      return res.status(401).json({ error: 'அட்மின்கள் மட்டுமே மனுக்களை நீக்க முடியும்!' });
    }

    db.petitions = db.petitions.filter(p => p.id !== id);
    db.signatures = db.signatures.filter(s => s.petitionId !== id);
    await writeDb(db);
    res.json({ success: true, message: 'Petition deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete petition' });
  }
});

// Export signatures
router.get('/petitions/:id/export', (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId as string;

  try {
    const db = readDb();
    if (!validateSession(req, userId, 'admin')) {
      return res.status(401).send('Unauthorized export');
    }

    const petition = db.petitions.find(p => p.id === id);
    if (!petition) return res.status(404).send('Petition not found');

    const sigs = db.signatures.filter(s => s.petitionId === id);
    let csvContent = 'Full Name,Phone Number,District,Date,Comment\n';
    sigs.forEach(s => {
      csvContent += `"${(s.fullName || '').replace(/"/g, '""')}","${(s.phone || '').replace(/"/g, '""')}","${(s.district || '').replace(/"/g, '""')}","${new Date(s.createdAt).toLocaleDateString()}","${(s.comment || '').replace(/"/g, '""')}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="signatures_${petition.slug}.csv"`);
    res.status(200).send(csvContent);
  } catch {
    res.status(500).send('Error generating export');
  }
});

// Polls
router.get('/polls', (req, res) => {
  try {
    const db = readDb();
    const pollSummaries = db.polls.map(poll => {
      const votes = db.pollVotes.filter(v => v.pollId === poll.id);
      const total = votes.length;
      const yes = votes.filter(v => v.option === 'yes').length;
      const no = votes.filter(v => v.option === 'no').length;
      const neutral = votes.filter(v => v.option === 'neutral').length;
      return {
        ...poll,
        totalVotes: total,
        yesCount: yes,
        noCount: no,
        neutralCount: neutral,
        yesPercentage: total > 0 ? Math.round((yes / total) * 100) : 0,
        noPercentage: total > 0 ? Math.round((no / total) * 100) : 0,
        neutralPercentage: total > 0 ? Math.round((neutral / total) * 100) : 0,
        votes: votes.slice(-20).reverse()
      };
    });
    res.json(pollSummaries);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve polls' });
  }
});

// Vote in poll
router.post('/polls/:id/vote', async (req, res) => {
  const { id: pollId } = req.params;
  const { fullName, phone, option, district, comment, signatureBase64 } = req.body;

  if (!fullName || !phone || !option) {
    return res.status(400).json({ error: 'Missing required voting details' });
  }

  try {
    const db = readDb();
    const poll = db.polls.find(p => p.id === pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    const existingVote = db.pollVotes.find(v => v.pollId === pollId && v.phone === phone);
    if (existingVote) {
      return res.status(409).json({ error: 'நீங்கள் ஏற்கனவே இந்த கருத்துக்கணிப்பில் வாக்களித்துவிட்டீர்கள்! (You have already voted!)' });
    }

    let user = db.users.find(u => u.phone === phone);
    let accountCreated = false;
    let tempPassword = '';

    if (!user) {
      tempPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
      user = {
        id: 'user_' + crypto.randomUUID(),
        fullName,
        phone,
        passwordHash: tempPassword,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      accountCreated = true;
    }

    let sigImgUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;
    if (signatureBase64 && signatureBase64.startsWith('data:image/png;base64,')) {
      sigImgUrl = await uploadToBunny(signatureBase64, `vote_${pollId}_${Date.now()}.png`);
    }

    const newVote: PollVote = {
      id: 'pv_' + crypto.randomUUID(),
      pollId,
      fullName,
      phone,
      option,
      district: district || '',
      comment: comment || '',
      signatureImageUrl: sigImgUrl,
      createdAt: new Date().toISOString()
    };

    db.pollVotes.push(newVote);
    await writeDb(db);

    res.status(201).json({
      success: true,
      vote: newVote,
      accountCreated,
      generatedPassword: tempPassword,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch {
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// Create poll (Admin only)
router.post('/polls', async (req, res) => {
  const { title, description, creatorId } = req.body;
  if (!title || !description || !creatorId) {
    return res.status(400).json({ error: 'Missing required poll details' });
  }

  try {
    const db = readDb();
    if (!validateSession(req, creatorId, 'admin')) {
      return res.status(401).json({ error: 'மனு அல்லது கருத்துக்கணிப்பை அட்மின் மட்டுமே தொடங்க முடியும்!' });
    }

    const newPoll: Poll = {
      id: 'poll_' + crypto.randomUUID(),
      title,
      description,
      imageUrl: req.body.imageUrl || '',
      creatorId,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    db.polls.push(newPoll);
    await writeDb(db);
    res.status(201).json({ success: true, poll: newPoll });
  } catch {
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

// Edit poll (Admin only)
router.put('/polls/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, creatorId, imageUrl } = req.body;

  try {
    const db = readDb();
    if (!validateSession(req, creatorId, 'admin')) {
      return res.status(401).json({ error: 'அட்மின்கள் மட்டுமே கருத்துக்கணிப்புகளை திருத்த முடியும்!' });
    }

    const poll = db.polls.find(p => p.id === id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    if (title) poll.title = title;
    if (description) poll.description = description;
    if (imageUrl !== undefined) poll.imageUrl = imageUrl;

    await writeDb(db);
    res.json({ success: true, poll });
  } catch {
    res.status(500).json({ error: 'Failed to update poll' });
  }
});

// Delete poll (Admin only)
router.delete('/polls/:id', async (req, res) => {
  const { id } = req.params;
  const creatorId = (req.body && req.body.creatorId) || req.query.creatorId as string;

  try {
    const db = readDb();
    if (!validateSession(req, creatorId, 'admin')) {
      return res.status(401).json({ error: 'அட்மின்கள் மட்டுமே கருத்துக்கணிப்புகளை நீக்க முடியும்!' });
    }

    db.polls = db.polls.filter(p => p.id !== id);
    db.pollVotes = db.pollVotes.filter(v => v.pollId !== id);
    await writeDb(db);
    res.json({ success: true, message: 'Poll deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete poll' });
  }
});

// Export poll votes
router.get('/polls/:id/export', (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId as string;

  try {
    const db = readDb();
    if (!validateSession(req, userId, 'admin')) {
      return res.status(401).send('Unauthorized export');
    }

    const poll = db.polls.find(p => p.id === id);
    if (!poll) return res.status(404).send('Poll not found');

    const votes = db.pollVotes.filter(v => v.pollId === id);
    let csvContent = 'Full Name,Phone Number,Option,Date\n';
    votes.forEach(v => {
      csvContent += `"${(v.fullName || '').replace(/"/g, '""')}","${(v.phone || '').replace(/"/g, '""')}","${(v.option || '').toUpperCase()}","${new Date(v.createdAt).toLocaleDateString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="votes_poll_${poll.id}.csv"`);
    res.status(200).send(csvContent);
  } catch {
    res.status(500).send('Error generating export');
  }
});

// Authentication / Login (with phone sanitization and zero-fail admin support)
router.post('/auth/login', (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone number and password are required' });
  }

  try {
    const db = readDb();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const altPhone = cleanPhone.startsWith('0') ? '+94' + cleanPhone.slice(1) : (cleanPhone.startsWith('+94') ? '0' + cleanPhone.slice(3) : cleanPhone);

    const user = db.users.find(u => (u.phone === cleanPhone || u.phone === altPhone));

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'தவறான தொலைபேசி எண் அல்லது கடவுச்சொல்! (Invalid phone number or password!)' });
    }

    res.json({
      success: true,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Mount router on all rewrite variants
app.use('/api/server', router);
app.use('/api', router);
app.use('/', router);

export default app;
