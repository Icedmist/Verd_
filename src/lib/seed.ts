import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

const COURSES = [
  {
    id: 'intro-to-farming-expanded',
    title: 'Beginner Farming: The Complete Guide',
    description: 'An exhaustive, step-by-step introduction to starting your own successful farm from scratch.',
    lessons: [
      {
        id: 'the-farmers-mindset',
        title: 'Section 1: The Farmer\'s Mindset & Planning',
        content: 'Farming is more than just putting seeds in the ground; it is a life-long commitment to understanding the rhythm of nature. Before you even touch a tool, you must assess your goals. Are you farming for your family, or do you want to sell in the market? A professional-grade beginning requires a clear vision of your land\'s history. You must look for signs of previous usage: Are there stumps of old trees? Is the ground packed hard from years of cattle? You need to observe how the sun move across your plot. Most crops need at least six hours of direct, hot sun to produce enough sugar for a good harvest. If your land is shaded by big trees, you will need to trim them or find a new spot. Planning also means choosing the right season. Many beginners fail because they start too late in the rainy season, meaning their plants are still young and weak when the rains stop. A true farmer plans three months ahead, preparing the soil while the dry winds are still blowing so that they are ready to plant the very day the reliable rains arrive.',
        technicalDetails: [
          'Land Assessment: Walking the plot in a grid to identify low spots where water might sit.',
          'Sun Tracking: Marking the path of shadows at 9 AM, 12 PM, and 3 PM.',
          'Goal Setting: Calculating how much food your family eats vs. how much extra you can sell.',
          'Seasonal Alignment: Creating a 12-month calendar of tasks for prepare, plant, grow, and harvest.'
        ]
      },
      {
        id: 'professional-tool-kit',
        title: 'Section 2: The Professional Tool Kit',
        content: 'Your tools are an extension of your body, and a master farmer takes care of them as if they were made of gold. You start with three essentials: the hoe, the cutlass, and the watering can. A good hoe should have a handle made of strong, seasoned wood like African Teak (Iroko) or Rosewood to ensure it doesn\'t snap during heavy ridging. The blade should be made of high-carbon steel—if it bends easily, it is too soft and will blunt within days. For clearing land, a long-bladed cutlass with a heavy tip allows for easier swinging through thick elephant grass. But the real secret isn\'t just buying the tools; it is maintaining them. Every evening, you must scrape off the mud—mud holds moisture and moisture causes rust. A rusty hoe creates friction, which makes you twice as tired. Use a whetstone (a sharpening stone) at least once a week to keep the edge sharp enough to slice through a leaf. A sharp tool means you spend less energy and finish your work faster, leaving you with more strength for the rest of your day.',
        technicalDetails: [
          'Handle Selection: Looking for straight-grain wood without knots for maximum strength.',
          'Metal Quality: Testing the "ring" of the steel—a clear, high pitch usually means better carbon content.',
          'Sharpening Technique: Using a consistent 20-degree angle with the whetstone for a razor edge.',
          'Rust Prevention: Wiping the metal parts with a thin layer of old engine oil or vegetable oil after cleaning.'
        ]
      },
      {
        id: 'land-clearing-mastery',
        title: 'Section 3: Land Clearing Mastery',
        content: 'The biggest mistake new farmers make is "Slash and Burn." While burning is fast, it kills the small bugs and worms that make your soil fertile, and it turns all your future "Soil Food" into smoke. Instead, we use "Slash and Mulch." You cut the tall grass and small bushes down to the ground. Sharp tools are essential here. Once the grass is cut, you should leave it on the ground where it falls. This is your "Green Carpet." As it sits under the sun, it will dry out and begin to rot slowly. This rotting grass releases nutrients (like Nitrogen) directly back into the soil, keeping it cool and damp. For large tree stumps, do not try to dig them out all at once. If you cut the tree close to the ground and heap soil over the stump, it will rot away over a few years, eventually becoming a rich "hotspot" for nutrients. This slow, careful way of clearing takes more work in the beginning, but it ensures your soil stays powerful and productive for many years to come, rather than just one or two.',
        technicalDetails: [
          'Stumping: Identifying which trees can be cut and which should stay (like nitrogen-fixing Acacias).',
          'Residue Management: Chopping grass into small pieces so it rots faster on the surface.',
          'Biological Preservation: Avoiding fire to protect the Mycorrhizal fungi that help roots drink water.',
          'Erosion Control: Leaving "Buffer Strips" of uncut grass at the edges of your land to catch sediment.'
        ]
      }
    ],
    duration: '120 mins',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'soil-and-fertility-expanded',
    title: 'The Soil Secrets: Building Life in the Earth',
    description: 'A massive guide to understanding soil texture, composting, and natural fertility.',
    lessons: [
      {
        id: 'composting-science',
        title: 'Section 1: The Science of Composting',
        content: 'Soil is not just "dirt"—it is a living, breathing community. To feed this community, you must make "Farmer\'s Gold" or compost. The secret to great compost is the "Brown to Green" ratio. Imagine you are cooking a soup: the "Greens" are your fresh things like vegetable peels, fresh grass, and chicken manure. These are high in Nitrogen, which makes plants grow green and tall. The "Browns" are dry things like old leaves, straw, and shredded cardboard. these are high in Carbon, which gives the soil its structure and holds the water. A perfect pile is about 3 parts Brown for every 1 part Green. You heap them up in a shady spot, keeping it as damp as a wrung-out sponge. You must turn the pile with your hoe every two weeks. This brings air to the center. Inside, the "Heat of Life" will build up. If your pile is working correctly, it should get so hot that you can feel the steam when you turn it! After 3 or 4 months, the smells of rot will vanish, and you will be left with dark, crumbly, sweet-smelling earth that can triple your yields without a single gram of chemical fertilizer.',
        technicalDetails: [
          'C:N Ratio: Targeting roughly 30:1 for the fastest breakdown of organic materials.',
          'Aeration Protocol: Turning the pile to provide oxygen to the aerobic bacteria.',
          'Moisture Test: The "Squeeze Test"—only a few drops of water should come out when squeezed.',
          'Pile Sizing: Maintaining a minimum size of 1 meter x 1 meter to ensure the core stays hot.'
        ]
      },
      {
        id: 'soil-texture-test',
        title: 'Section 2: The Jar & Ribbon Test',
        content: 'Knowing what kind of soil you have determines how you water and what you plant. There are three main players: Sand, Silt, and Clay. Sand is big and gritty; it lets water through fast. Clay is tiny and sticky; it holds water like a sponge but can get hard like a rock when it dries. You can test your soil today using the "Jar Test." Fill a glass jar halfway with soil, add water, shake it up, and let it sit for a day. The layers will settle. Sand goes to the bottom first, then Silt, then Clay. An ideal soil, called "Loam," has a good mix of all three. If yours is mostly Sand, you must add a lot of compost to stop it from drying out. If it is mostly Clay, you must add organic matter to help the roots breathe. Alternatively, perform the "Ribbon Test": take a handful of damp soil and try to squeeze it into a ribbon between your thumb and finger. If the ribbon breaks quickly, you have Sandy soil. If it grows long and strong (like a snake), you have high Clay content. This simple knowledge tells you exactly what steps to take next.',
        technicalDetails: [
          'Sedimentation Rate: Sand settles in minutes, Silt in hours, Clay can take days.',
          'Interpreting Results: Identifying "Sandy Loam" vs "Clay Loam" based on layer thickness.',
          'Infiltration Rate: How fast water enters the soil (Sand is high, Clay is low).',
          'Porosity Calculation: Estimating the "Air Space" in your soil based on its feel.'
        ]
      }
    ],
    duration: '140 mins',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'planting-mastery-expanded',
    title: 'The Art of the Seed: From Soil to Sun',
    description: 'Exhaustive details on seed selection, germination science, and perfect planting rows.',
    lessons: [
      {
        id: 'germination-science',
        title: 'Section 1: The Science of Germination',
        content: 'Inside every seed is a tiny, sleeping plant waiting for the right moment to wake up. This waking up is called "Germination." For this to happen, the seed needs only three things: Water, Air, and Heat. If the ground is too cold, the seed sleeps. If the ground is too wet (waterlogged), the seed drowns. If it is too dry, the seed starts to wake up but then dies of thirst. Before you plant, you can "Wake Up" your seeds early using a technique called "Priming." Soak your seeds in a bowl of clean water for 12 to 24 hours just before you go to the field. This trick "pre-loads" the seed with the water it needs, helping it emerge from the ground 2-3 days faster than dry seeds. Fast emergence is vital because it means your plants get the sun first, overshadowing the small weed seeds that are also trying to grow. This is your plant\'s first victory in the race for survival.',
        technicalDetails: [
          'Imbibition: The process by which the seed absorbs water to activate internal enzymes.',
          'Turgor Pressure: The internal force that pushes the first root (radicle) through the seed coat.',
          'Osmotic Potential: Why high-salt fertilizers near the seed can "suck" water out and kill it.',
          'Metabolic Energy: Using the stored starch (endosperm) to fuel initial growth before leaves appear.'
        ]
      },
      {
        id: 'layout-and-rows',
        title: 'Section 2: Planting Layout & Rows',
        content: 'A farm that is messy is a farm that is hard to manage. A professional beginner uses "Rows." Rows allow you to walk between your plants without stepping on their roots and make weeding much easier. For Maize, a good distance is 75cm between the rows and 25cm between each plant in the row. You can use a long piece of string tied to two sticks to mark your straight lines—this is an old but perfect trick. Straight rows also allow for better "Air Flow." If plants are too crowded, the air becomes humid and still around the leaves, which is exactly what "Fungal Diseases" (mold) love most. By giving each plant its own "Bubble" of space, you ensure that every leaf gets its fair share of sun and that the wind can dry off the morning dew quickly, preventing diseases from ever starting. For hills or slopes, always plant across the hill (contours), never up and down, to stop the rain from washing your soil and seeds away.',
        technicalDetails: [
          'Plant Population Calculation: Determining how many seeds you need per hectare.',
          'Contour Ridging: Creating small barriers to slow down runoff water on slopes.',
          'Inter-Row Spacing: Adjusting width to accommodate your tools (hoe width).',
          'Alley Cropping: Leaving wider paths for permanent access or inter-cropping with legumes.'
        ]
      }
    ],
    duration: '110 mins',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1591110023414-bc483259929e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pest-ecology-expanded',
    title: 'The Farm Guardians: Safe Pest Protection',
    description: 'Detailed protocols for managing pests and building a healthy farm ecosystem.',
    lessons: [
      {
        id: 'insect-identification',
        title: 'Section 1: Friend vs. Foe Identification',
        content: 'Not every bug is an enemy! A farmer must be part scientist and part detective. Most bugs are either "Friendly Predators" or "Destructive Pests." Friendly bugs like Spiders, Ladybugs, and Lacewings are your best workers—they eat thousands of bad bugs for free. If you use strong chemical poisons, you kill your friends first, which actually makes your pest problem worse! To identify a foe, look for the damage: Are the leaves being chewed? (Caterpillars/Grasshoppers). Are the leaves curling and turning yellow? (Aphids). Or do you see "Windows" in the leaves? (Armyworms). Once you identify the culprit, you can target them specifically. For big bugs, morning hand-picking is the gold standard. For tiny bugs, you can often just blast them off with a strong stream of water or a simple soap spray. Protecting your "Biological Balance" ensures that your farm stays healthy forever, rather than becoming dependent on expensive and dangerous chemicals.',
        technicalDetails: [
          'Mouthparts Assessment: Chewing (holes) vs Piercing-Sucking (distortion/yellowing).',
          'Beneficial Habitats: Planting flowers or leaving grass strips to host predator bugs.',
          'Pest Thresholds: Deciding when there are enough bugs to actually cause yield loss.',
          'Life Cycle Mapping: Identifying which bugs come early (seedlings) vs late (flowering).'
        ]
      },
      {
        id: 'botanical-defense',
        title: 'Section 2: Botanical Defense Formulas',
        content: 'You can create powerful, professional-grade pest repellents using only biological materials from your environment. One of the best is the "Neem Extract." Neem trees grow all over the Savannah and their seeds and leaves contain "Azadirachtin"—a chemical that stops bugs from eating and growing. To make it, crush 1kg of fresh Neem seeds or 2kg of leaves, soak them in 10 liters of water for 24 hours, and then strain the liquid. Add a tiny bit of soap to help it stick to the leaves. Another great one is the "Hot Pepper & Garlic Spray." Blend 10 hot peppers and 3 heads of garlic with a liter of water, let it sit for a day, and then dilute it into 10 liters of spray water. This doesn\'t kill the bugs, but the smell is so strong and the taste so bad that bugs will leave your field and go to your neighbor\'s (unless your neighbor also uses it!). These sprays are safe for you to touch and safe for your family to eat, but they are a nightmare for the pests.',
        technicalDetails: [
          'Extraction Efficiency: The benefits of crushing seeds into a fine powder for better release.',
          'Soap Emulsification: Why soap is needed to mix oil-based poisons with water.',
          'UV Degradation: Why you must spray in the evening (sunlight breaks down botanical poisons).',
          'Formula Dilution: Adjusting strength based on the "Toughness" of the pest (soft-bodied vs beetles).'
        ]
      }
    ],
    duration: '130 mins',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1594632831110-3856b3e8354c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'harvest-biology-expanded',
    title: 'The Harvest Master: From Field to Storage',
    description: 'Massive details on crop maturity, drying science, and long-term grain preservation.',
    lessons: [
      {
        id: 'maturity-indicators',
        title: 'Section 1: Visual Maturity Indicators',
        content: 'Harvesting too early means you lose yield; harvesting too late means you lose quality to birds, insects, and mold. You must watch for "Physiological Maturity"—the moment the plant stops feeding the fruit or grain. For Maize, the ear will hang down low, and the husks will turn white and dry like paper. If you pick a kernel and look at the bottom (where it attaches to the cob), you should see a "Black Layer." This is the plant\'s way of "closing the door"—no more food can go in. For vegetables like Peppers or Tomatoes, look for the "Full Color" and a slight softening of the skin. Watermelon is ready when the small "curly-tail" vine nearest the fruit turns totally brown and dry. Mastering these visual signs ensures that you capture every bit of weight and sugar your plants worked so hard to create. Use a sharp knife for harvesting; pulling can tear the plant and create open wounds that let rot-fungi in for the next season.',
        technicalDetails: [
          'Abscission Layer: The biological "plug" that forms at the base of a mature grain.',
          'Brix Levels: Understanding how sugar concentration affects ripeness and shelf-life.',
          'Harvest Windows: Identifying the 7-day period for peak nutritional value.',
          'Post-Harvest Respiration: Why fruit continues to "breathe" and produce heat after being picked.'
        ]
      },
      {
        id: 'hermetic-drying-science',
        title: 'Section 2: Drying & Hermetic Storage',
        content: 'The real battle for your crop begins after you pick it. To store grain for a long time, you must win the "Moisture War." Grains like Maize and Beans MUST be dried until they are as hard as teeth. You can test this by biting a grain—if your teeth leave a mark, it is too wet. If the grain "shatters" or makes a loud "crack," it is safely dry. Use clean mats in the hot sun, spreading the grain in a thin layer and stirring it every few hours. Once dry, we use the "Hermetic Secret" (air-tight storage). Pests like weevils need air to live. If you put dry grain in a plastic bag or a barrel and seal it so no air can get in OR out, the bugs will quickly eat up the tiny bit of air left and then fall asleep forever. No air means no bugs and no mold. This "Nature\'s Suicide" for pests is the only 100% safe way to keep your harvest fresh for over a year without using dangerous chemical powders that can poison your family or the people you sell to.',
        technicalDetails: [
          'EMC (Equilibrium Moisture Content): The point where the grain stops losing water to the air.',
          'Hygrometer Usage: Simple tools to measure the humidity inside your storage bags.',
          'PICS Bag Construction: How three layers of plastic work together to stop air movement.',
          'Aflatoxin Prevention: Keeping moisture below 12% to stop Aspergillus fungus from making poison.'
        ]
      }
    ],
    duration: '150 mins',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1590682680695-32269a997232?auto=format&fit=crop&q=80&w=800'
  }
];

