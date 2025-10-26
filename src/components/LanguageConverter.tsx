import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, ArrowRight, Loader2 } from "lucide-react";

type LanguagePair = "benglish-bangla" | "hinglish-hindi";

const LanguageConverter = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguagePair>("benglish-bangla");
  const { toast } = useToast();

  const languageOptions = [
    { value: "benglish-bangla" as LanguagePair, label: "Benglish → বাংলা" },
    { value: "hinglish-hindi" as LanguagePair, label: "Hinglish → हिंदी" },
  ];

  const handleConvert = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("convert-script", {
        body: { text: inputText, languagePair: selectedLanguage },
      });

      if (error) throw error;

      setOutputText(data.convertedText);
      toast({
        title: "Conversion successful",
        description: "Your text has been converted!",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConvert();
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Language Selector */}
      <div className="flex justify-center gap-3">
        {languageOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => setSelectedLanguage(option.value)}
            variant={selectedLanguage === option.value ? "default" : "outline"}
            className={
              selectedLanguage === option.value
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant font-medium"
                : "hover:bg-muted font-medium"
            }
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Converter Cards */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Input Card */}
        <Card className="p-6 space-y-4 shadow-elegant transition-shadow hover:shadow-glow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedLanguage === "benglish-bangla" ? "Benglish" : "Hinglish"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {inputText.length} characters
            </span>
          </div>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedLanguage === "benglish-bangla"
                ? "Type in Benglish... (e.g., Ami tomake bhalobashi)\nPress Enter to convert"
                : "Type in Hinglish... (e.g., Main tumse pyar karta hoon)\nPress Enter to convert"
            }
            className="min-h-[200px] text-base resize-none border-border focus:ring-primary"
            disabled={isLoading}
          />
        </Card>

        {/* Output Card */}
        <Card className="p-6 space-y-4 shadow-elegant transition-shadow hover:shadow-glow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedLanguage === "benglish-bangla" ? "বাংলা" : "हिंदी"}
            </h2>
            {outputText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="hover:bg-muted"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            )}
          </div>
          <div className="min-h-[200px] p-4 bg-muted rounded-md text-base whitespace-pre-wrap">
            {outputText || (
              <span className="text-muted-foreground">
                Converted text will appear here...
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleConvert}
          disabled={isLoading || !inputText.trim()}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant px-8 transition-all font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              Convert
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LanguageConverter;
