import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
  process.exit(1);
}

   const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Data pools for generating realistic players
const firstNames = ['Lukas', 'Maximilian', 'Felix', 'Jonas', 'Leon', 'Paul', 'Finn', 'Elias', 'Noah', 'Ben', 'Luca', 'Moritz', 'Tim', 'Julian', 'Niklas', 'David', 'Simon', 'Tobias', 'Jan', 'Fabian', 'Alexander', 'Sebastian', 'Florian', 'Daniel', 'Marco', 'Luca', 'Matteo', 'Giovanni', 'Alessandro', 'Mateo'];
const lastNames = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Krause', 'Meier', 'Lehmann', 'Schmid'];
const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
const clubs = ['FC Bayern München', 'Borussia Dortmund', 'RB Leipzig', 'Bayer 04 Leverkusen', 'VfB Stuttgart', 'Eintracht Frankfurt', 'Borussia Mönchengladbach', 'VfL Wolfsburg', 'SC Freiburg', '1. FC Union Berlin'];
const nationalities = ['German', 'German', 'German', 'German', 'French', 'Spanish', 'Italian', 'Dutch', 'Portuguese', 'Brazilian']; // Weighted towards German

const traits = [
  'exceptional pace and dribbling', 'strong tactical awareness', 'great vision and passing', 
  'dominant in the air', 'excellent finishing', 'solid defensive positioning', 
  'creative playmaking', 'high work rate', 'great leadership qualities', 'technical brilliance'
];

// Helper to get random item
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate 50 unique players
const playersToInsert = [];

for (let i = 0; i < 50; i++) {
  const age = randomInt(8, 18);
  const position = random(positions);
  const firstName = random(firstNames);
  const lastName = random(lastNames);
  const name = `${firstName} ${lastName}`;
  const club = `${random(clubs)} U${age > 15 ? 17 : 15}`; // e.g., FC Bayern München U17
  const nationality = random(nationalities);
  
  // Calculate realistic youth market values and sponsor quotas based on age
  const baseValue = age * 15000; 
  const marketValue = baseValue + randomInt(5000, 50000);
  const sponsorQuota = Math.floor(marketValue * 0.1); // Sponsor quota is 10% of market value
  
  const contractYear = 2024 + randomInt(1, 4);
  const contractExpiry = `06.${contractYear}`;

  // Generate unique bio and stats
  const trait1 = random(traits);
  const trait2 = random(traits.filter(t => t !== trait1));
  const bio = `A highly promising ${age}-year-old ${position} known for ${trait1} and ${trait2}. Shows great potential for senior football.`;
  const careerStats = `U${age > 10 ? age - 2 : 8}: 15 apps, 4 goals | Current Season: 12 apps, 6 goals, 3 assists`;
  const transferHistory = `${contractYear - 2}: Joined ${club} Youth | ${contractYear - 4}: Signed with local academy`;

  // Use pravatar.cc for realistic, unique headshots (images 1 to 70)
  const imageUrl = `https://i.pravatar.cc/300?img=${randomInt(1, 70)}`;

  playersToInsert.push({
    name,
    club,
    position,
    age,
    nationality,
    contract_expiry: contractExpiry,
    market_value: marketValue,
    sponsor_owed: sponsorQuota,
    payment_status: 'pending',
    payment_method: 'crypto',
    payment_contact: '',
    bio,
    career_stats: careerStats,
    transfer_history: transferHistory,
    image_url: imageUrl
  });
}

// Insert into Supabase in batches of 10 to avoid payload limits
async function seedDatabase() {
  console.log(`Starting seed... Generating ${playersToInsert.length} players.`);
  
  for (let i = 0; i < playersToInsert.length; i += 10) {
    const batch = playersToInsert.slice(i, i + 10);
    const { data, error } = await supabase.from('players').insert(batch);
    
    if (error) {
      console.error(`Error inserting batch ${i/10 + 1}:`, error);
    } else {
      console.log(`Successfully inserted batch ${i/10 + 1} (10 players)`);
    }
  }
  
  console.log('Seed complete! Check your Admin Dashboard.');
}

seedDatabase();