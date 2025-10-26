import LanguageConverter from "@/components/LanguageConverter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-12 pb-8 text-center space-y-4 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Script <span className="text-primary">Bridge</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto px-4 font-medium">
          Convert Benglish to বাংলা and Hinglish to हिंदी instantly with AI-powered transliteration
        </p>
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
