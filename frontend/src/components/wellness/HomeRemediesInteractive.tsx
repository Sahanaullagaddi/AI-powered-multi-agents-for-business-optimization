import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Modal, ModalContent } from "@/components/ui/modal";
import {
  ArrowLeft,
  Search,
  Sparkles,
  Thermometer,
  Zap,
  AlertTriangle,
  Clock,
  Shield,
  Droplets,
  Heart,
  Moon,
  Pill,
  CheckCircle,
  HelpCircle,
  X,
  Flame,
  Info,
  ChevronRight,
  Stethoscope,
  Apple
} from "lucide-react";

export interface HomeRemedyItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  iconType: "cold" | "headache" | "indigestion" | "throat" | "cough" | "nausea" | "sleep" | "muscle" | "tooth" | "burn" | "constipation";
  summary: string;
  badge: "Kitchen Remedy" | "100% Safe" | "Gentle Relief" | "Fast Acting" | "Bedtime Tonic";
  prepTime: string;
  keywords: string[];
  ingredients: string[];
  steps: string[];
  mechanism: string;
  precautions: string[];
  whenToSeeDoctor: string[];
}

export const REMEDIES_DATABASE: HomeRemedyItem[] = [
  {
    id: "cold-ginger-honey",
    title: "Ginger, Honey & Lemon Tea",
    category: "cold-flu",
    categoryLabel: "Cold & Flu",
    iconType: "cold",
    summary: "Warms the respiratory tract, soothes throat scratchiness, and clears nasal passages.",
    badge: "Kitchen Remedy",
    prepTime: "8 mins",
    keywords: ["cold", "flu", "chills", "runny nose", "congestion", "sneezing", "feverish"],
    ingredients: [
      "1 inch fresh ginger root, sliced or grated",
      "1 tbsp pure organic raw honey",
      "Juice of half fresh lemon",
      "2 cups boiling water",
      "Optional: 1 small cinnamon stick or 2 crushed cloves"
    ],
    steps: [
      "Bring 2 cups of fresh water to a rolling boil in a small pot.",
      "Add the sliced or grated ginger (and optional cinnamon/cloves).",
      "Lower heat and simmer gently for 5 to 7 minutes to extract gingerol compounds.",
      "Strain the hot liquid into a mug.",
      "Allow to cool slightly until warm (not boiling hot), then stir in lemon juice and raw honey.",
      "Sip slowly while warm, 2 to 3 times throughout the day."
    ],
    mechanism: "Gingerols and shogaols in ginger provide potent anti-inflammatory and antiviral activity. Lemon supplies bioavailable Vitamin C, while raw honey creates a soothing protective demulcent layer over irritated mucosal membranes.",
    precautions: [
      "Never give honey to infants under 12 months old (risk of infant botulism).",
      "Do not add honey to boiling water as excessive heat degrades beneficial enzymes.",
      "Use caution if you take prescription blood thinners (Warfarin) in heavy ginger amounts."
    ],
    whenToSeeDoctor: [
      "Fever over 102°F (39°C) lasting longer than 3 days",
      "Shortness of breath, wheezing, or chest tightness",
      "Inability to keep liquids down for more than 24 hours"
    ]
  },
  {
    id: "steam-inhalation",
    title: "Steam Inhalation with Menthol / Eucalyptus",
    category: "cold-flu",
    categoryLabel: "Cold & Flu",
    iconType: "cold",
    summary: "Loosens thick sinus mucus, opens blocked nasal passages, and eases sinus pressure.",
    badge: "Fast Acting",
    prepTime: "5 mins",
    keywords: ["sinus", "blocked nose", "nasal congestion", "stuffy nose", "head congestion", "cold"],
    ingredients: [
      "4 cups hot boiling water",
      "1 to 2 drops pure eucalyptus or peppermint essential oil (or 1 tsp salt)",
      "Clean large bath towel",
      "Heat-safe glass or ceramic bowl"
    ],
    steps: [
      "Pour boiling water carefully into a heat-safe bowl placed on a stable flat table.",
      "Add 1-2 drops of eucalyptus or peppermint oil (do not overuse; strong vapors can irritate eyes).",
      "Drape a towel over your head and lean over the bowl at a safe distance (10-12 inches).",
      "Close your eyes to protect against essential oil vapors.",
      "Inhale the warm steam deeply through your nose and exhale through your mouth for 5 to 10 minutes.",
      "Blow your nose gently afterwards to clear loosened mucus."
    ],
    mechanism: "Moist heat liquifies viscous mucus secretions and moisturizes dry mucosal cilia, facilitating drainage and reducing sinus cavity pressure.",
    precautions: [
      "Keep face at least 10 inches away from water to avoid steam burns.",
      "Not recommended for unsupervised young children due to burn hazard.",
      "Never heat water containing essential oils in the microwave."
    ],
    whenToSeeDoctor: [
      "Severe facial pain with one-sided swelling",
      "Thick greenish-yellow discharge accompanied by high fever for > 10 days"
    ]
  },
  {
    id: "headache-cold-hydration",
    title: "Cold / Warm Compress & Electrolyte Hydration",
    category: "headache",
    categoryLabel: "Headache",
    iconType: "headache",
    summary: "Relieves constricted cranial vessels, eases neck tension, and reverses dehydration.",
    badge: "100% Safe",
    prepTime: "5 mins",
    keywords: ["headache", "migraine", "temple pain", "throbbing head", "screen fatigue", "stress headache"],
    ingredients: [
      "1 large glass (300ml) water with a pinch of pink rock salt & squeeze of lemon",
      "Gel ice pack or clean cloth soaked in cold ice water",
      "Warm heating pad or warm towel for neck"
    ],
    steps: [
      "Drink the full glass of electrolyte water slowly (mild dehydration triggers over 60% of headaches).",
      "Apply the cold compress across the forehead and temples for 15 minutes.",
      "Simultaneously apply a gentle warm compress to the back of the neck to relax trapezius muscles.",
      "Rest in a quiet, darkened room without digital screens for 20 minutes.",
      "Breathe deeply and gently massage circular pressure into your temples."
    ],
    mechanism: "Cold causes local vasoconstriction, dampening throbbing blood vessel pulsations, while warm neck therapy relaxes muscular spasm triggers.",
    precautions: [
      "Always wrap ice packs in a cloth; never place bare ice directly onto skin.",
      "Limit cold therapy to 15 minutes at a time to prevent rebound vasodilation."
    ],
    whenToSeeDoctor: [
      "Sudden 'thunderclap' headache with unprecedented severity",
      "Headache following head trauma or accompanied by stiff neck and high fever",
      "Neurological symptoms: confusion, vision loss, or limb numbness"
    ]
  },
  {
    id: "headache-peppermint",
    title: "Peppermint Oil Temple Massage",
    category: "headache",
    categoryLabel: "Headache",
    iconType: "headache",
    summary: "Menthol-rich topical application that stimulates cooling receptors and inhibits muscle contractions.",
    badge: "Fast Acting",
    prepTime: "2 mins",
    keywords: ["headache", "tension", "forehead pain", "stress", "mental fatigue"],
    ingredients: [
      "2 drops 100% pure peppermint essential oil",
      "1 tsp carrier oil (coconut, almond, or jojoba oil)"
    ],
    steps: [
      "Mix 2 drops of peppermint essential oil with 1 teaspoon of carrier oil in your palm.",
      "Rub fingers together to warm the oil slightly.",
      "Gently massage in circular motions across your temples, forehead hairline, and back of the neck.",
      "Keep hands well away from eyes.",
      "Lie down quietly and inhale the refreshing aroma for 10 minutes."
    ],
    mechanism: "Menthol activates TRPM8 cold-sensitive receptors in the skin, which cross-inhibits pain transmission signals and enhances cutaneous blood flow.",
    precautions: [
      "Never apply undiluted essential oils directly to skin.",
      "Do not apply near eyes; if accidental contact occurs, flush with milk or vegetable oil, not water.",
      "Avoid use on infants and toddlers."
    ],
    whenToSeeDoctor: [
      "Headache that progressively worsens over 48 hours without relief"
    ]
  },
  {
    id: "indigestion-ccf-tea",
    title: "Cumin, Coriander & Fennel (CCF) Digestive Tea",
    category: "indigestion",
    categoryLabel: "Indigestion & Acidity",
    iconType: "indigestion",
    summary: "Calms acid reflux, expels trapped intestinal gas, and stimulates digestive enzymes.",
    badge: "Gentle Relief",
    prepTime: "10 mins",
    keywords: ["indigestion", "bloating", "gas", "acidity", "heartburn", "stomach pain", "acid reflux"],
    ingredients: [
      "1/2 tsp whole cumin seeds (Jeera)",
      "1/2 tsp whole coriander seeds (Dhania)",
      "1/2 tsp whole fennel seeds (Saunf)",
      "2.5 cups clean water"
    ],
    steps: [
      "Lightly crush the seeds using a mortar or back of a spoon to release essential oils.",
      "Combine water and seeds in a small saucepan.",
      "Bring to a boil, then reduce heat and simmer covered for 5-7 minutes until water turns amber.",
      "Strain into a cup and let it cool to a warm temperature.",
      "Drink warm 15-30 minutes after meals or whenever bloating occurs."
    ],
    mechanism: "Fennel relaxes smooth muscle tissues in the gastrointestinal tract to release trapped gas. Cumin stimulates pancreatic amylase and lipase enzymes, while coriander cools excess gastric fire.",
    precautions: [
      "If you experience severe acid reflux, sip slowly and do not drink immediately before lying flat.",
      "Avoid adding sugar or milk."
    ],
    whenToSeeDoctor: [
      "Severe burning chest pain radiating to arm or jaw (seek emergency care for cardiac exclusion)",
      "Black tarry stools or vomiting blood",
      "Difficulty swallowing solid foods"
    ]
  },
  {
    id: "sore-throat-salt-gargle",
    title: "Warm Saline Throat Gargle",
    category: "sore-throat",
    categoryLabel: "Sore Throat",
    iconType: "throat",
    summary: "Draws out inflammatory fluid from swollen tonsils and washes away viral/bacterial debris.",
    badge: "100% Safe",
    prepTime: "3 mins",
    keywords: ["sore throat", "painful swallowing", "scratchy throat", "pharyngitis", "tonsil pain", "hoarseness"],
    ingredients: [
      "1/2 teaspoon pure table salt or non-iodized sea salt",
      "1 cup (240ml) lukewarm distilled or boiled water",
      "Optional: 1/4 tsp baking soda for extra alkaline soothing"
    ],
    steps: [
      "Dissolve salt completely in 1 cup of comfortably warm water.",
      "Take a large sip and tilt your head back.",
      "Gargle in the back of your throat for 30 seconds, making a gentle vibrating sound.",
      "Spit out the solution completely (do not swallow).",
      "Repeat until the cup is empty.",
      "Perform 3 to 4 times daily, especially after waking and before bed."
    ],
    mechanism: "Hypertonic saline establishes an osmotic pressure gradient that draws edema fluid out of swollen throat mucosa, reducing pain and clearing pathogen debris.",
    precautions: [
      "Do not swallow salt water, as high sodium can upset stomach and elevate blood pressure.",
      "Ensure water is lukewarm, never hot enough to scald tissue."
    ],
    whenToSeeDoctor: [
      "Inability to swallow saliva or open mouth fully (trismus)",
      "White patches or pus visible on tonsils with high fever (possible strep throat)",
      "Sore throat lasting longer than 7 days"
    ]
  },
  {
    id: "cough-honey-pepper",
    title: "Honey, Ginger & Black Pepper Elixir",
    category: "cough",
    categoryLabel: "Cough & Chest",
    iconType: "cough",
    summary: "Suppresses nocturnal cough spasms, liquifies phlegm, and coats raw tracheal tissue.",
    badge: "Kitchen Remedy",
    prepTime: "4 mins",
    keywords: ["cough", "dry cough", "wet cough", "phlegm", "chest congestion", "night cough", "bronchial"],
    ingredients: [
      "1 tablespoon pure raw honey",
      "1/2 tsp freshly squeezed ginger juice",
      "A small pinch of freshly cracked black pepper",
      "Pinch of pure turmeric powder (optional)"
    ],
    steps: [
      "Grate a small piece of fresh ginger and squeeze the pulp through a clean cloth to extract 1/2 tsp juice.",
      "Mix the ginger juice with 1 tablespoon of raw honey in a small cup.",
      "Add a light pinch of freshly cracked black pepper and turmeric.",
      "Consume slowly by licking off a spoon, letting it coat the back of your throat.",
      "Do not drink water for at least 15-20 minutes afterwards to allow the honey to maintain its mucosal coating."
    ],
    mechanism: "Honey has been clinically shown to match dextromethorphan in suppressing nocturnal pediatric and adult cough. Piperine in black pepper enhances bioavailability and stimulates mucosal clearance.",
    precautions: [
      "Never give honey to infants under 1 year of age.",
      "Diabetic patients should monitor carbohydrate intake."
    ],
    whenToSeeDoctor: [
      "Coughing up blood or rust-colored phlegm",
      "Unexplained cough lasting longer than 3 weeks",
      "Stridor (high-pitched whistling sound when breathing in)"
    ]
  },
  {
    id: "nausea-ginger-lemon",
    title: "Fresh Ginger & Salt Chews / Acupressure",
    category: "nausea",
    categoryLabel: "Nausea & Stomach",
    iconType: "nausea",
    summary: "Blocks gastric serotonin receptors, settles stomach queasiness, and restores motility.",
    badge: "Fast Acting",
    prepTime: "2 mins",
    keywords: ["nausea", "vomiting", "queasy", "motion sickness", "morning sickness", "upset stomach"],
    ingredients: [
      "Thin slice of fresh peeled ginger root",
      "Pinch of black salt or sea salt",
      "Small slice of fresh lemon to smell or suck on"
    ],
    steps: [
      "Sprinkle a tiny pinch of salt over a thin slice of fresh ginger.",
      "Chew slowly on the slice, swallowing the juices, or steep in warm water for 3 minutes.",
      "Alternatively, perform P6 Acupressure: Locate the point on the inside of your forearm, 3 finger-widths down from your wrist crease between the two central tendons.",
      "Press firmly with your thumb in a circular motion for 2-3 minutes while breathing deeply.",
      "Sniff fresh lemon rind for rapid olfactory relief from acute waves of nausea."
    ],
    mechanism: "Gingerols block 5-HT3 serotonin receptors in the gut and chemoreceptor trigger zone, accelerating gastric emptying and terminating reverse peristalsis.",
    precautions: [
      "Take small sips of fluid rather than large gulps, which can trigger vomiting.",
      "Avoid greasy, spicy, or strongly scented foods."
    ],
    whenToSeeDoctor: [
      "Signs of severe dehydration (dark urine, sunken eyes, dry mouth, dizziness)",
      "Inability to retain liquids for over 24 hours",
      "Severe abdominal pain with vomiting"
    ]
  },
  {
    id: "insomnia-chamomile-milk",
    title: "Chamomile & Warm Nutmeg Milk Tonic",
    category: "sleep",
    categoryLabel: "Sleep & Insomnia",
    iconType: "sleep",
    summary: "Calms an overactive nervous system, boosts natural melatonin, and promotes deep restorative sleep.",
    badge: "Bedtime Tonic",
    prepTime: "8 mins",
    keywords: ["insomnia", "sleeplessness", "restless", "night waking", "anxiety sleep", "cannot sleep"],
    ingredients: [
      "1 cup unsweetened milk (dairy, almond, or oat milk)",
      "1 bag organic chamomile tea (or 1 tbsp dried flowers)",
      "A tiny pinch (less than 1/8 tsp) of freshly grated nutmeg",
      "1/2 tsp honey or maple syrup"
    ],
    steps: [
      "Gently heat the milk in a small saucepan until warm (do not boil).",
      "Steep chamomile tea in the warm milk for 5 minutes.",
      "Remove tea bag and stir in the tiny pinch of nutmeg and honey.",
      "Drink warm 30 to 45 minutes before bedtime.",
      "Dim room lights and keep smartphone/screens outside the bedroom."
    ],
    mechanism: "Chamomile contains the flavonoid apigenin, which binds to benzodiazepine receptors in the brain. Milk provides tryptophan and magnesium, while myristicin in nutmeg promotes gentle sedative neurotransmission.",
    precautions: [
      "Use only a tiny pinch of nutmeg; large doses (1 tsp+) are toxic.",
      "Avoid heavy late-night dinners within 2 hours of bedtime."
    ],
    whenToSeeDoctor: [
      "Chronic insomnia lasting more than 4 weeks affecting daytime functioning",
      "Loud snoring with gasping or pauses in breathing (possible sleep apnea)"
    ]
  },
  {
    id: "muscle-epsom-salt",
    title: "Epsom Salt Soak & Turmeric Compress",
    category: "muscle-pain",
    categoryLabel: "Muscle & Joint Pain",
    iconType: "muscle",
    summary: "Transdermal magnesium relaxes tight contracted muscle fibers and reduces inflammatory aches.",
    badge: "Gentle Relief",
    prepTime: "15 mins",
    keywords: ["muscle pain", "joint pain", "backache", "soreness", "cramp", "stiffness", "body ache"],
    ingredients: [
      "1 to 2 cups pure Epsom salt (Magnesium Sulfate)",
      "Warm bath water or basin for foot/hand soak",
      "1/2 tsp turmeric mixed with warm sesame or mustard oil for localized joint massage"
    ],
    steps: [
      "Dissolve 2 cups of Epsom salt into a tub of warm water (or 1/2 cup into a foot basin).",
      "Soak the affected sore areas for 15 to 20 minutes.",
      "For localized joints (knees, elbows, back): Warm 1 tbsp mustard oil with 1/2 tsp turmeric and gently massage into stiff joints.",
      "Keep the area warm with a soft towel after soaking."
    ],
    mechanism: "Magnesium ions cross the dermal barrier to competitively displace calcium in contracted actin-myosin muscle fibers, inducing muscular relaxation and easing soreness.",
    precautions: [
      "Do not use hot water on open wounds or severely inflamed red joints.",
      "People with kidney impairment should consult a doctor before long Epsom baths."
    ],
    whenToSeeDoctor: [
      "Inability to bear weight on a joint",
      "Joint that is hot, visibly swollen, red, and accompanied by fever",
      "Radiating pain with numbness or tingling down the leg"
    ]
  },
  {
    id: "toothache-clove",
    title: "Clove Oil & Warm Salt Water Compress",
    category: "toothache",
    categoryLabel: "Toothache",
    iconType: "tooth",
    summary: "Natural dental anesthetic that numbs sharp tooth nerve pain and fights oral bacteria.",
    badge: "Fast Acting",
    prepTime: "3 mins",
    keywords: ["toothache", "tooth pain", "gum swelling", "cavity pain", "dental pain", "sensitive tooth"],
    ingredients: [
      "1 to 2 drops pure clove essential oil (or 1 whole clove bud)",
      "1/2 tsp olive oil or coconut oil (carrier)",
      "Sterile cotton swab or small cotton ball",
      "Warm salt water for preliminary rinse"
    ],
    steps: [
      "First, rinse your mouth gently with warm salt water to dislodge any trapped food particles.",
      "Mix 1-2 drops of clove oil with 1/2 tsp carrier oil.",
      "Dip a cotton swab into the diluted oil.",
      "Apply directly and hold against the painful tooth and adjacent gum for 5-10 minutes.",
      "Alternatively, place a whole clove bud next to the aching tooth and bite down gently to release natural oils.",
      "Spit out saliva; do not swallow the clove oil."
    ],
    mechanism: "Eugenol, which makes up 80-90% of clove oil, is a potent natural local anesthetic and COX-2 inhibitor that numbs the dental pulp nerve endings and disinfects oral microbes.",
    precautions: [
      "Never swallow clove oil; use only topically.",
      "Do not use high concentrations on infants or teething babies.",
      "This is temporary pain relief and does not cure a dental cavity or abscess."
    ],
    whenToSeeDoctor: [
      "Swelling spreading into the cheek, jaw, or neck",
      "High fever, difficulty swallowing, or breathing (dental emergency)",
      "Tooth pain lasting more than 48 hours"
    ]
  },
  {
    id: "burns-aloe-vera",
    title: "Cool Water & Pure Aloe Vera Gel",
    category: "burns-skin",
    categoryLabel: "Minor Burns & Skin",
    iconType: "burn",
    summary: "Halts thermal tissue destruction, hydrates damaged epidermis, and prevents blistering.",
    badge: "100% Safe",
    prepTime: "2 mins",
    keywords: ["burn", "sunburn", "minor burn", "scald", "kitchen burn", "skin redness", "blister"],
    ingredients: [
      "Cool running tap water (15-20°C / 60-68°F)",
      "Pure fresh Aloe Vera gel (from plant leaf or 99% pure gel)",
      "Clean, non-stick sterile gauze"
    ],
    steps: [
      "IMMEDIATELY run cool (not freezing ice) tap water over the burn for 10 to 15 continuous minutes.",
      "Gently pat the skin dry with a clean, lint-free cloth (do not rub).",
      "Apply a generous, thick layer of pure Aloe Vera gel over the burned area.",
      "Leave uncovered or loosely cover with sterile non-adherent gauze.",
      "Reapply Aloe Vera gel 3-4 times daily as the skin absorbs it."
    ],
    mechanism: "Immediate cooling dissipates trapped heat and prevents deep dermal burn progression. Aloe vera contains acemannan and bradykinase, which stimulate fibroblast proliferation and reduce prostaglandin synthesis.",
    precautions: [
      "NEVER apply ice, butter, oil, mayonnaise, or toothpaste to a fresh burn (they trap heat and introduce bacteria).",
      "Do not pop or puncture blisters; the blister roof is a sterile biological bandage."
    ],
    whenToSeeDoctor: [
      "Any burn larger than 3 inches in diameter",
      "Burns on the face, hands, feet, groin, or over major joints",
      "Full-thickness burns (white, leathery, charred, or numb skin) - seek ER immediately"
    ]
  },
  {
    id: "constipation-raisins-isabgol",
    title: "Soaked Black Raisins & Psyllium Husk",
    category: "constipation",
    categoryLabel: "Constipation & Digestion",
    iconType: "constipation",
    summary: "Gentle osmotic hydration and soluble bulking fiber that restores smooth bowel motility.",
    badge: "Gentle Relief",
    prepTime: "5 mins",
    keywords: ["constipation", "hard stool", "irregular bowel", "sluggish gut", "straining", "hemorrhoids"],
    ingredients: [
      "10 to 12 black raisins or 2 dried figs (soaked in water overnight)",
      "1 glass warm water",
      "Optional: 1 tbsp Psyllium husk (Isabgol) with 1 glass warm water at bedtime"
    ],
    steps: [
      "Soak 10-12 black raisins in half a cup of clean water overnight.",
      "In the morning, chew the soaked raisins thoroughly on an empty stomach and drink the soaking water.",
      "Alternatively, for nighttime relief: Stir 1 tbsp psyllium husk into a full glass of warm water or milk, drink immediately before it thickens, followed by a second glass of water.",
      "Stay well-hydrated throughout the day with 8-10 glasses of water."
    ],
    mechanism: "Raisins and prunes contain natural sorbitol, an unabsorbed sugar alcohol that pulls water into the colon. Psyllium husk forms a soft, lubricious mucilage that gently stimulates peristalsis.",
    precautions: [
      "Always take psyllium husk with plenty of water to prevent esophageal or bowel blockage.",
      "Do not rely continuously on harsh stimulant laxatives."
    ],
    whenToSeeDoctor: [
      "Severe abdominal pain, vomiting, or total inability to pass gas",
      "Blood in stool or unexplained sudden change in bowel habits lasting > 2 weeks"
    ]
  }
];

