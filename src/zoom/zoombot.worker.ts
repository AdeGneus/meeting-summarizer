import { parentPort } from "worker_threads";
import puppeteer from "puppeteer";
import { exec } from "child_process";
import logger from "../common/utils/logger";
import { ZoomService } from "../services/zoom.service";

const ffmpegPath = "/usr/bin/ffmpeg"; // Adjust if needed
const botName = "Tom Meeting Summarizer";
const zoomService = new ZoomService();

parentPort?.on("message", async (workerData: { inviteLink: string }) => {
  try {
    const { inviteLink } = workerData;
    if (!inviteLink) throw new Error("Invalid Zoom invite link received.");

    logger.info(`🔹 Fetching Join URL from Invite Link: ${inviteLink}`);
    const { meetingId, passcode } = await zoomService.getMeetingIdAndPasscode(
      inviteLink,
    );
    if (!meetingId)
      throw new Error("Failed to extract the meeting ID from the invite link.");

    if (!passcode) {
      throw new Error("Passcode is required");
    }

    const webClientUrl = `https://zoom.us/wc/${meetingId}/join`;
    logger.info(`🔹 Bot Joining via Web Client URL: ${webClientUrl}`);

    // Run Puppeteer for Zoom interaction
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--use-fake-ui-for-media-stream",
      ],
    });

    const page = await browser.newPage();
    await page.goto(webClientUrl, { waitUntil: "networkidle2" });
    logger.info("✅ Loaded Join Page!");

    await joinMeeting(page, passcode);

    // Start audio recording in a separate process
    startAudioRecording();

    // Wait for meeting end
    await waitForMeetingToEnd(page);
    await browser.close();
    logger.info("✅ Bot Left the Meeting!");

    // Stop recording and process audio
    stopAudioRecording();
    await transcribeAudio("output.mp3");
  } catch (error: any) {
    logger.error("❌ Error:", error);
    parentPort?.postMessage({ success: false, error: error.message });
  }
});

async function joinMeeting(page: any, passcode?: string) {
  await page.waitForSelector("#input-for-name");
  await page.type("#input-for-name", botName);
  if (passcode) await page.type("#input-for-pwd", passcode);

  await page.click(".zm-btn.preview-join-button");
  logger.info("✅ Bot Joined Meeting!");
}

async function waitForMeetingToEnd(page: any) {
  try {
    await page.waitForSelector(".zoom-meeting-ended", { timeout: 60000 });
    logger.info("❌ Meeting has ended. Bot is leaving.");
  } catch {
    logger.info("⏳ Meeting still active...");
  }
}

function startAudioRecording() {
  exec(
    `${ffmpegPath} -f pulse -i virtual_sink.monitor -acodec mp3 output.mp3`,
    (error) => {
      if (error) logger.error(`❌ FFmpeg Error: ${error}`);
      else logger.info("✅ Audio recording started.");
    },
  );
}

function stopAudioRecording() {
  exec("pkill ffmpeg", (error) => {
    if (error) logger.error(`❌ Error stopping FFmpeg: ${error}`);
    else logger.info("✅ Audio recording stopped.");
  });
}

async function transcribeAudio(audioFilePath: string) {
  exec(
    `whisper ${audioFilePath} --model large --output_format txt`,
    (error, stdout) => {
      if (error) logger.error(`❌ Whisper Error: ${error}`);
      else {
        logger.info("✅ Transcription complete!");
        parentPort?.postMessage({ success: true, transcription: stdout });
      }
    },
  );
}
