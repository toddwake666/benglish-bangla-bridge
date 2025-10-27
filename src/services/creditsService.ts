import { supabase } from "@/integrations/supabase/client";

export interface UserCredits {
  id: string;
  user_id: string;
  credits_remaining: number;
  daily_limit: number;
  last_reset_date: string;
  total_credits_used: number;
  created_at: string;
  updated_at: string;
}

export const getUserCredits = async (): Promise<UserCredits | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user found");
      throw new Error("User not authenticated");
    }

    console.log("Calling check_and_reset_user_credits for user:", user.id);

    const { data, error } = await supabase.rpc("check_and_reset_user_credits", {
      p_user_id: user.id,
    });

    if (error) {
      console.error("Error checking credits RPC:", error);
      throw error;
    }

    console.log("RPC result:", data);

    const { data: creditsData, error: creditsError } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (creditsError) {
      console.error("Error fetching credits:", creditsError);
      throw creditsError;
    }

    console.log("Credits data:", creditsData);

    return creditsData;
  } catch (error) {
    console.error("getUserCredits error:", error);
    throw error;
  }
};

export const deductCredits = async (amount: number): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  await supabase.rpc("check_and_reset_user_credits", {
    p_user_id: user.id,
  });

  const { data: currentCredits, error: fetchError } = await supabase
    .from("user_credits")
    .select("credits_remaining, total_credits_used")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching credits for deduction:", fetchError);
    throw fetchError;
  }

  if (!currentCredits || currentCredits.credits_remaining < amount) {
    return false;
  }

  const { error: updateError } = await supabase
    .from("user_credits")
    .update({
      credits_remaining: currentCredits.credits_remaining - amount,
      total_credits_used: currentCredits.total_credits_used + amount,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Error deducting credits:", updateError);
    throw updateError;
  }

  return true;
};

export const checkSufficientCredits = async (requiredAmount: number): Promise<boolean> => {
  const credits = await getUserCredits();
  return credits ? credits.credits_remaining >= requiredAmount : false;
};
