import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const { t } = useTranslation();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 min-h-[80vh] flex flex-col items-center justify-center px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="font-montserrat font-bold text-4xl lg:text-5xl text-primary-dark dark:text-blue-300 mb-4 leading-tight">
                {t("app.tagline")}
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
                {t("app.description")} Professional therapy, mindfulness resources, and a caring community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => scrollToSection('services')}
                  className="rounded-full"
                >
                  {t("home.exploreServices")}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => scrollToSection('chat')}
                  className="rounded-full"
                >
                  {t("home.talkToAI")}
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-lg">
                <svg className="w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#7986CB', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#3F51B5', stopOpacity: 1 }} />
                    </linearGradient>
                    <clipPath id="shape">
                      <path d="M400,800 C620.9139,800 800,620.9139 800,400 C800,179.0861 620.9139,0 400,0 C179.0861,0 0,179.0861 0,400 C0,620.9139 179.0861,800 400,800 Z" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#shape)">
                    <rect width="800" height="800" fill="url(#grad)"/>
                    <path d="M0,800 L800,0 L800,800 L0,800 Z" fill="#5C6BC0" fillOpacity="0.5"/>
                    <path d="M0,800 C276.142375,800 500,576.142375 500,300 C500,23.857625 276.142375,-200 0,-200 L0,800 Z" fill="#3F51B5" fillOpacity="0.3"/>
                    <circle cx="400" cy="400" r="250" fill="white" fillOpacity="0.2"/>
                  </g>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <svg className="w-24 h-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold mb-3">Healing Minds & Mindful Connections</h2>
                    <p className="text-sm opacity-90">Professional mental health care and support, whenever you need it, wherever you are.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
    </section>
  );
}
