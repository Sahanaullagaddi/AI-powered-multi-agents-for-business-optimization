import { useState, type ReactNode } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  AlertTriangle,
  Apple,
  ArrowLeft,
  Bell,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Droplets,
  Heart,
  Home,
  Moon,
  Pill,
  Plus,
  Shield,
  Stethoscope,
  Sun,
  Target,
  Thermometer,
  User,
  Zap,
} from "lucide-react";
import { Modal, ModalTrigger, ModalContent, ModalOverlay, ModalClose } from "@/components/ui/modal";
import DailyWellnessPlanner from "@/components/wellness/DailyWellnessPlanner";
import HomeRemediesInteractive from "@/components/wellness/HomeRemediesInteractive";

type HealthStatus = "healthy" | "unhealthy" | "risk-check" | "wellness-planner" | null;
type TreatmentType = "modern" | "traditional" | "home-remedies" | "consult-doctor" | null;

export default function Healthy() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>(null);
  const [treatmentType, setTreatmentType] = useState<TreatmentType>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Modern medicine form state
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [existingMeds, setExistingMeds] = useState("");
  const [allergies, setAllergies] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Traditional medicine form state
  const [traditionalSymptoms, setTraditionalSymptoms] = useState("");
  const [traditionalCondition, setTraditionalCondition] = useState("");
  const [traditionalSuggestions, setTraditionalSuggestions] = useState<any[]>([]);

  // Lifestyle practices state
  const [diseases, setDiseases] = useState("");
  const [showLifestyleRecommendations, setShowLifestyleRecommendations] = useState(false);

  // Ayurvedic state
  const [ayurvedicConditions, setAyurvedicConditions] = useState("");
  const [showAyurvedicResults, setShowAyurvedicResults] = useState(false);

  // Risk check state
  const [riskAge, setRiskAge] = useState("");
  const [riskGender, setRiskGender] = useState("");
  const [riskSymptoms, setRiskSymptoms] = useState("");
  const [riskLifestyle, setRiskLifestyle] = useState<string[]>([]);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [riskResult, setRiskResult] = useState<ReactNode>("");

  // Wellness planner state
  const [completedTasks, setCompletedTasks] = useState<string[]>(["morning-routine"]);

  const getDiseaseBasedRecommendations = (diseaseInput: string) => {
    const diseases = diseaseInput.toLowerCase().split(',').map(d => d.trim());
    const recommendations: any = {
      yoga: [],
      pranayama: []
    };

    diseases.forEach(disease => {
      if (disease.includes('diabetes') || disease.includes('blood sugar')) {
        recommendations.yoga.push({
          name: "Dhanurasana (Bow Pose)",
          description: "Strengthens pancreas and improves insulin sensitivity",
          duration: "Hold for 20-30 seconds, repeat 3 times"
        });
        recommendations.yoga.push({
          name: "Halasana (Plow Pose)",
          description: "Stimulates thyroid and improves metabolism",
          duration: "Hold for 30-60 seconds"
        });
        recommendations.pranayama.push({
          name: "Bhastrika Pranayama",
          description: "Increases oxygen supply and helps regulate blood sugar",
          duration: "10-15 rounds, 3 times daily"
        });
      }

      if (disease.includes('hypertension') || disease.includes('high blood pressure') || disease.includes('bp')) {
        recommendations.yoga.push({
          name: "Shavasana (Corpse Pose)",
          description: "Deep relaxation that lowers blood pressure",
          duration: "5-10 minutes daily"
        });
        recommendations.yoga.push({
          name: "Viparita Karani (Legs Up the Wall)",
          description: "Improves circulation and reduces stress",
          duration: "5-10 minutes"
        });
        recommendations.pranayama.push({
          name: "Anulom Vilom (Alternate Nostril Breathing)",
          description: "Balances autonomic nervous system and reduces blood pressure",
          duration: "5-10 minutes, twice daily"
        });
      }

      if (disease.includes('anxiety') || disease.includes('stress') || disease.includes('depression')) {
        recommendations.yoga.push({
          name: "Balasana (Child's Pose)",
          description: "Calms the mind and reduces anxiety",
          duration: "1-2 minutes as needed"
        });
        recommendations.yoga.push({
          name: "Setu Bandhasana (Bridge Pose)",
          description: "Opens chest and improves mood",
          duration: "Hold for 20-30 seconds, repeat 3 times"
        });
        recommendations.pranayama.push({
          name: "Bhramari Pranayama (Bee Breath)",
          description: "Instantly reduces anxiety and calms the nervous system",
          duration: "5-10 rounds, as needed"
        });
        recommendations.pranayama.push({
          name: "4-7-8 Breathing",
          description: "Powerful technique for instant relaxation",
          duration: "4 cycles, before sleep"
        });
      }

      if (disease.includes('asthma') || disease.includes('respiratory') || disease.includes('breathing')) {
        recommendations.yoga.push({
          name: "Matsyasana (Fish Pose)",
          description: "Opens chest and improves lung capacity",
          duration: "Hold for 15-30 seconds, repeat 2-3 times"
        });
        recommendations.yoga.push({
          name: "Bhujangasana (Cobra Pose)",
          description: "Strengthens respiratory muscles",
          duration: "Hold for 15-20 seconds, repeat 3 times"
        });
        recommendations.pranayama.push({
          name: "Ujjayi Pranayama",
          description: "Builds lung capacity and improves breathing control",
          duration: "5-10 minutes daily"
        });
        recommendations.pranayama.push({
          name: "Kapalabhati",
          description: "Clears respiratory passages and strengthens lungs",
          duration: "20 breaths per round, 3 rounds"
        });
      }

      if (disease.includes('arthritis') || disease.includes('joint pain') || disease.includes('back pain')) {
        recommendations.yoga.push({
          name: "Marjaryasana-Bitilasana (Cat-Cow Pose)",
          description: "Improves spinal flexibility and relieves joint pain",
          duration: "5-10 rounds of 5 breaths each"
        });
        recommendations.yoga.push({
          name: "Trikonasana (Triangle Pose)",
          description: "Strengthens legs and improves joint mobility",
          duration: "Hold for 20-30 seconds per side"
        });
        recommendations.pranayama.push({
          name: "Nadi Shodhana (Alternate Nostril Breathing)",
          description: "Balances energy and reduces inflammation",
          duration: "5-10 minutes daily"
        });
      }

      if (disease.includes('insomnia') || disease.includes('sleep')) {
        recommendations.yoga.push({
          name: "Supta Baddha Konasana (Reclined Bound Angle)",
          description: "Promotes deep relaxation and better sleep",
          duration: "5-10 minutes before bed"
        });
        recommendations.yoga.push({
          name: "Paschimottanasana (Seated Forward Bend)",
          description: "Calms the nervous system and reduces stress",
          duration: "Hold for 1-2 minutes"
        });
        recommendations.pranayama.push({
          name: "4-7-8 Breathing",
          description: "Prepares body for deep sleep",
          duration: "4 cycles before bedtime"
        });
        recommendations.pranayama.push({
          name: "Sheetali Pranayama (Cooling Breath)",
          description: "Lowers body temperature and induces sleep",
          duration: "5-10 minutes before bed"
        });
      }

      // Default recommendations if no specific disease matches
      if (recommendations.yoga.length === 0) {
        recommendations.yoga.push({
          name: "Surya Namaskar (Sun Salutation)",
          description: "Complete body workout and stress relief",
          duration: "5-10 rounds daily"
        });
        recommendations.pranayama.push({
          name: "Pranayama Basics",
          description: "Foundation breathing exercises for overall health",
          duration: "5-10 minutes daily"
        });
      }
    });

    return recommendations;
  };

  const getAyurvedicRecommendations = (conditions: string) => {
    const conditionList = conditions.toLowerCase().split(',').map(c => c.trim());
    const recommendations = {
      dosha: '',
      herbs: [] as any[],
      diet: [] as string[],
      lifestyle: [] as string[],
      therapies: [] as string[]
    };

    conditionList.forEach(condition => {
      if (condition.includes('diabetes') || condition.includes('blood sugar') || condition.includes('hyperglycemia')) {
        recommendations.dosha = 'Kapha imbalance with Vata aggravation';
        recommendations.herbs.push(
          { name: 'Gymnema Sylvestre (Gurmar)', benefits: 'Reduces sugar cravings, supports pancreas function', dosage: '300-400mg twice daily' },
          { name: 'Bitter Melon (Karela)', benefits: 'Natural insulin-like properties, regulates blood sugar', dosage: '500mg twice daily' },
          { name: 'Fenugreek Seeds', benefits: 'Improves insulin sensitivity, lowers blood sugar', dosage: '1 tsp soaked overnight' },
          { name: 'Turmeric', benefits: 'Anti-inflammatory, supports pancreatic health', dosage: '500mg twice daily with meals' }
        );
        recommendations.diet = [
          'Avoid refined sugars and processed foods',
          'Include bitter vegetables like bitter gourd, fenugreek leaves',
          'Consume whole grains, legumes, and healthy fats',
          'Drink herbal teas like cinnamon, turmeric, and ginger'
        ];
        recommendations.lifestyle = [
          'Practice yoga asanas like Dhanurasana and Halasana',
          'Walk 30-45 minutes daily after meals',
          'Practice stress management techniques',
          'Maintain regular sleep schedule (10 PM - 6 AM)'
        ];
        recommendations.therapies = [
          'Abhyanga (oil massage) with sesame oil',
          'Panchakarma detoxification (under supervision)',
          'Marma therapy for endocrine balance'
        ];
      }

      if (condition.includes('hypertension') || condition.includes('high blood pressure') || condition.includes('bp')) {
        recommendations.dosha = 'Pitta aggravation with Vata involvement';
        recommendations.herbs.push(
          { name: 'Arjuna', benefits: 'Strengthens heart muscles, regulates blood pressure', dosage: '500mg twice daily' },
          { name: 'Sarpagandha (Rauwolfia)', benefits: 'Natural blood pressure regulator', dosage: '100-200mg twice daily' },
          { name: 'Gotu Kola (Brahmi)', benefits: 'Calms nervous system, reduces stress', dosage: '300mg twice daily' },
          { name: 'Garlic', benefits: 'Lowers blood pressure, improves circulation', dosage: '300-600mg daily' }
        );
        recommendations.diet = [
          'Reduce salt intake significantly',
          'Include cooling foods like cucumber, watermelon',
          'Avoid spicy, oily, and fermented foods',
          'Consume garlic, onions, and beetroot regularly'
        ];
        recommendations.lifestyle = [
          'Practice Shavasana and gentle yoga poses',
          'Avoid stress and anger-provoking situations',
          'Maintain regular sleep and wake cycles',
          'Practice meditation for 15-20 minutes daily'
        ];
        recommendations.therapies = [
          'Shirodhara (oil therapy for head)',
          'Nasya (nasal therapy) with medicated oils',
          'Udvartana (herbal powder massage)'
        ];
      }

      if (condition.includes('anxiety') || condition.includes('stress') || condition.includes('depression') || condition.includes('mental health')) {
        recommendations.dosha = 'Vata aggravation with possible Pitta involvement';
        recommendations.herbs.push(
          { name: 'Ashwagandha', benefits: 'Adaptogen, reduces stress and anxiety', dosage: '300-600mg twice daily' },
          { name: 'Brahmi (Gotu Kola)', benefits: 'Enhances cognitive function, calms mind', dosage: '300mg twice daily' },
          { name: 'Jatamansi', benefits: 'Natural tranquilizer, improves sleep quality', dosage: '300mg twice daily' },
          { name: 'Shankhpushpi', benefits: 'Memory enhancer, reduces mental fatigue', dosage: '500mg twice daily' }
        );
        recommendations.diet = [
          'Include warm, cooked foods and herbal teas',
          'Avoid caffeine, alcohol, and processed foods',
          'Consume ghee, nuts, and warm milk with spices',
          'Include turmeric, ginger, and cinnamon in diet'
        ];
        recommendations.lifestyle = [
          'Practice meditation and pranayama daily',
          'Maintain regular daily routine (Dinacharya)',
          'Spend time in nature and avoid overstimulation',
          'Practice self-massage (Abhyanga) with warm oil'
        ];
        recommendations.therapies = [
          'Shirodhara therapy for mental relaxation',
          'Panchakarma for deep detoxification',
          'Marma therapy for energy balancing'
        ];
      }

      if (condition.includes('arthritis') || condition.includes('joint pain') || condition.includes('inflammation')) {
        recommendations.dosha = 'Ama accumulation with Vata aggravation';
        recommendations.herbs.push(
          { name: 'Guggulu', benefits: 'Anti-inflammatory, reduces joint pain', dosage: '500mg twice daily' },
          { name: 'Turmeric (Curcumin)', benefits: 'Powerful anti-inflammatory properties', dosage: '500mg twice daily' },
          { name: 'Boswellia (Shallaki)', benefits: 'Reduces joint inflammation and pain', dosage: '300mg twice daily' },
          { name: 'Nirgundi', benefits: 'Pain relief, reduces swelling', dosage: '300mg twice daily' }
        );
        recommendations.diet = [
          'Avoid nightshades (potatoes, tomatoes, peppers)',
          'Include anti-inflammatory foods like turmeric, ginger',
          'Consume warm, cooked foods and herbal teas',
          'Include healthy fats like ghee and coconut oil'
        ];
        recommendations.lifestyle = [
          'Practice gentle yoga and joint mobility exercises',
          'Apply warm oil massages to affected areas',
          'Maintain ideal body weight',
          'Avoid cold and damp environments'
        ];
        recommendations.therapies = [
          'Panchakarma therapies (Virechana, Basti)',
          'Local oil applications and fomentation',
          'Marma therapy for joint health'
        ];
      }

      if (condition.includes('digestive') || condition.includes('indigestion') || condition.includes('gas') || condition.includes('bloating')) {
        recommendations.dosha = 'Aggravated Pitta or Kapha in digestive system';
        recommendations.herbs.push(
          { name: 'Triphala', benefits: 'Gentle laxative, improves digestion', dosage: '500mg at bedtime' },
          { name: 'Ginger', benefits: 'Stimulates digestion, reduces nausea', dosage: '500mg before meals' },
          { name: 'Pippali', benefits: 'Enhances digestive fire (Agni)', dosage: '200mg twice daily' },
          { name: 'Amla', benefits: 'Rich in vitamin C, supports digestion', dosage: '500mg twice daily' }
        );
        recommendations.diet = [
          'Eat warm, cooked foods and avoid raw foods',
          'Include digestive spices like cumin, coriander, fennel',
          'Avoid heavy, fried, and processed foods',
          'Drink warm water throughout the day'
        ];
        recommendations.lifestyle = [
          'Eat meals at regular times',
          'Chew food thoroughly and eat mindfully',
          'Avoid drinking cold water with meals',
          'Practice light exercise after meals'
        ];
        recommendations.therapies = [
          'Abhyanga (oil massage) before bathing',
          'Udvartana (herbal powder massage)',
          'Panchakarma for digestive cleansing'
        ];
      }

      if (condition.includes('insomnia') || condition.includes('sleep') || condition.includes('sleeplessness')) {
        recommendations.dosha = 'Vata aggravation affecting mind-body balance';
        recommendations.herbs.push(
          { name: 'Jatamansi', benefits: 'Natural sedative, promotes deep sleep', dosage: '300mg 1 hour before bed' },
          { name: 'Tagara (Valerian)', benefits: 'Calms nervous system, induces sleep', dosage: '300mg before bed' },
          { name: 'Ashwagandha', benefits: 'Reduces stress, improves sleep quality', dosage: '300mg before bed' },
          { name: 'Brahmi', benefits: 'Calms mind, reduces mental chatter', dosage: '300mg before bed' }
        );
        recommendations.diet = [
          'Avoid caffeine, alcohol, and heavy meals at night',
          'Consume warm milk with nutmeg or cinnamon',
          'Include light, easily digestible foods',
          'Avoid cold and raw foods in the evening'
        ];
        recommendations.lifestyle = [
          'Maintain consistent sleep schedule',
          'Create a calming bedtime routine',
          'Avoid screens 1 hour before bed',
          'Practice evening meditation or pranayama'
        ];
        recommendations.therapies = [
          'Shirodhara (oil therapy) for deep relaxation',
          'Padabhyanga (foot massage) with warm oil',
          'Nasya therapy for mental clarity'
        ];
      }

      // Default recommendations if no specific condition matches
      if (recommendations.herbs.length === 0) {
        recommendations.dosha = 'General Vata-Pitta-Kapha balance needed';
        recommendations.herbs.push(
          { name: 'Triphala', benefits: 'Overall health tonic and gentle detoxifier', dosage: '500mg at bedtime' },
          { name: 'Ashwagandha', benefits: 'Adaptogen for stress and energy balance', dosage: '300mg twice daily' },
          { name: 'Turmeric', benefits: 'Anti-inflammatory and immune support', dosage: '500mg twice daily' },
          { name: 'Tulsi (Holy Basil)', benefits: 'Adaptogen and immune modulator', dosage: '300mg twice daily' }
        );
        recommendations.diet = [
          'Follow balanced, seasonal diet',
          'Include all six tastes in meals',
          'Eat warm, cooked foods',
          'Stay hydrated with warm water'
        ];
        recommendations.lifestyle = [
          'Follow daily routine (Dinacharya)',
          'Practice yoga and meditation',
          'Get adequate sleep and rest',
          'Spend time in nature'
        ];
        recommendations.therapies = [
          'Regular oil massage (Abhyanga)',
          'Seasonal detoxification (under guidance)',
          'Marma therapy for energy balance'
        ];
      }
    });

    return recommendations;
  };

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const resetFlow = () => {
    setHealthStatus(null);
    setTreatmentType(null);
    setCurrentStep(0);
    // Reset modern medicine state
    setSymptoms("");
    setDuration("");
    setAgeGroup("");
    setExistingMeds("");
    setAllergies("");
    setShowRecommendations(false);
    // Reset traditional medicine state
    setTraditionalSymptoms("");
    setTraditionalCondition("");
    setTraditionalSuggestions([]);
    // Reset risk check state
    setRiskAge("");
    setRiskGender("");
    setRiskSymptoms("");
    setRiskLifestyle([]);
    setShowRiskAssessment(false);
    setRiskResult("");
    // Reset wellness planner state
    setCompletedTasks(["morning-routine"]);
    // Reset lifestyle practices state
    setDiseases("");
    setShowLifestyleRecommendations(false);
    // Reset ayurvedic state
    setAyurvedicConditions("");
    setShowAyurvedicResults(false);
  };

  const handleGetRecommendations = () => {
    // Simple logic to show recommendations based on symptoms
    if (symptoms.trim()) {
      setShowRecommendations(true);
    }
  };

  const handleRiskAssessment = () => {
    let riskScore = 0;
    const factors = [];
    const recommendations = [];

    // Age-based risk assessment
    const age = parseInt(riskAge);
    if (age >= 65) {
      riskScore += 25;
      factors.push("Age 65+ (higher risk category)");
      recommendations.push("Annual comprehensive health screening");
    } else if (age >= 50) {
      riskScore += 15;
      factors.push("Age 50-64 (moderate risk category)");
      recommendations.push("Regular health check-ups every 1-2 years");
    } else if (age >= 40) {
      riskScore += 8;
      factors.push("Age 40-49 (early monitoring needed)");
    } else if (age >= 30) {
      riskScore += 3;
      factors.push("Age 30-39 (baseline monitoring)");
    }

    // Gender-based adjustments
    if (riskGender === "male" && age >= 45) {
      riskScore += 5;
      factors.push("Male gender (cardiovascular risk consideration)");
    } else if (riskGender === "female" && age >= 50) {
      riskScore += 3;
      factors.push("Female gender (hormonal changes consideration)");
    }

    // Lifestyle factors with proper weighting
    if (riskLifestyle.includes("smoking")) {
      riskScore += 30;
      factors.push("Smoking (major risk factor)");
      recommendations.push("Smoking cessation program recommended");
      recommendations.push("Regular lung function monitoring");
    }

    if (riskLifestyle.includes("alcohol")) {
      riskScore += 15;
      factors.push("Regular alcohol consumption");
      recommendations.push("Limit alcohol intake to recommended levels");
      recommendations.push("Liver function tests recommended");
    }

    if (!riskLifestyle.includes("exercise")) {
      riskScore += 10;
      factors.push("Lack of regular exercise");
      recommendations.push("Start moderate exercise routine (150 min/week)");
      recommendations.push("Consult physician before starting new exercise");
    }

    // Symptom-based risk assessment with severity weighting
    const symptoms = riskSymptoms.toLowerCase();
    const severeSymptoms = ["chest pain", "shortness of breath", "severe pain", "unconsciousness", "bleeding"];
    const moderateSymptoms = ["headache", "dizziness", "fatigue", "nausea", "joint pain", "back pain"];
    const mildSymptoms = ["mild cough", "sore throat", "runny nose", "mild fatigue"];

    let symptomScore = 0;
    let hasSevereSymptoms = false;
    let hasModerateSymptoms = false;

    severeSymptoms.forEach(symptom => {
      if (symptoms.includes(symptom)) {
        symptomScore += 25;
        hasSevereSymptoms = true;
        factors.push(`Severe symptom: ${symptom}`);
        recommendations.push("URGENT: Seek immediate medical attention");
      }
    });

    if (!hasSevereSymptoms) {
      moderateSymptoms.forEach(symptom => {
        if (symptoms.includes(symptom)) {
          symptomScore += 10;
          hasModerateSymptoms = true;
          factors.push(`Moderate symptom: ${symptom}`);
        }
      });

      mildSymptoms.forEach(symptom => {
        if (symptoms.includes(symptom)) {
          symptomScore += 3;
          factors.push(`Mild symptom: ${symptom}`);
        }
      });
    }

    riskScore += symptomScore;

    // Additional risk factors based on symptom combinations
    if (hasSevereSymptoms) {
      riskScore += 20; // Emergency consideration
    } else if (hasModerateSymptoms && riskLifestyle.includes("smoking")) {
      riskScore += 15; // Smoking + symptoms = higher risk
    } else if (hasModerateSymptoms && age >= 50) {
      riskScore += 10; // Age + symptoms = higher risk
    }

    // Determine risk level based on total score
    let riskLevel = "";
    let riskDescription = "";
    let colorClass = "";

    if (riskScore >= 70) {
      riskLevel = "CRITICAL";
      riskDescription = "Immediate medical attention required";
      colorClass = "text-red-600 font-bold";
      recommendations.unshift("EMERGENCY: Contact healthcare provider immediately or call emergency services");
    } else if (riskScore >= 45) {
      riskLevel = "HIGH";
      riskDescription = "Significant health risks detected - medical evaluation needed";
      colorClass = "text-red-500 font-semibold";
      recommendations.unshift("Schedule appointment with healthcare provider within 1 week");
    } else if (riskScore >= 25) {
      riskLevel = "MODERATE";
      riskDescription = "Moderate health risks - monitoring and lifestyle changes recommended";
      colorClass = "text-orange-500 font-semibold";
      recommendations.unshift("Schedule routine check-up within 1-2 months");
    } else if (riskScore >= 10) {
      riskLevel = "LOW-MODERATE";
      riskDescription = "Some risk factors present - preventive measures advised";
      colorClass = "text-yellow-500 font-medium";
      recommendations.unshift("Consider annual health screening");
    } else {
      riskLevel = "LOW";
      riskDescription = "Generally low health risk - maintain healthy lifestyle";
      colorClass = "text-green-500 font-medium";
      recommendations.unshift("Continue healthy habits and regular check-ups");
    }

    // Add general recommendations if not already covered
    if (!recommendations.some(r => r.includes("healthy diet"))) {
      recommendations.push("Maintain balanced, nutritious diet");
    }
    if (!recommendations.some(r => r.includes("stress"))) {
      recommendations.push("Practice stress management techniques");
    }
    if (!recommendations.some(r => r.includes("sleep"))) {
      recommendations.push("Ensure adequate quality sleep (7-9 hours/night)");
    }

    const result = (
      <div className="space-y-4">
        <div className={`text-lg font-bold ${colorClass}`}>
          Risk Level: {riskLevel}
        </div>
        <div className="text-sm text-muted-foreground">
          {riskDescription}
        </div>
        <div className="text-sm">
          <strong>Risk Score:</strong> {riskScore}/100
        </div>
        {factors.length > 0 && (
          <div>
            <strong>Key Risk Factors Identified:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {factors.map((factor, index) => (
                <li key={index} className="text-sm">{factor}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <strong>Recommended Actions:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm">{rec}</li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-blue-50 rounded-lg">
          <strong>Disclaimer:</strong> This is a basic health risk assessment tool for informational purposes only.
          It is not a substitute for professional medical advice, diagnosis, or treatment.
          Always consult with qualified healthcare providers for personalized medical recommendations.
        </div>
      </div>
    );

    setRiskResult(result);
    setShowRiskAssessment(true);
  };

  const getTraditionalSuggestions = (symptoms: string, condition: string) => {
    const input = (symptoms + " " + condition).toLowerCase();
    const suggestions = [];

    // Cold and respiratory issues
    if (input.includes("cold") || input.includes("cough") || input.includes("flu") || input.includes("fever") || input.includes("sore throat")) {
      suggestions.push({
        type: "herbal",
        name: "Ginger Tea with Honey",
        description: "Natural remedy for cold, cough, and sore throat",
        ingredients: "Fresh ginger, honey, lemon, hot water",
        preparation: "Boil sliced ginger in water for 10 minutes, add honey and lemon. Drink warm 2-3 times daily.",
        benefits: "Reduces inflammation, soothes throat, boosts immunity"
      });
      suggestions.push({
        type: "herbal",
        name: "Turmeric Milk (Golden Milk)",
        description: "Anti-inflammatory and immunity booster",
        ingredients: "Turmeric powder, milk, black pepper, ginger",
        preparation: "Heat milk, add 1 tsp turmeric, pinch of black pepper, and grated ginger. Drink warm before bed.",
        benefits: "Reduces inflammation, improves immunity, aids sleep"
      });
    }

    // Digestive issues
    if (input.includes("digest") || input.includes("stomach") || input.includes("nausea") || input.includes("indigest") || input.includes("gas") || input.includes("bloating")) {
      suggestions.push({
        type: "herbal",
        name: "Peppermint Tea",
        description: "Soothes digestive discomfort and reduces bloating",
        ingredients: "Fresh peppermint leaves or tea bag, hot water",
        preparation: "Steep peppermint leaves in hot water for 5-10 minutes. Drink after meals.",
        benefits: "Relieves gas, reduces nausea, improves digestion"
      });
      suggestions.push({
        type: "ayurvedic",
        name: "Triphala",
        description: "Traditional digestive tonic and detoxifier",
        ingredients: "Triphala powder (equal parts amla, haritaki, bibhitaki)",
        preparation: "Take 1 tsp with warm water before bed or as directed by practitioner.",
        benefits: "Improves digestion, detoxifies body, regulates bowel movements"
      });
    }

    // Pain and inflammation
    if (input.includes("pain") || input.includes("headache") || input.includes("joint") || input.includes("arthritis") || input.includes("inflammation")) {
      suggestions.push({
        type: "herbal",
        name: "Turmeric Paste",
        description: "Natural anti-inflammatory for joint pain",
        ingredients: "Turmeric powder, water or coconut oil",
        preparation: "Mix turmeric with water to make paste, apply to affected area, leave for 30 minutes.",
        benefits: "Reduces inflammation, relieves joint pain, natural analgesic"
      });
      suggestions.push({
        type: "ayurvedic",
        name: "Ashwagandha",
        description: "Adaptogen for stress and inflammation",
        ingredients: "Ashwagandha root powder or capsules",
        preparation: "Take 300-600mg daily with meals, or as directed.",
        benefits: "Reduces stress, anti-inflammatory, improves joint health"
      });
    }

    // Stress and anxiety
    if (input.includes("stress") || input.includes("anxiety") || input.includes("sleep") || input.includes("insomnia") || input.includes("tension")) {
      suggestions.push({
        type: "herbal",
        name: "Chamomile Tea",
        description: "Calming herbal tea for relaxation",
        ingredients: "Chamomile tea bag or flowers, hot water",
        preparation: "Steep chamomile in hot water for 5-10 minutes. Drink 30 minutes before bed.",
        benefits: "Promotes relaxation, improves sleep quality, reduces anxiety"
      });
      suggestions.push({
        type: "ayurvedic",
        name: "Brahmi (Gotu Kola)",
        description: "Traditional herb for mental clarity and stress relief",
        ingredients: "Brahmi powder or capsules",
        preparation: "Take 300-500mg daily, or drink as tea.",
        benefits: "Reduces stress, improves memory, calms nervous system"
      });
    }

    // Immune system
    if (input.includes("immune") || input.includes("weak") || input.includes("tired") || input.includes("fatigue") || input.includes("energy")) {
      suggestions.push({
        type: "herbal",
        name: "Echinacea Tea",
        description: "Immune system booster",
        ingredients: "Echinacea root or tea, hot water",
        preparation: "Steep echinacea in hot water for 10-15 minutes. Drink 2-3 times daily.",
        benefits: "Boosts immune system, fights infections, reduces cold duration"
      });
      suggestions.push({
        type: "ayurvedic",
        name: "Amla (Indian Gooseberry)",
        description: "Rich source of Vitamin C and antioxidants",
        ingredients: "Amla powder, honey, water",
        preparation: "Mix 1 tsp amla powder with honey and water. Take daily in morning.",
        benefits: "Boosts immunity, rich in antioxidants, improves energy"
      });
    }

    // Skin issues
    if (input.includes("skin") || input.includes("acne") || input.includes("rash") || input.includes("eczema") || input.includes("dry skin")) {
      suggestions.push({
        type: "herbal",
        name: "Aloe Vera Gel",
        description: "Natural skin healer and moisturizer",
        ingredients: "Fresh aloe vera leaf",
        preparation: "Cut aloe leaf, extract gel, apply directly to skin 2-3 times daily.",
        benefits: "Heals wounds, reduces inflammation, moisturizes skin"
      });
      suggestions.push({
        type: "ayurvedic",
        name: "Neem",
        description: "Natural antiseptic and skin purifier",
        ingredients: "Neem leaves, water",
        preparation: "Boil neem leaves to make tea, or use neem oil diluted with coconut oil.",
        benefits: "Treats acne, purifies blood, heals skin infections"
      });
    }

    // General wellness or if no specific matches
    if (suggestions.length === 0) {
      suggestions.push({
        type: "herbal",
        name: "Holy Basil (Tulsi) Tea",
        description: "Adaptogenic herb for overall wellness",
        ingredients: "Holy basil leaves, hot water",
        preparation: "Steep 5-6 tulsi leaves in hot water for 5 minutes. Drink daily.",
        benefits: "Boosts immunity, reduces stress, supports respiratory health"
      });
      suggestions.push({
        type: "ayurvedic",
        name: "Triphala",
        description: "General tonic for overall health",
        ingredients: "Triphala powder",
        preparation: "Take 1 tsp with warm water before bed.",
        benefits: "Improves digestion, detoxifies, enhances overall vitality"
      });
    }

    return suggestions;
  };

  const handleTraditionalSubmit = () => {
    if (traditionalSymptoms.trim() || traditionalCondition.trim()) {
      const suggestions = getTraditionalSuggestions(traditionalSymptoms, traditionalCondition);
      setTraditionalSuggestions(suggestions);
    }
  };

  const renderMainMenu = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setHealthStatus("healthy")}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg">Are You Healthy</CardTitle>
          <CardDescription>Wellness and preventive healthcare guidance</CardDescription>
        </CardHeader>
      </Card>

      <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setHealthStatus("unhealthy")}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg">Are You Unhealthy</CardTitle>
          <CardDescription>Treatment options and medical guidance</CardDescription>
        </CardHeader>
      </Card>

      <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setHealthStatus("risk-check")}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg">Health Risk Check</CardTitle>
          <CardDescription>Assess potential health risks</CardDescription>
        </CardHeader>
      </Card>

      <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setHealthStatus("wellness-planner")}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Calendar className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg">Daily Wellness Planner</CardTitle>
          <CardDescription>Personalized daily health routines</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderHealthyContent = () => (
    <Tabs defaultValue="tips" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="tips">Daily Tips</TabsTrigger>
        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        <TabsTrigger value="fitness">Fitness</TabsTrigger>
        <TabsTrigger value="preventive">Preventive Care</TabsTrigger>
        <TabsTrigger value="mental">Mental Wellness</TabsTrigger>
      </TabsList>

      <TabsContent value="tips" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Sleep Improvement Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Maintain consistent sleep schedule</p>
                <p className="text-sm text-muted-foreground">Go to bed and wake up at the same time every day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Create a bedtime routine</p>
                <p className="text-sm text-muted-foreground">Read, meditate, or take a warm bath before bed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Limit screen time</p>
                <p className="text-sm text-muted-foreground">Avoid screens 1 hour before bedtime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Hydration Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Aim for 8 glasses (2 liters) of water daily. Track your intake and set reminders.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Today's Progress</span>
                <span>6/8 glasses</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="nutrition" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Balanced Meal Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="font-semibold text-lg mb-2">Breakfast</div>
                <p className="text-sm text-muted-foreground">Oatmeal with fruits, Greek yogurt, nuts</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="font-semibold text-lg mb-2">Lunch</div>
                <p className="text-sm text-muted-foreground">Grilled chicken salad, quinoa, vegetables</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="font-semibold text-lg mb-2">Dinner</div>
                <p className="text-sm text-muted-foreground">Fish, brown rice, steamed broccoli</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="fitness" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Exercise Routine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Morning Walk</p>
                  <p className="text-sm text-muted-foreground">30 minutes brisk walking</p>
                </div>
              </div>
              <Badge variant="outline">8:00 AM</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Yoga Session</p>
                  <p className="text-sm text-muted-foreground">20 minutes gentle yoga</p>
                </div>
              </div>
              <Badge variant="outline">6:00 PM</Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preventive" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Preventive Healthcare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Annual Checkup:</strong> Schedule your annual physical examination
              </AlertDescription>
            </Alert>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Vaccinations:</strong> Flu shot due in October. COVID-19 booster recommended.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="mental" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Mental Wellness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">4-7-8 Breathing</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
                </p>
                <Modal>
                  <ModalTrigger asChild>
                    <Button size="sm">Start Exercise</Button>
                  </ModalTrigger>
                  <ModalContent className="max-w-2xl">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">4-7-8 Breathing Exercise</h2>
                        <p className="text-muted-foreground">A powerful technique for instant relaxation and better sleep</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold mb-2">How to Practice:</h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Sit comfortably with your back straight and close your eyes</li>
                            <li>Place the tip of your tongue against the ridge behind your upper front teeth</li>
                            <li>Inhale quietly through your nose for a count of 4 seconds</li>
                            <li>Hold your breath for a count of 7 seconds</li>
                            <li>Exhale completely through your mouth for a count of 8 seconds, making a whoosh sound</li>
                            <li>Repeat the cycle 4 times when starting, gradually increasing to 8 cycles</li>
                          </ol>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Benefits:</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Reduces anxiety and stress</li>
                            <li>Improves sleep quality</li>
                            <li>Lowers heart rate and blood pressure</li>
                            <li>Helps with emotional regulation</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Tips:</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Practice 1-2 times daily, especially before bed</li>
                            <li>Start with shorter counts if 4-7-8 feels too long</li>
                            <li>Focus on the rhythm of your breath</li>
                            <li>Don't force the breath - keep it gentle</li>
                          </ul>
                        </div>
                      </div>

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Important:</strong> If you feel dizzy or uncomfortable, stop immediately and breathe normally. Consult your doctor before starting if you have respiratory conditions.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <ModalClose className="absolute right-4 top-4" />
                  </ModalContent>
                </Modal>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Mindfulness Meditation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  10-minute guided meditation for stress relief
                </p>
                <Modal>
                  <ModalTrigger asChild>
                    <Button size="sm">Begin Session</Button>
                  </ModalTrigger>
                  <ModalContent className="max-w-2xl">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Mindfulness Meditation</h2>
                        <p className="text-muted-foreground">A 10-minute guided session for stress relief and mental clarity</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Preparation:</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Find a quiet, comfortable place to sit or lie down</li>
                            <li>Set a timer for 10 minutes</li>
                            <li>Close your eyes or soften your gaze</li>
                            <li>Get comfortable - you can sit cross-legged, on a chair, or lie down</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Guided Practice:</h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Take a few deep breaths, noticing the sensation of air entering and leaving your body</li>
                            <li>Bring your attention to your breath - feel it at your nostrils or in your belly</li>
                            <li>When your mind wanders (and it will), gently bring your focus back to your breath</li>
                            <li>Notice thoughts, feelings, and sensations without judgment - just observe them</li>
                            <li>If you feel stressed, acknowledge it and return to your breath</li>
                            <li>Continue for 10 minutes, ending with a few deep breaths</li>
                          </ol>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Benefits:</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Reduces stress and anxiety</li>
                            <li>Improves focus and concentration</li>
                            <li>Enhances emotional regulation</li>
                            <li>Promotes better sleep</li>
                            <li>Increases self-awareness</li>
                          </ul>
                        </div>
                      </div>

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Tip:</strong> Meditation is a skill that improves with practice. Start with shorter sessions if 10 minutes feels too long. Be patient with yourself.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <ModalClose className="absolute right-4 top-4" />
                  </ModalContent>
                </Modal>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const renderUnhealthyContent = () => {
    if (treatmentType === null) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setTreatmentType("modern")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Pill className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Modern Medicine</CardTitle>
              <CardDescription>AI-based drug recommendations</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setTreatmentType("traditional")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Home className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Traditional Medicine</CardTitle>
              <CardDescription>Herbal and natural remedies</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setTreatmentType("home-remedies")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Zap className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Home Remedies</CardTitle>
              <CardDescription>Safe household treatments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setTreatmentType("consult-doctor")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Stethoscope className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Consult a Doctor</CardTitle>
              <CardDescription>Professional medical advice</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    if (treatmentType === "modern") {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Modern Medicine Assessment</CardTitle>
                  <CardDescription>Please provide details about your symptoms</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setTreatmentType(null)} className="self-start sm:self-auto shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Treatment Options
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long have you had symptoms?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-day">1 day</SelectItem>
                      <SelectItem value="2-3-days">2-3 days</SelectItem>
                      <SelectItem value="1-week">1 week</SelectItem>
                      <SelectItem value="2-weeks">2 weeks</SelectItem>
                      <SelectItem value="1-month">1 month</SelectItem>
                      <SelectItem value="chronic">Chronic (3+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age-group">Age Group</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="child">Child (0-12)</SelectItem>
                      <SelectItem value="teen">Teen (13-19)</SelectItem>
                      <SelectItem value="adult">Adult (20-64)</SelectItem>
                      <SelectItem value="senior">Senior (65+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="existing-meds">Current Medications</Label>
                  <Input
                    id="existing-meds"
                    placeholder="List any medications you're taking..."
                    value={existingMeds}
                    onChange={(e) => setExistingMeds(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies or Health Conditions</Label>
                <Textarea
                  id="allergies"
                  placeholder="Any known allergies or existing health conditions..."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
              <Button onClick={handleGetRecommendations} className="w-full" size="lg">
                Get AI Drug Recommendations
              </Button>
            </CardContent>
          </Card>

          {showRecommendations && (
            <Card>
              <CardHeader>
                <CardTitle>AI Drug Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">Paracetamol</h4>
                        <p className="text-sm text-muted-foreground">For fever and mild pain relief</p>
                      </div>
                      <Badge variant="outline">Recommended</Badge>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span><strong>Dosage:</strong> 500 mg every 6-8 hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span><strong>When to take:</strong> After food</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span><strong>Duration:</strong> Maximum 3 days for pain relief</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    if (treatmentType === "traditional") {
      return (
        <div className="space-y-6">
          {/* Input Form for Traditional Medicine */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Tell Us About Your Condition</CardTitle>
                  <CardDescription>Describe your symptoms or health condition to get personalized traditional medicine suggestions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setTreatmentType(null)} className="self-start sm:self-auto shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Treatment Options
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="traditional-symptoms">Symptoms</Label>
                  <Textarea
                    id="traditional-symptoms"
                    placeholder="Describe your symptoms (e.g., headache, cough, stomach pain, fatigue)..."
                    value={traditionalSymptoms}
                    onChange={(e) => setTraditionalSymptoms(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="traditional-condition">Health Condition (Optional)</Label>
                  <Textarea
                    id="traditional-condition"
                    placeholder="Any specific health condition or concern..."
                    value={traditionalCondition}
                    onChange={(e) => setTraditionalCondition(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleTraditionalSubmit} className="w-full" size="lg">
                Get Traditional Medicine Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Personalized Suggestions */}
          {traditionalSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personalized Traditional Medicine Recommendations</CardTitle>
                <CardDescription>Based on your symptoms, here are traditional remedies that may help</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {traditionalSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            {suggestion.type === "herbal" ? (
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            ) : (
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            )}
                            {suggestion.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        </div>
                        <Badge variant="outline" className={
                          suggestion.type === "herbal" ? "border-green-500 text-green-700" : "border-orange-500 text-orange-700"
                        }>
                          {suggestion.type === "herbal" ? "Herbal Remedy" : "Ayurvedic"}
                        </Badge>
                      </div>
                      <div className="grid gap-3 text-sm">
                        <div>
                          <strong className="text-foreground">Ingredients:</strong> {suggestion.ingredients}
                        </div>
                        <div>
                          <strong className="text-foreground">Preparation:</strong> {suggestion.preparation}
                        </div>
                        <div>
                          <strong className="text-foreground">Benefits:</strong> {suggestion.benefits}
                        </div>
                      </div>
                      <Alert className="mt-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <strong>Important:</strong> These are traditional remedies and not a substitute for professional medical advice. Consult a healthcare provider before trying new remedies, especially if you have existing conditions or take medications.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* General Traditional Medicine Tabs */}
          <Tabs defaultValue="herbal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="herbal">Herbal Remedies</TabsTrigger>
              <TabsTrigger value="ayurvedic">Ayurvedic</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            </TabsList>

            <TabsContent value="herbal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Common Herbal Remedies</CardTitle>
                  <CardDescription>Natural remedies for common ailments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Turmeric Milk (Golden Milk)</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        For immunity boost and anti-inflammatory benefits
                      </p>
                      <div className="text-sm space-y-1">
                        <p><strong>Ingredients:</strong> Turmeric, milk, black pepper, ginger</p>
                        <p><strong>How to prepare:</strong> Heat milk, add spices, drink warm</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Ginger Tea</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        For cold relief and digestion
                      </p>
                      <div className="text-sm space-y-1">
                        <p><strong>Ingredients:</strong> Fresh ginger, honey, lemon</p>
                        <p><strong>How to prepare:</strong> Boil ginger, add honey and lemon</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ayurvedic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ayurvedic Guidance</CardTitle>
                  <CardDescription>Get personalized Ayurvedic recommendations based on your health conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ayurvedic-conditions">Enter your health conditions/diseases</Label>
                      <Textarea
                        id="ayurvedic-conditions"
                        placeholder="e.g., diabetes, hypertension, anxiety, arthritis, digestive issues..."
                        value={ayurvedicConditions}
                        onChange={(e) => setAyurvedicConditions(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter your conditions to get personalized Ayurvedic recommendations including herbs, diet, and therapies
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowAyurvedicResults(true)}
                      disabled={!ayurvedicConditions.trim()}
                      className="w-full"
                    >
                      Get Ayurvedic Recommendations
                    </Button>
                  </div>

                  {showAyurvedicResults && ayurvedicConditions.trim() && (
                    <div className="space-y-6 mt-6">
                      {(() => {
                        const recommendations = getAyurvedicRecommendations(ayurvedicConditions);
                        return (
                          <>
                            <Alert>
                              <Heart className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Ayurvedic Analysis Result:</strong> Based on your conditions ({ayurvedicConditions}), here are personalized Ayurvedic recommendations following traditional healing principles.
                              </AlertDescription>
                            </Alert>

                            <div className="space-y-6">
                              {/* Dosha Analysis */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Dosha Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground mb-2">Primary imbalance identified:</p>
                                  <Badge variant="secondary" className="text-sm">{recommendations.dosha}</Badge>
                                  <p className="text-sm mt-2">
                                    Ayurvedic treatment focuses on balancing your doshas through herbs, diet, lifestyle, and therapeutic procedures.
                                  </p>
                                </CardContent>
                              </Card>

                              {/* Herbal Recommendations */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Pill className="h-5 w-5" />
                                    Recommended Ayurvedic Herbs
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    {recommendations.herbs.map((herb: any, index: number) => (
                                      <div key={index} className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">{herb.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{herb.benefits}</p>
                                        <p className="text-sm"><strong>Dosage:</strong> {herb.dosage}</p>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Dietary Recommendations */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Apple className="h-5 w-5" />
                                    Ayurvedic Dietary Guidelines
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {recommendations.diet.map((item: string, index: number) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>

                              {/* Lifestyle Recommendations */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Lifestyle Recommendations
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {recommendations.lifestyle.map((item: string, index: number) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>

                              {/* Therapeutic Procedures */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5" />
                                    Recommended Therapies
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    {recommendations.therapies.map((therapy: string, index: number) => (
                                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-medium">{therapy}</p>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Important Ayurvedic Notes:</strong>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                  <li>Consult a qualified Ayurvedic practitioner before starting any herbal regimen</li>
                                  <li>Herbal dosages may need adjustment based on individual constitution (Prakriti)</li>
                                  <li>Some herbs may interact with conventional medications</li>
                                  <li>Follow dietary guidelines consistently for best results</li>
                                  <li>Therapies should be performed under professional supervision</li>
                                </ul>
                              </AlertDescription>
                            </Alert>

                            <div className="flex gap-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setAyurvedicConditions("");
                                  setShowAyurvedicResults(false);
                                }}
                              >
                                Try Different Conditions
                              </Button>
                              <Button
                                onClick={() => {
                                  alert("Ayurvedic recommendations saved to your health plan!");
                                }}
                              >
                                Save to Health Plan
                              </Button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {!showAyurvedicResults && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your health conditions above to receive personalized Ayurvedic recommendations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lifestyle Practices</CardTitle>
                  <CardDescription>Get personalized yoga and pranayama recommendations based on your health conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="diseases">Enter your health conditions/diseases (comma-separated)</Label>
                      <Textarea
                        id="diseases"
                        placeholder="e.g., diabetes, hypertension, anxiety, asthma..."
                        value={diseases}
                        onChange={(e) => setDiseases(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter your conditions to get personalized yoga and pranayama recommendations
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowLifestyleRecommendations(true)}
                      disabled={!diseases.trim()}
                      className="w-full"
                    >
                      Get Personalized Recommendations
                    </Button>
                  </div>

                  {showLifestyleRecommendations && diseases.trim() && (
                    <div className="space-y-6 mt-6">
                      {(() => {
                        const recommendations = getDiseaseBasedRecommendations(diseases);
                        return (
                          <>
                            <Alert>
                              <Heart className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Personalized Recommendations:</strong> Based on your conditions ({diseases}), here are targeted yoga poses and pranayama techniques to support your health journey.
                              </AlertDescription>
                            </Alert>

                            <div className="grid gap-6 md:grid-cols-2">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recommended Yoga Poses
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    {recommendations.yoga.map((pose: any, index: number) => (
                                      <div key={index} className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">{pose.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{pose.description}</p>
                                        <p className="text-sm"><strong>Duration:</strong> {pose.duration}</p>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    Recommended Pranayama
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    {recommendations.pranayama.map((technique: any, index: number) => (
                                      <div key={index} className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-2">{technique.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{technique.description}</p>
                                        <p className="text-sm"><strong>Duration:</strong> {technique.duration}</p>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Important:</strong> These recommendations are for general wellness. Consult your healthcare provider before starting any new exercise regimen, especially if you have medical conditions. Start slowly and listen to your body. Stop if you experience pain or discomfort.
                              </AlertDescription>
                            </Alert>

                            <div className="flex gap-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setDiseases("");
                                  setShowLifestyleRecommendations(false);
                                }}
                              >
                                Try Different Conditions
                              </Button>
                              <Button
                                onClick={() => {
                                  // Could add functionality to save recommendations
                                  alert("Recommendations saved to your wellness plan!");
                                }}
                              >
                                Save to Wellness Plan
                              </Button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {!showLifestyleRecommendations && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your health conditions above to receive personalized yoga and pranayama recommendations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    if (treatmentType === "home-remedies") {
      return <HomeRemediesInteractive onBack={() => setTreatmentType(null)} />;
    }

    if (treatmentType === "consult-doctor") {
      return (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>Consult a Doctor</CardTitle>
                <CardDescription>Get professional medical advice</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setTreatmentType(null)} className="self-start sm:self-auto shrink-0">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Treatment Options
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Stethoscope className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> For serious symptoms or chronic conditions, always consult a qualified healthcare professional.
              </AlertDescription>
            </Alert>
            <div className="grid gap-4 md:grid-cols-2">
              <Modal>
                <ModalTrigger asChild>
                  <Button size="lg" className="h-20">
                    <div className="text-center">
                      <User className="h-6 w-6 mx-auto mb-2" />
                      <div>Emergency</div>
                      <div className="text-xs opacity-75">Call 911</div>
                    </div>
                  </Button>
                </ModalTrigger>
                <ModalContent className="max-w-md">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-red-600">Emergency Services</h2>
                    <div className="space-y-3">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h3 className="font-semibold mb-2">When to Call Emergency Services:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Chest pain or difficulty breathing</li>
                          <li>Severe bleeding or head injury</li>
                          <li>Loss of consciousness</li>
                          <li>Severe allergic reaction</li>
                          <li>Sudden numbness or weakness</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Emergency Contact:</h3>
                        <p className="text-lg font-bold text-center">911</p>
                        <p className="text-sm text-center">Call immediately for life-threatening emergencies</p>
                      </div>
                    </div>
                  </div>
                  <ModalClose className="absolute right-4 top-4" />
                </ModalContent>
              </Modal>
              <Modal>
                <ModalTrigger asChild>
                  <Button size="lg" variant="outline" className="h-20">
                    <div className="text-center">
                      <Calendar className="h-6 w-6 mx-auto mb-2" />
                      <div>Schedule Visit</div>
                      <div className="text-xs opacity-75">Find a Doctor</div>
                    </div>
                  </Button>
                </ModalTrigger>
                <ModalContent className="max-w-lg">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Schedule a Doctor Visit</h2>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold mb-2">How to Schedule:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Contact your primary care physician</li>
                          <li>Use online patient portals</li>
                          <li>Call your local clinic or hospital</li>
                          <li>Use telemedicine apps for virtual visits</li>
                        </ol>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold mb-2">What to Prepare:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>List of current symptoms</li>
                          <li>Medical history and medications</li>
                          <li>Insurance information</li>
                          <li>Questions for your doctor</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Urgent Care vs Emergency:</h3>
                        <p className="text-sm">For non-life-threatening issues that need prompt attention, visit urgent care centers or schedule with your doctor within 24-48 hours.</p>
                      </div>
                    </div>
                  </div>
                  <ModalClose className="absolute right-4 top-4" />
                </ModalContent>
              </Modal>
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const renderRiskCheckContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Health Risk Assessment</CardTitle>
        <CardDescription>Evaluate your potential health risks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Age</Label>
            <Input
              type="number"
              placeholder="Enter your age"
              value={riskAge}
              onChange={(e) => setRiskAge(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={riskGender} onValueChange={setRiskGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Current Symptoms</Label>
          <Textarea
            placeholder="Describe any symptoms you're experiencing..."
            value={riskSymptoms}
            onChange={(e) => setRiskSymptoms(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Lifestyle Factors</Label>
          <div className="grid gap-2 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smoking"
                className="rounded"
                checked={riskLifestyle.includes("smoking")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRiskLifestyle([...riskLifestyle, "smoking"]);
                  } else {
                    setRiskLifestyle(riskLifestyle.filter(item => item !== "smoking"));
                  }
                }}
              />
              <Label htmlFor="smoking">Smoking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="alcohol"
                className="rounded"
                checked={riskLifestyle.includes("alcohol")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRiskLifestyle([...riskLifestyle, "alcohol"]);
                  } else {
                    setRiskLifestyle(riskLifestyle.filter(item => item !== "alcohol"));
                  }
                }}
              />
              <Label htmlFor="alcohol">Regular Alcohol</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="exercise"
                className="rounded"
                checked={riskLifestyle.includes("exercise")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRiskLifestyle([...riskLifestyle, "exercise"]);
                  } else {
                    setRiskLifestyle(riskLifestyle.filter(item => item !== "exercise"));
                  }
                }}
              />
              <Label htmlFor="exercise">Regular Exercise</Label>
            </div>
          </div>
        </div>

        <Button onClick={handleRiskAssessment} className="w-full" size="lg">
          Assess My Health Risk
        </Button>

        {showRiskAssessment && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Health Risk Assessment Results</h3>
            </div>
            {riskResult}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderWellnessPlannerContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Wellness Planner</CardTitle>
          <CardDescription>Your personalized health routine for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleTaskCompletion("morning-routine")}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Sun className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Morning Routine</p>
                  <p className="text-sm text-muted-foreground">Hydration + Light stretching</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">8:00 AM</p>
                <Badge variant="outline" className="text-xs">
                  {completedTasks.includes("morning-routine") ? "Completed" : "Mark Complete"}
                </Badge>
              </div>
            </div>

            <div
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleTaskCompletion("healthy-breakfast")}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Apple className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Healthy Breakfast</p>
                  <p className="text-sm text-muted-foreground">Oatmeal with fruits</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">9:00 AM</p>
                <Badge variant="outline" className="text-xs">
                  {completedTasks.includes("healthy-breakfast") ? "Completed" : "Mark Complete"}
                </Badge>
              </div>
            </div>

            <div
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleTaskCompletion("mindfulness-break")}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Mindfulness Break</p>
                  <p className="text-sm text-muted-foreground">5-minute meditation</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">2:00 PM</p>
                <Badge variant="outline" className="text-xs">
                  {completedTasks.includes("mindfulness-break") ? "Completed" : "Mark Complete"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Drink 8 glasses of water daily</span>
              <Badge variant="outline">{completedTasks.filter(task => task.includes("water")).length}/7 days</Badge>
            </div>
            <Progress value={71} className="h-2" />

            <div className="flex justify-between items-center">
              <span>30 minutes exercise</span>
              <Badge variant="outline">{completedTasks.filter(task => task.includes("exercise")).length}/7 days</Badge>
            </div>
            <Progress value={57} className="h-2" />

            <div className="flex justify-between items-center">
              <span>8 hours sleep</span>
              <Badge variant="outline">{completedTasks.filter(task => task.includes("sleep")).length}/7 days</Badge>
            </div>
            <Progress value={86} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <AppLayout>
      <div className="container py-8">
        {healthStatus !== "wellness-planner" && (
          <div className="mb-6">
            {treatmentType !== null ? (
              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" onClick={() => setTreatmentType(null)} className="hover:bg-accent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Treatment Options
                </Button>
                <span className="text-muted-foreground text-xs">•</span>
                <Button variant="link" size="sm" onClick={resetFlow} className="text-muted-foreground text-xs p-0 h-auto">
                  Main Menu
                </Button>
              </div>
            ) : healthStatus ? (
              <Button variant="ghost" onClick={resetFlow} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Main Menu
              </Button>
            ) : null}
            <h1 className="text-3xl font-bold mb-2">Healthy</h1>
            <p className="text-muted-foreground">
              Your intelligent health guidance system for wellness and medical advice
            </p>
          </div>
        )}

        {healthStatus === null && renderMainMenu()}

        {healthStatus === "healthy" && renderHealthyContent()}

        {healthStatus === "unhealthy" && renderUnhealthyContent()}

        {healthStatus === "risk-check" && renderRiskCheckContent()}

        {healthStatus === "wellness-planner" && <DailyWellnessPlanner onBack={resetFlow} />}
      </div>
    </AppLayout>
  );
}