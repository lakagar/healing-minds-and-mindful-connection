import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Define translations
const resources = {
  en: {
    translation: {
      // Common
      "app.name": "Healing Minds",
      "app.tagline": "Your Mind Matters",
      "app.description": "Support for a better tomorrow begins here.",
      "theme.toggle": "Toggle Theme",
      "language.select": "Select Language",
      
      // Navigation
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.moodTracker": "Mood Tracker",
      "nav.medicine": "Medicines",
      "nav.counseling": "Counseling",
      "nav.groupSessions": "Group Sessions",
      "nav.profile": "Profile",
      "nav.login": "Login",
      "nav.logout": "Logout",
      
      // Auth
      "auth.login": "Login",
      "auth.register": "Register",
      "auth.username": "Username",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm Password",
      "auth.firstName": "First Name",
      "auth.lastName": "Last Name",
      "auth.email": "Email",
      "auth.forgotPassword": "Forgot Password?",
      "auth.alreadyHaveAccount": "Already have an account?",
      "auth.dontHaveAccount": "Don't have an account?",
      "auth.createAccount": "Create Account",
      "auth.welcomeBack": "Welcome Back",
      "auth.signin": "Sign In",
      "auth.rememberMe": "Remember me",
      "auth.orContinueWith": "Or continue with",
      
      // Home
      "home.exploreServices": "Explore Services",
      "home.talkToAI": "Talk to AI Assistant",
      
      // Services
      "services.title": "Our Services",
      "services.description": "Comprehensive support for your mental wellness journey, with options to fit your needs and preferences.",
      "services.individual.title": "1-on-1 Therapy",
      "services.individual.description": "Private sessions with licensed therapists tailored to your needs and goals.",
      "services.individual.feature1": "Secure video sessions",
      "services.individual.feature2": "Chat messaging available",
      "services.individual.feature3": "Session notes & follow-ups",
      "services.individual.cta": "Book Session",
      
      "services.group.title": "Group Sessions",
      "services.group.description": "Connect with others in a supportive environment led by experienced therapists.",
      "services.group.feature1": "Topic-focused groups",
      "services.group.feature2": "Weekly scheduled meetings",
      "services.group.feature3": "Community support",
      "services.group.cta": "Join Group",
      
      "services.meditation.title": "Guided Meditation",
      "services.meditation.description": "Professionally created meditations to reduce stress and improve mindfulness.",
      "services.meditation.feature1": "Various session lengths",
      "services.meditation.feature2": "Different focus themes",
      "services.meditation.feature3": "Track your progress",
      "services.meditation.cta": "Start Meditating",
      
      "services.tools.title": "Self-Help Tools",
      "services.tools.description": "Interactive resources to build skills and track your mental wellness journey.",
      "services.tools.feature1": "Mood tracking",
      "services.tools.feature2": "Journaling exercises",
      "services.tools.feature3": "Coping skill resources",
      "services.tools.cta": "Explore Tools",
      
      "services.ai.title": "AI Companion",
      "services.ai.description": "24/7 support with our AI assistant for moments when you need someone to talk to.",
      "services.ai.feature1": "Always available",
      "services.ai.feature2": "Guided exercises",
      "services.ai.feature3": "Resource recommendations",
      "services.ai.cta": "Chat Now",
      
      "services.medication.title": "Medication Management",
      "services.medication.description": "Consultations with psychiatric providers for medication evaluation and management.",
      "services.medication.feature1": "Licensed psychiatrists",
      "services.medication.feature2": "Medication monitoring",
      "services.medication.feature3": "Integrated care approach",
      "services.medication.cta": "Learn More",
      
      // Mood Tracker
      "mood.title": "Mood Tracker",
      "mood.description": "Track your emotional wellbeing and identify patterns to better understand your mental health journey.",
      "mood.question": "How are you feeling today?",
      "mood.happy": "Happy",
      "mood.calm": "Calm",
      "mood.tired": "Tired",
      "mood.anxious": "Anxious",
      "mood.sad": "Sad",
      "mood.angry": "Angry",
      "mood.notes": "Add notes about your mood (optional):",
      "mood.save": "Save Today's Mood",
      "mood.saved": "Your mood has been recorded. Thank you for checking in!",
      "mood.history": "Your Mood History",
      "mood.thisMonth": "This Month",
      "mood.viewCalendar": "View Calendar",
      "mood.trends": "Mood Trends",
      "mood.visualization": "Your mood visualization will appear here after tracking for a few days",
      
      // Chatbot
      "chat.title": "AI Support Companion",
      "chat.description": "Our AI assistant is here to provide support, resources, and exercises whenever you need someone to talk to.",
      "chat.assistant": "Healing Minds Assistant",
      "chat.alwaysHere": "Always here to support you",
      "chat.placeholder": "Type your message here...",
      "chat.privacy": "Your conversations are private and secure. For emergencies, please call your local crisis line or 911.",
      "chat.greeting": "Hello! I'm your Healing Minds assistant. How are you feeling today?",
      
      // Medicine Store
      "medicine.title": "Medicine Store",
      "medicine.description": "Access prescribed medications and wellness products to support your treatment plan.",
      "medicine.search": "Search medications...",
      "medicine.cart": "Cart",
      "medicine.allCategories": "All Categories",
      "medicine.antidepressants": "Antidepressants",
      "medicine.anxiolytics": "Anxiolytics",
      "medicine.moodStabilizers": "Mood Stabilizers",
      "medicine.supplements": "Supplements",
      "medicine.startingAt": "Starting at",
      "medicine.viewDetails": "View Details",
      "medicine.addToCart": "Add to Cart",
      "medicine.viewAll": "View All Medications",
      
      // Footer
      "footer.mission": "Our mission is to make mental healthcare accessible, effective, and stigma-free for everyone.",
      "footer.quickLinks": "Quick Links",
      "footer.help": "Help & Support",
      "footer.emergency": "Emergency Resources",
      "footer.crisisLine": "24/7 Crisis Line: 988",
      "footer.resources": "Crisis Resources",
      "footer.copyright": "© 2023 Healing Minds & Mindful Connections. All rights reserved.",
      
      // Counseling
      "counseling.title": "Book a Counseling Session",
      "counseling.description": "Schedule a one-on-one session with one of our licensed therapists.",
      "counseling.select": "Select a Therapist",
      "counseling.date": "Select Date",
      "counseling.time": "Select Time",
      "counseling.duration": "Session Duration",
      "counseling.type": "Session Type",
      "counseling.video": "Video Call",
      "counseling.chat": "Chat Session",
      "counseling.book": "Book Session",
      "counseling.upcoming": "Upcoming Sessions",
      "counseling.past": "Past Sessions",
      "counseling.noUpcoming": "No upcoming sessions scheduled.",
      "counseling.noPast": "No past sessions found.",
      
      // Group Sessions
      "group.title": "Group Therapy Sessions",
      "group.description": "Join supportive group sessions led by professional therapists.",
      "group.upcoming": "Upcoming Group Sessions",
      "group.participants": "Participants",
      "group.join": "Join Session",
      "group.joined": "You've Joined",
      "group.leave": "Leave Session",
      "group.full": "Session Full",
      "group.noSessions": "No upcoming group sessions at this time.",
      
      // Profile
      "profile.title": "Your Profile",
      "profile.personalInfo": "Personal Information",
      "profile.updateInfo": "Update Information",
      "profile.language": "Language Preference",
      "profile.theme": "Theme Preference",
      "profile.light": "Light",
      "profile.dark": "Dark",
      "profile.system": "System",
      "profile.save": "Save Changes",
      "profile.sessions": "Session History",
      "profile.noSessions": "No session history available.",
    }
  },
  es: {
    translation: {
      // Common
      "app.name": "Mentes Sanadoras",
      "app.tagline": "Tu Mente Importa",
      "app.description": "El apoyo para un mejor mañana comienza aquí.",
      "theme.toggle": "Cambiar Tema",
      "language.select": "Seleccionar Idioma",
      
      // Navigation
      "nav.home": "Inicio",
      "nav.services": "Servicios",
      "nav.moodTracker": "Seguimiento de Ánimo",
      "nav.medicine": "Medicamentos",
      "nav.counseling": "Asesoramiento",
      "nav.groupSessions": "Sesiones Grupales",
      "nav.profile": "Perfil",
      "nav.login": "Iniciar Sesión",
      "nav.logout": "Cerrar Sesión",
      
      // Auth
      "auth.login": "Iniciar Sesión",
      "auth.register": "Registrarse",
      "auth.username": "Nombre de Usuario",
      "auth.password": "Contraseña",
      "auth.confirmPassword": "Confirmar Contraseña",
      "auth.firstName": "Nombre",
      "auth.lastName": "Apellido",
      "auth.email": "Correo Electrónico",
      "auth.forgotPassword": "¿Olvidó su Contraseña?",
      "auth.alreadyHaveAccount": "¿Ya tiene una cuenta?",
      "auth.dontHaveAccount": "¿No tiene una cuenta?",
      "auth.createAccount": "Crear Cuenta",
      "auth.welcomeBack": "Bienvenido de Nuevo",
      "auth.signin": "Iniciar Sesión",
      "auth.rememberMe": "Recuérdame",
      "auth.orContinueWith": "O continuar con",
      
      // Home
      "home.exploreServices": "Explorar Servicios",
      "home.talkToAI": "Hablar con Asistente IA",
      
      // Services
      "services.title": "Nuestros Servicios",
      "services.description": "Apoyo integral para su viaje de bienestar mental, con opciones que se adaptan a sus necesidades y preferencias.",
      "services.individual.title": "Terapia Individual",
      "services.individual.description": "Sesiones privadas con terapeutas licenciados adaptadas a sus necesidades y objetivos.",
      "services.individual.feature1": "Sesiones de video seguras",
      "services.individual.feature2": "Chat disponible",
      "services.individual.feature3": "Notas de sesión y seguimientos",
      "services.individual.cta": "Reservar Sesión",
      
      // (remaining Spanish translations follow the same pattern...)
      
      // Mood Tracker
      "mood.title": "Seguimiento de Ánimo",
      "mood.description": "Haga un seguimiento de su bienestar emocional e identifique patrones para comprender mejor su salud mental.",
      "mood.question": "¿Cómo se siente hoy?",
      "mood.happy": "Feliz",
      "mood.calm": "Tranquilo",
      "mood.tired": "Cansado",
      "mood.anxious": "Ansioso",
      "mood.sad": "Triste",
      "mood.angry": "Enojado"
    }
  },
  fr: {
    translation: {
      // Common
      "app.name": "Esprits Guérisseurs",
      "app.tagline": "Votre Esprit Compte",
      "app.description": "Le soutien pour un meilleur lendemain commence ici.",
      "theme.toggle": "Changer de Thème",
      "language.select": "Sélectionner la Langue",
      
      // Navigation
      "nav.home": "Accueil",
      "nav.services": "Services",
      "nav.moodTracker": "Suivi d'Humeur",
      "nav.medicine": "Médicaments",
      "nav.counseling": "Conseil",
      "nav.groupSessions": "Sessions de Groupe",
      "nav.profile": "Profil",
      "nav.login": "Connexion",
      "nav.logout": "Déconnexion",
      
      // Auth
      "auth.login": "Connexion",
      "auth.register": "S'inscrire",
      "auth.username": "Nom d'Utilisateur",
      "auth.password": "Mot de Passe",
      "auth.confirmPassword": "Confirmer le Mot de Passe",
      "auth.firstName": "Prénom",
      "auth.lastName": "Nom",
      "auth.email": "Email",
      "auth.forgotPassword": "Mot de passe oublié?",
      "auth.alreadyHaveAccount": "Vous avez déjà un compte?",
      "auth.dontHaveAccount": "Vous n'avez pas de compte?",
      "auth.createAccount": "Créer un Compte",
      "auth.welcomeBack": "Bienvenue à Nouveau",
      "auth.signin": "Se Connecter",
      "auth.rememberMe": "Se souvenir de moi",
      "auth.orContinueWith": "Ou continuer avec",
      
      // Home
      "home.exploreServices": "Explorer les Services",
      "home.talkToAI": "Parler à l'Assistant IA",
      
      // (remaining French translations follow the same pattern...)
      
      // Mood Tracker
      "mood.title": "Suivi d'Humeur",
      "mood.description": "Suivez votre bien-être émotionnel et identifiez les tendances pour mieux comprendre votre santé mentale.",
      "mood.question": "Comment vous sentez-vous aujourd'hui?",
      "mood.happy": "Heureux",
      "mood.calm": "Calme",
      "mood.tired": "Fatigué",
      "mood.anxious": "Anxieux",
      "mood.sad": "Triste",
      "mood.angry": "En colère"
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
