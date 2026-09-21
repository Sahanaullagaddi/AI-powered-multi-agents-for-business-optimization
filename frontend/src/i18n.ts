import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "AI Drug-Drug Interaction Analysis Report": "AI Drug-Drug Interaction Analysis Report",
      "No results data found. Please run a prediction first.": "No results data found. Please run a prediction first.",
      "If you just ran a prediction and see this, please try again or check the browser console for errors.": "If you just ran a prediction and see this, please try again or check the browser console for errors.",
      "1. Overall AI Risk Score": "1. Overall AI Risk Score",
      "Overall Interaction Risk": "Overall Interaction Risk",
      "High": "High",
      "AI Risk Score": "AI Risk Score",
      "Severity Level": "Severity Level",
      "Critical Monitoring Required": "Critical Monitoring Required",
      "Risk Indicator": "Risk Indicator",
      "Low": "Low",
      "Moderate": "Moderate",
      "Critical": "Critical",
      "How the drug combination may affect different organs in your body.": "How the drug combination may affect different organs in your body.",
      "Possible symptoms that may occur due to the drug combination.": "Possible symptoms that may occur due to the drug combination.",
      "Patient Profile": "Patient Profile",
      "AI Insights": "AI Insights",
      "6. Drug Interaction Heatmap": "6. Drug Interaction Heatmap",
      "Visual grid showing interaction severity between medications.": "Visual grid showing interaction severity between medications.",
      "7. AI Explanation of Interaction": "7. AI Explanation of Interaction",
      "8. Safer Alternative Drug Suggestions": "8. Safer Alternative Drug Suggestions",
      "9. Patient Safety Recommendations": "9. Patient Safety Recommendations",
      "10. AI Confidence & Clinical Evidence": "10. AI Confidence & Clinical Evidence",
      "Dosing Instructions": "Dosing Instructions",
      "Download Report": "Download Report"
    }
  },
  hi: {
    translation: {
      "AI Drug-Drug Interaction Analysis Report": "एआई ड्रग-ड्रग इंटरैक्शन विश्लेषण रिपोर्ट",
      "No results data found. Please run a prediction first.": "कोई परिणाम डेटा नहीं मिला। कृपया पहले भविष्यवाणी चलाएं।",
      "If you just ran a prediction and see this, please try again or check the browser console for errors.": "यदि आपने अभी भविष्यवाणी चलाई है और यह देख रहे हैं, तो कृपया फिर से प्रयास करें या त्रुटियों के लिए ब्राउज़र कंसोल जांचें।",
      "1. Overall AI Risk Score": "1. समग्र एआई जोखिम स्कोर",
      "Overall Interaction Risk": "समग्र इंटरैक्शन जोखिम",
      "High": "उच्च",
      "AI Risk Score": "एआई जोखिम स्कोर",
      "Severity Level": "गंभीरता स्तर",
      "Critical Monitoring Required": "गंभीर निगरानी आवश्यक",
      "Risk Indicator": "जोखिम संकेतक",
      "Low": "निम्न",
      "Moderate": "मध्यम",
      "Critical": "गंभीर",
      "How the drug combination may affect different organs in your body.": "दवा संयोजन आपके शरीर के विभिन्न अंगों को कैसे प्रभावित कर सकता है।",
      "Possible symptoms that may occur due to the drug combination.": "दवा संयोजन के कारण संभावित लक्षण।",
      "Patient Profile": "रोगी प्रोफ़ाइल",
      "AI Insights": "एआई अंतर्दृष्टि",
      "6. Drug Interaction Heatmap": "6. दवा इंटरैक्शन हीटमैप",
      "Visual grid showing interaction severity between medications.": "दवाओं के बीच इंटरैक्शन की गंभीरता दिखाने वाला दृश्य ग्रिड।",
      "7. AI Explanation of Interaction": "7. इंटरैक्शन की एआई व्याख्या",
      "8. Safer Alternative Drug Suggestions": "8. सुरक्षित वैकल्पिक दवा सुझाव",
      "9. Patient Safety Recommendations": "9. रोगी सुरक्षा सिफारिशें",
      "10. AI Confidence & Clinical Evidence": "10. एआई आत्मविश्वास और नैदानिक ​​साक्ष्य",
      "Dosing Instructions": "खुराक निर्देश",
      "Download Report": "रिपोर्ट डाउनलोड करें"
    }
  },
  es: {
    translation: {
      "AI Drug-Drug Interaction Analysis Report": "Informe de análisis de interacción de medicamentos AI",
      "No results data found. Please run a prediction first.": "No se encontraron datos de resultados. Ejecute una predicción primero.",
      "If you just ran a prediction and see this, please try again or check the browser console for errors.": "Si acaba de ejecutar una predicción y ve esto, inténtelo de nuevo o verifique la consola del navegador para errores.",
      "1. Overall AI Risk Score": "1. Puntaje de riesgo general de AI",
      "Overall Interaction Risk": "Riesgo de interacción general",
      "High": "Alto",
      "AI Risk Score": "Puntaje de riesgo de AI",
      "Severity Level": "Nivel de gravedad",
      "Critical Monitoring Required": "Se requiere monitoreo crítico",
      "Risk Indicator": "Indicador de riesgo",
      "Low": "Bajo",
      "Moderate": "Moderado",
      "Critical": "Crítico",
      "How the drug combination may affect different organs in your body.": "Cómo la combinación de medicamentos puede afectar diferentes órganos en su cuerpo.",
      "Possible symptoms that may occur due to the drug combination.": "Síntomas posibles que pueden ocurrir debido a la combinación de medicamentos.",
      "Patient Profile": "Perfil del paciente",
      "AI Insights": "Perspectivas de AI",
      "6. Drug Interaction Heatmap": "6. Mapa de calor de interacción de medicamentos",
      "Visual grid showing interaction severity between medications.": "Cuadrícula visual que muestra la gravedad de la interacción entre medicamentos.",
      "7. AI Explanation of Interaction": "7. Explicación de AI de la interacción",
      "8. Safer Alternative Drug Suggestions": "8. Sugerencias de medicamentos alternativos más seguros",
      "9. Patient Safety Recommendations": "9. Recomendaciones de seguridad del paciente",
      "10. AI Confidence & Clinical Evidence": "10. Confianza de AI y evidencia clínica",
      "Dosing Instructions": "Instrucciones de dosificación",
      "Download Report": "Descargar informe"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;