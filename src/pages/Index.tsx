import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import LanguageConverter from "@/components/LanguageConverter";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-12 pb-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Script <span className="text-primary">Bridge</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto px-4 font-medium mt-4">
              Convert Benglish to বাংলা and Hinglish to हिंदी instantly with AI-powered transliteration
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <LanguageConverter />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground">
        <p>Powered by Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default Index;
