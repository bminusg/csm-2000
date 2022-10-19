//import { createClient } from "@supabase/supabase-js";
class Dynamic {
  constructor(config = {}) {
    this.feed = this.feed;
  }
  async load() {
    try {
      // const supabaseUrl = "https://hcexxjbrlgakerhrolrt.supabase.co";
      // const supabaseKey =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZXh4amJybGdha2VyaHJvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU4NTEzMzksImV4cCI6MTk4MTQyNzMzOX0.5LZ2b8_YwO0VnV-1o2RmIronNNZ9ifibQdQEdgFosQ0";
      // const supabase = createClient(supabaseUrl, supabaseKey);

      // let { data: products, error } = await supabase
      //   .from("products")
      //   .select("*");

      // console.log("DATA", products);
      // console.log("DATA error", error);

      // const csv = await fetch(
      //   "https://mics.bild.de/dev/test_gtargeting_mrec_300x250_01/data/vendor--01.csv"
      // );

      if (typeof this.feed !== "string") this.data = this.feed;
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  parse() {
    console.log("DATA", this.data);
  }
}

export default Dynamic;
