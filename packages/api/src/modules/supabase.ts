import { createClient } from "@supabase/supabase-js";
class SupabaseClient {
  private client;
  private performanceData;
  constructor() {
    this.client = createClient(
      "https://etqipujwfnsodacgmqua.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cWlwdWp3Zm5zb2RhY2dtcXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzQzNzksImV4cCI6MjA1NjcxMDM3OX0.B32FmMwgeRxkGVBd5bvlTEKzKtIn-5CXQ5mwETVegEg",
    );
  }
  //async insertData(metrics) {
  //  try {
  //    const { data, error } = await this.client
  //      .from("metrics")
  //      .insert([metrics]);
  //    console.log(data);
  //  } catch (error) {
  //    throw error;
  //  }
  //}
  async insertData(metrics) {
    const { data, error } = await this.client.from("metrics").insert([metrics]);

    if (error) {
      console.error("❌ Supabase insert error:", error.message, error.details);
    } else {
      console.log("✅ Inserted successfully:", data);
    }
  }
  async getData() {
    const { data, error } = await this.client
      .from("postgres")
      .select("*")
      .limit(1);
    if (error) throw new Error(error.message);
    return data;
  }
}
export default SupabaseClient;
