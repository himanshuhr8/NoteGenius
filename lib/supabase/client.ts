import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

// These environment variables are empty by default
// They will be populated after connecting to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
