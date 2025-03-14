import { GenerateTextResult } from "ai";
import axios from "axios";

export class TelexService {
  async sendToTelex(summary: string | undefined) {
    try {
      await axios.post(process.env.TELEX_API_URL!, {
        channel: "meeting-transcripts",
        message: `**AI-Generated Summary:**\n${summary}`,
      });

      console.log("✅ AI Summary Sent to Telex Successfully");
    } catch (error) {
      console.error("❌ Failed to Send Summary to Telex:", error);
    }
  }
}
