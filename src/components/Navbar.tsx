import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, Coins } from "lucide-react";
import { getUserCredits } from "@/services/creditsService";

interface NavbarProps {
  user: User;
  onSignOut: () => void;
  creditsRefreshTrigger?: number;
}

const Navbar = ({ user, onSignOut, creditsRefreshTrigger }: NavbarProps) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setIsLoadingCredits(true);
        const creditsData = await getUserCredits();
        setCredits(creditsData?.credits_remaining ?? null);
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setIsLoadingCredits(false);
      }
    };

    fetchCredits();
  }, [creditsRefreshTrigger]);

  return (
    <header className="pt-6 md:pt-12 pb-6 md:pb-8 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Script <span className="text-primary">Bridge</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 md:px-4 font-medium mt-2 md:mt-4">
              Convert Benglish to বাংলা and Hinglish to हिंदी instantly with AI-powered transliteration
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 hidden sm:flex">
              <Coins className="h-3.5 w-3.5" />
              <span className="font-semibold">
                {isLoadingCredits ? "..." : credits ?? 0}
              </span>
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs md:text-sm">
                      {getInitials(user.email || "")}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">My Account</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-2 sm:hidden">
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-semibold ml-auto">
                      {isLoadingCredits ? "..." : credits ?? 0}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator className="sm:hidden" />
                <DropdownMenuItem onClick={() => navigate("/account")} className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