const TIPS = [
  "Test your soil annually to understand specific nutrient needs and pH levels.",
  "Minimize tillage to prevent erosion and preserve vital soil structure.",
  "Keep soil covered with mulch or crop residues to reduce moisture evaporation.",
  "Plant cover crops during fallow periods to protect the soil from the sun.",
  "Use legumes in rotation to naturally fix nitrogen in the soil.",
  "Add organic matter like compost or well-rotted manure to boost fertility.",
  "Practice crop rotation to prevent the depletion of specific soil nutrients.",
  "Check for compaction; if roots struggle to grow deep, consider light aeration.",
  "Observe water infiltration after rain; fast runoff indicates a need for better cover.",
  "Build raised beds to improve drainage in areas prone to heavy seasonal rains.",
  "Avoid over-fertilizing; excess nitrogen can weaken plants and attract pests.",
  "Monitor soil pH; if too acidic, apply lime to make nutrients available to crops.",
  "Use precision placement for fertilizer to maximize uptake and minimize waste.",
  "Maintain field borders with native vegetation to prevent soil washing away.",
  "Record soil moisture trends to optimize your irrigation or planting schedule.",
  "Promote earthworm activity by reducing chemical inputs and increasing organic material.",
  "Avoid working wet soil, as it causes compaction and destroys soil structure.",
  "Use a spade to dig periodic pits to inspect root depth and soil quality.",
  "Rotate livestock across fields to naturally fertilize soil through manure.",
  "Avoid burning residues; let them decompose on the surface to build soil carbon.",
  "Select drought-tolerant varieties suited for your specific savannah region.",
  "Diversify crops to reduce the risk of total failure from one specific threat.",
  "Scout your fields weekly, walking in a zigzag pattern to check for issues.",
  "Observe leaf color; yellowing often indicates nutrient deficiency or water stress.",
  "Check plant vigor; stunted growth is an early warning sign of deeper problems.",
  "Ensure proper plant spacing to allow airflow and reduce fungal disease spread.",
  "Plant at the right time; align planting with reliable rain forecasts.",
  "Use certified, high-quality seeds to ensure strong, healthy germination.",
  "Remove diseased plants immediately to stop the spread to healthy neighbors.",
  "Water early in the morning to reduce evaporation and fungal growth.",
  "Use drip irrigation if possible to deliver water directly to the root zone.",
  "Prune diseased branches to encourage healthy growth and airflow.",
  "Monitor bloom times to understand if crops are meeting their growth milestones.",
  "Use windbreaks if your area is prone to hot, drying savannah winds.",
  "Keep detailed records of planting dates, yields, and issues for future planning.",
  "Intercrop different species to disrupt pest cycles and share resources.",
  "Protect seedlings from extreme heat with temporary shading if necessary.",
  "Ensure crop depth is consistent for uniform emergence and growth.",
  "Monitor for signs of wilting; it could be a sign of root rot or drought.",
  "Use bio-stimulants to help crops cope with periods of heat or water stress.",
  "Identify pests correctly before applying any control measures.",
  "Encourage natural predators like birds, spiders, and ladybugs.",
  "Use pheromone traps to monitor pest levels without spraying chemicals.",
  "Implement Integrated Pest Management (IPM) by prioritizing non-chemical methods.",
  "Plant trap crops around your field to attract pests away from main crops.",
  "Hand-pick large pests early in the morning when they are less active.",
  "Use physical barriers like netting to protect high-value crops from insects.",
  "Maintain clean field edges; weeds often harbor pests and diseases.",
  "Clean farming tools after working in infested areas to stop spread.",
  "Apply neem oil or soap-based sprays only when pest thresholds are reached.",
  "Rotate families of crops; pests that love one family won't like the next.",
  "Encourage biodiversity; diverse farms host more beneficial insects.",
  "Scout for egg masses on the undersides of leaves and destroy them.",
  "Use yellow or blue sticky traps to monitor flying insect populations.",
  "Store harvest properly to protect it from storage pests.",
  "Avoid prophylactic spraying; only treat when necessary to save costs.",
  "Plant at times that avoid peak pest emergence based on local knowledge.",
  "Look for natural holes in leaves as a sign of early insect activity.",
  "Use resistant crop varieties as the first line of defense against common diseases.",
  "Share information with neighbors to coordinate pest control efforts across farms."
];

export const seedCourses = async () => {
  try {
    const batch = writeBatch(db);
    
    // Seed Courses
    for (const course of COURSES) {
      const courseRef = doc(collection(db, 'courses'), course.id);
      batch.set(courseRef, course);
    }

    // Seed Tips
    TIPS.forEach((text, i) => {
      const tipRef = doc(collection(db, 'tips'), `tip_${i}`);
      batch.set(tipRef, { text, index: i });
    });
    
    await batch.commit();
    console.log('✅ CRUD SUCCESS: 20x Expanded Beginner Courses and Tips seeded successfully');
  } catch (err) {
    console.error('❌ CRUD ERROR: Failed to seed data:', err);
    throw err;
  }
};