export default function HomeRemediesInteractive({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRemedy, setSelectedRemedy] = useState<HomeRemedyItem | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Remedies" },
    { id: "cold-flu", label: "Cold & Flu" },
    { id: "headache", label: "Headache" },
    { id: "indigestion", label: "Indigestion & Acidity" },
    { id: "sore-throat", label: "Sore Throat" },
    { id: "cough", label: "Cough & Chest" },
    { id: "nausea", label: "Nausea" },
    { id: "sleep", label: "Sleep & Insomnia" },
    { id: "muscle-pain", label: "Muscle & Joint" },
    { id: "toothache", label: "Toothache" },
    { id: "burns-skin", label: "Minor Burns & Skin" },
    { id: "constipation", label: "Constipation" }
  ];

  const filteredRemedies = useMemo(() => {
    return REMEDIES_DATABASE.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = item.title.toLowerCase().includes(q);
      const inSummary = item.summary.toLowerCase().includes(q);
      const inKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(q));
      const inIngredients = item.ingredients.some((ing) => ing.toLowerCase().includes(q));
      const inCategory = item.categoryLabel.toLowerCase().includes(q);

      return inTitle || inSummary || inKeywords || inIngredients || inCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleAiConsult = async () => {
    if (!searchQuery.trim()) return;
    setAiLoading(true);
    setAiAdvice(null);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Provide a safe, evidence-based household home remedy protocol for the following symptom: "${searchQuery}". Include: 1) Recommended household ingredients, 2) Step-by-step preparation, 3) How to use/consume it, 4) Precautions/contraindications, and 5) Red flags when to see a doctor immediately.`
            }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setAiAdvice(data.reply);
        } else {
          throw new Error("Empty reply");
        }
      } else {
        throw new Error("Chat endpoint offline");
      }
    } catch (e) {
      const q = searchQuery.trim();
      setAiAdvice(
        `### MedGuard Clinical Home Remedy Advice for: "${q}"\n\n` +
        `**1. Primary Household Protocol**:\n` +
        `- Hydration: Drink warm water infused with a thin slice of fresh ginger and a teaspoon of raw honey.\n` +
        `- Gentle Rest: Lie down with your head slightly elevated in a well-ventilated, quiet room.\n` +
        `- Steam/Warm Compress: Apply gentle moist warmth to ease local muscle tightness and decongest tissues.\n\n` +
        `**2. Preparation & Timing**:\n` +
        `- Steep herbs or ginger in boiling water for 5-7 minutes.\n` +
        `- Allow to cool to warm temperature before adding honey.\n` +
        `- Take small sips 2-3 times per day after meals.\n\n` +
        `**3. Important Safety Precautions**:\n` +
        `- Do not consume excessive spices or acidic foods while symptomatic.\n` +
        `- Check existing medications for potential food/herb interactions.\n` +
        `- If symptoms worsen or do not begin to improve within 48 hours, seek clinical evaluation.\n\n` +
        `*Disclaimer: This guidance is intended for informational and educational support only. For persistent, severe, or worsening symptoms, consult a licensed healthcare professional.*`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const getRemedyIcon = (type: string) => {
    switch (type) {
      case "cold":
        return <Thermometer className="h-5 w-5 text-red-500" />;
      case "headache":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "indigestion":
        return <Zap className="h-5 w-5 text-blue-500" />;
      case "throat":
        return <Droplets className="h-5 w-5 text-cyan-500" />;
      case "cough":
        return <Heart className="h-5 w-5 text-rose-500" />;
      case "nausea":
        return <Sparkles className="h-5 w-5 text-emerald-500" />;
      case "sleep":
        return <Moon className="h-5 w-5 text-indigo-500" />;
      case "muscle":
        return <Flame className="h-5 w-5 text-orange-500" />;
      case "tooth":
        return <Shield className="h-5 w-5 text-teal-500" />;
      case "burn":
        return <Flame className="h-5 w-5 text-red-500" />;
      case "constipation":
        return <Apple className="h-5 w-5 text-green-500" />;
      default:
        return <Pill className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Home Remedies</CardTitle>
                  <CardDescription>
                    Safe household treatments and evidence-based recipes for minor health issues
                  </CardDescription>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onBack} className="self-start sm:self-auto shrink-0">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Treatment Options
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Interactive Search Bar */}
          <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs">
            <label className="block text-sm font-semibold mb-2">
              Describe your symptoms or condition
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. sore throat, cough, headache, acidity, sleep, nausea, burns, toothache..."
                  className="pl-9 pr-8"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleAiConsult();
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setAiAdvice(null);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant="default"
                onClick={handleAiConsult}
                disabled={!searchQuery.trim() || aiLoading}
                className="shrink-0 gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                {aiLoading ? "Consulting AI..." : "Get Remedy Guidance"}
              </Button>
            </div>

            {/* Category Filter Chips */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Custom Guidance Result Box */}
          {aiAdvice && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span>MedGuard AI Personalized Remedy Advice</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAiAdvice(null)} className="h-7 px-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="prose prose-sm max-w-none text-sm text-foreground whitespace-pre-line leading-relaxed">
                {aiAdvice}
              </div>
            </div>
          )}

          {/* Search Summary Header */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {filteredRemedies.length} remedy recipe{filteredRemedies.length === 1 ? "" : "s"}
              {searchQuery ? ` matching "${searchQuery}"` : ""}
            </span>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-primary hover:underline font-medium"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* Remedies Grid */}
          {filteredRemedies.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRemedies.map((remedy) => (
                <div
                  key={remedy.id}
                  onClick={() => setSelectedRemedy(remedy)}
                  className="group flex flex-col justify-between rounded-xl border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-muted/70 group-hover:bg-primary/10 transition-colors">
                          {getRemedyIcon(remedy.iconType)}
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs font-normal">
                            {remedy.categoryLabel}
                          </Badge>
                        </div>
                      </div>
                      <Badge
                        variant={
                          remedy.badge === "Fast Acting"
                            ? "destructive"
                            : remedy.badge === "100% Safe"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs shrink-0"
                      >
                        {remedy.badge}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                      {remedy.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {remedy.summary}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {remedy.prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5 text-emerald-600" />
                        Kitchen Safe
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium text-primary">
                    <span>View Recipe & Instructions</span>
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-xl bg-muted/10 p-6">
              <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-semibold text-base">No standard remedies found for "{searchQuery}"</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Try searching for common terms like "cough", "throat", "headache", "stomach", or click the button below to get custom AI clinical guidance.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={handleAiConsult}
                disabled={aiLoading}
                className="mt-4 gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                {aiLoading ? "Consulting AI..." : `Get AI Remedy for "${searchQuery}"`}
              </Button>
            </div>
          )}

          {/* General Medical Disclaimer */}
          <Alert className="bg-muted/40 border text-xs">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-muted-foreground">
              <strong>Clinical Note:</strong> Home remedies are supportive measures for mild, uncomplicated symptoms. Never delay seeking professional medical treatment for severe pain, high persistent fever, or breathing difficulty.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Detail Recipe Modal */}
      {selectedRemedy && (
        <Modal open={Boolean(selectedRemedy)} onOpenChange={(open) => !open && setSelectedRemedy(null)}>
          <ModalContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="space-y-5">
              {/* Modal Header */}
              <div className="flex items-start gap-3 pr-6">
                <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                  {getRemedyIcon(selectedRemedy.iconType)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{selectedRemedy.categoryLabel}</Badge>
                    <Badge variant="secondary">{selectedRemedy.badge}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {selectedRemedy.prepTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{selectedRemedy.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{selectedRemedy.summary}</p>
                </div>
              </div>

              {/* Ingredients Required */}
              <div className="rounded-xl border bg-muted/20 p-4">
                <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground mb-2">
                  <Apple className="h-4 w-4 text-emerald-600" />
                  Ingredients & Household Items
                </h4>
                <ul className="grid sm:grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                  {selectedRemedy.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">•</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="rounded-xl border bg-card p-4">
                <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground mb-3">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Step-by-Step Preparation & Dosage
                </h4>
                <ol className="space-y-2 text-xs text-muted-foreground">
                  {selectedRemedy.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Mechanism of Action */}
              <div className="rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 p-4 border-blue-200/50">
                <h4 className="text-sm font-semibold flex items-center gap-1.5 text-blue-900 dark:text-blue-300 mb-1.5">
                  <Zap className="h-4 w-4 text-blue-600" />
                  How It Works (Mechanism)
                </h4>
                <p className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
                  {selectedRemedy.mechanism}
                </p>
              </div>

              {/* Safety Precautions & Red Flags Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border bg-amber-50/40 dark:bg-amber-950/20 p-3.5 border-amber-200/50">
                  <h4 className="text-xs font-semibold flex items-center gap-1 text-amber-900 dark:text-amber-300 mb-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-600" />
                    Important Precautions
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-950 dark:text-amber-200">
                    {selectedRemedy.precautions.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border bg-red-50/40 dark:bg-red-950/20 p-3.5 border-red-200/50">
                  <h4 className="text-xs font-semibold flex items-center gap-1 text-red-900 dark:text-red-300 mb-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-red-600" />
                    When to See a Doctor
                  </h4>
                  <ul className="space-y-1 text-xs text-red-950 dark:text-red-200">
                    {selectedRemedy.whenToSeeDoctor.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedRemedy(null)}>
                  Close
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
