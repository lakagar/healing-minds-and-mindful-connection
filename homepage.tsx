import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import MoodTracker from "@/components/MoodTracker";
import ChatBot from "@/components/ChatBot";
import MedicineStore from "@/components/MedicineStore";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();
  const [showChat, setShowChat] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Services />
        
        <section id="chat" className="py-20 px-4 md:px-8 bg-blue-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary-dark dark:text-primary mb-4">{t("chat.title")}</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("chat.description")}</p>
            </div>
            
            {showChat ? (
              <ChatBot />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <MessageSquare className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-primary-dark dark:text-primary mb-4">Start a Conversation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8">
                  Our AI assistant is here to provide support, resources, and guidance whenever you need someone to talk to.
                </p>
                <Button size="lg" onClick={() => setShowChat(true)}>
                  {t("chat.title")}
                </Button>
              </div>
            )}
          </div>
        </section>
        
        <section id="featured-section" className="py-20 px-4 md:px-8 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary-dark dark:text-primary mb-4">Popular Features</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore some of our most helpful tools to support your mental wellness journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 shadow-lg">
                <div className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-primary-dark dark:text-primary mb-4">Mood Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Track your emotional wellbeing daily and identify patterns to better understand your mental health journey.
                </p>
                <Button asChild>
                  <a href="/mood-tracker">Go to Mood Tracker</a>
                </Button>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 shadow-lg">
                <div className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-primary-dark dark:text-primary mb-4">Medicine Management</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Access prescribed medications and wellness products to support your treatment plan all in one place.
                </p>
                <Button asChild>
                  <a href="/medicine">Browse Medicines</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="testimonials" className="py-20 px-4 md:px-8 bg-blue-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary-dark dark:text-primary mb-4">Testimonials</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Read what others have to say about their experience with our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The mood tracking feature helped me identify patterns I never noticed before. It's been invaluable for my therapy sessions.",
                  author: "Jessica K.",
                  role: "Using Healing Minds for 8 months"
                },
                {
                  quote: "The group sessions have given me a sense of community I was missing. It's comforting to know I'm not alone in my journey.",
                  author: "Michael T.",
                  role: "Using Healing Minds for 1 year"
                },
                {
                  quote: "Having my therapy sessions, medication management, and progress tracking all in one place has simplified my mental health care.",
                  author: "Sophia R.",
                  role: "Using Healing Minds for 6 months"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                  <svg className="h-8 w-8 text-primary mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-2.2 0-4 1.8-4 4v10c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-6.42l5.66-5.66A2 2 0 0028 8H10zm10.83 5.17a4 4 0 015.66 0L28 14.67V22c0 2.2-1.8 4-4 4H14c-2.2 0-4-1.8-4-4V12c0-2.2 1.8-4 4-4h10c.47 0 .92.09 1.34.24L20.83 13.17zM12 14a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-primary-dark dark:text-primary">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="cta" className="py-20 px-4 md:px-8 bg-primary dark:bg-primary-dark text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-6">Ready to start your wellness journey?</h2>
            <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of others who have taken the first step toward better mental health with Healing Minds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Floating action button for chat */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg"
        onClick={() => setShowChat(!showChat)}
        aria-label="Chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
}
