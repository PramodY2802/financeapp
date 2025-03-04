import puppeteer from "puppeteer";
import fs from "fs";

let browser;
let page;
const SESSION_FILE_PATH = "./session.json";

export const startWhatsAppSession = async () => {
  browser = await puppeteer.launch({
    headless: false, 
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", 
      "--disable-gpu", 
      "--disable-infobars",
      "--start-maximized"
    ]
  });

  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // **Session File Exists असेल तर Cookies Load करा**
  if (fs.existsSync(SESSION_FILE_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, "utf-8"));
    await page.setCookie(...cookies);
    console.log("🍪 Cookies Loaded! Using existing session.");
  }

  await page.goto("https://web.whatsapp.com");

  
  try {
    // **QR Code Check**
    await page.waitForSelector("canvas[aria-label='Scan me!']", { timeout: 60000 });
    console.log("🚀 Scan QR Code in WhatsApp Web!");

    // **Session Validate करण्यासाठी 2 Min Timeout**
    await page.waitForSelector("div[role='textbox']", { timeout: 120000 });

    const cookies = await page.cookies();
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(cookies));
    console.log("✅ WhatsApp Web Session Saved!");
  } catch (error) {
    console.error("⚠️ QR Code Scan Timeout! Try Again.");
  }
};

export const sendWhatsAppMessage = async (phone, message) => {
    try {
      if (!browser || !page) {
        console.log("🔴 WhatsApp Web session not started!");
        return;
      }
  
      console.log("🔄 Opening Chat...");
      await page.goto(`https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`);
  
      // **Chat Box Loaded होईपर्यंत थांबा**
      await page.waitForSelector("div[contenteditable='true']", { timeout: 30000 });
  
      // **थोडा Delay द्या (2s) जेणेकरून Page Load होईल**
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      // **Message Enter करणे**
      await page.keyboard.press("Enter");
  
      console.log(`✅ Message sent to ${phone}`);
    } catch (error) {
      console.error("❌ Error sending WhatsApp message:", error);
    }
  };
  