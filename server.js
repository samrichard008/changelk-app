// api/index.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var DB_FILE = process.env.VERCEL ? path.resolve("/tmp", "db.json") : path.resolve(process.cwd(), "db.json");
function seedDefaultDb() {
  const adminId = "admin-user-id";
  const defaultDb = {
    users: [
      {
        id: adminId,
        fullName: "Changelk Administrator",
        phone: "+94771234567",
        passwordHash: "ChangeLKadmin123",
        role: "admin",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ],
    petitions: [
      {
        id: "anojan-petition-id",
        title: "Save Anojan: Appeal for Presidential Pardon & Royal Clemency from Saudi Arabia",
        slug: "save-anojan",
        description: `\u0B85\u0BA9\u0BCB\u0B9C\u0BA9\u0BCD (Anojan) \u0B8E\u0BA9\u0BCD\u0BB1 \u0B87\u0BB3\u0BAE\u0BCD \u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8\u0BA4\u0BCD \u0BA4\u0BAE\u0BBF\u0BB4\u0BB0\u0BBF\u0BA9\u0BCD \u0B89\u0BAF\u0BBF\u0BB0\u0BC8\u0B95\u0BCD \u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BB1\u0BCD\u0BB1 \u0B9A\u0BB5\u0BC2\u0BA4\u0BBF \u0BAE\u0BA9\u0BCD\u0BA9\u0BB0\u0BBF\u0B9F\u0BAE\u0BCD \u0BAA\u0BCA\u0BA4\u0BC1\u0BAE\u0BA9\u0BCD\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0B95\u0BCB\u0BB0\u0BBF \u0B87\u0BA8\u0BCD\u0BA4 \u0B9A\u0BB0\u0BCD\u0BB5\u0BA4\u0BC7\u0B9A \u0BAE\u0BA9\u0BC1\u0BAA\u0BCD \u0BAA\u0BBF\u0BB0\u0B9A\u0BBE\u0BB0\u0BAE\u0BCD \u0BAE\u0BC1\u0BA9\u0BCD\u0BA9\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1. 

\u0B85\u0BA9\u0BCB\u0B9C\u0BA9\u0BCD \u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD \u0BAF\u0BBE\u0BB4\u0BCD\u0BAA\u0BCD\u0BAA\u0BBE\u0BA3\u0BA4\u0BCD\u0BA4\u0BC8\u0B9A\u0BCD \u0B9A\u0BC7\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BB5\u0BB0\u0BCD. \u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA \u0BB5\u0BB1\u0BC1\u0BAE\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD \u0B95\u0BBE\u0BB0\u0BA3\u0BAE\u0BBE\u0B95 \u0B9A\u0BB5\u0BC2\u0BA4\u0BBF \u0B85\u0BB0\u0BC7\u0BAA\u0BBF\u0BAF\u0BBE\u0BB5\u0BBF\u0BB1\u0BCD\u0B95\u0BC1\u0BAA\u0BCD \u0BAA\u0BA3\u0BBF\u0BAA\u0BCD \u0BAA\u0BC6\u0BA3\u0BCD\u0BA3\u0BBF\u0BA9\u0BCD \u0BAE\u0B95\u0BA9\u0BBE\u0B95\u0B9A\u0BCD \u0B9A\u0BC6\u0BA9\u0BCD\u0BB1\u0BC1 \u0B89\u0BB4\u0BC8\u0B95\u0BCD\u0B95\u0BA4\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95\u0BBF\u0BA9\u0BBE\u0BB0\u0BCD. \u0B85\u0B99\u0BCD\u0B95\u0BC1 \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BBE\u0BA4 \u0BB5\u0BBF\u0BAA\u0BA4\u0BCD\u0BA4\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B9A\u0BC2\u0BB4\u0BCD\u0BA8\u0BBF\u0BB2\u0BC8 \u0B95\u0BBE\u0BB0\u0BA3\u0BAE\u0BBE\u0B95 \u0B85\u0BB5\u0BB0\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BAE\u0BB0\u0BA3 \u0BA4\u0BA3\u0BCD\u0B9F\u0BA9\u0BC8 \u0BB5\u0BBF\u0BA4\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1.

\u0B85\u0BB5\u0BB0\u0BA4\u0BC1 \u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA\u0BAE\u0BC1\u0BAE\u0BCD \u0B92\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8\u0BAF\u0BB0\u0BCD\u0B95\u0BB3\u0BC1\u0BAE\u0BCD \u0B9A\u0BB5\u0BC2\u0BA4\u0BBF \u0BAE\u0BA9\u0BCD\u0BA9\u0BB0\u0BCD \u0B9A\u0BB2\u0BCD\u0BAE\u0BBE\u0BA9\u0BCD \u0BAA\u0BBF\u0BA9\u0BCD \u0B85\u0BAA\u0BCD\u0BA4\u0BC1\u0BB2\u0BCD\u0B85\u0B9C\u0BBF\u0BB8\u0BCD (King Salman bin Abdulaziz Al Saud) \u0B85\u0BB5\u0BB0\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD, \u0B9A\u0BB5\u0BC2\u0BA4\u0BBF \u0B85\u0BB0\u0BC7\u0BAA\u0BBF\u0BAF \u0B85\u0BB0\u0B9A \u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAE\u0BA9\u0BBF\u0BA4\u0BBE\u0BAA\u0BBF\u0BAE\u0BBE\u0BA9 \u0B85\u0B9F\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0BAA\u0BCA\u0BA4\u0BC1\u0BAE\u0BA9\u0BCD\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BBF \u0B85\u0BA9\u0BCB\u0B9C\u0BA9\u0BC8 \u0BB5\u0BBF\u0B9F\u0BC1\u0BA4\u0BB2\u0BC8 \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0BAE\u0BBE\u0BB1\u0BC1 \u0BAE\u0BA9\u0BCD\u0BB1\u0BBE\u0B9F\u0BBF\u0BAA\u0BCD \u0BAA\u0BBF\u0BB0\u0BBE\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBF\u0B95\u0BCD\u0B95\u0BBF\u0BA9\u0BCD\u0BB1\u0BA9\u0BB0\u0BCD. 

**\u0BA8\u0BBE\u0BAE\u0BCD \u0B95\u0BCB\u0BB0\u0BC1\u0BB5\u0BA4\u0BC1:**
1. \u0BAE\u0BBE\u0BA3\u0BCD\u0BAA\u0BC1\u0BAE\u0BBF\u0B95\u0BC1 \u0B9A\u0BB5\u0BC2\u0BA4\u0BBF \u0BAE\u0BA9\u0BCD\u0BA9\u0BB0\u0BCD \u0B85\u0BA9\u0BCB\u0B9C\u0BA9\u0BCD \u0BA4\u0BAE\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BC1 \u0BA4\u0BA9\u0BA4\u0BC1 \u0BAE\u0BC7\u0BB2\u0BBE\u0BA9 \u0B85\u0BB0\u0B9A \u0BAA\u0BCA\u0BA4\u0BC1\u0BAE\u0BA9\u0BCD\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BC8 (Royal Clemency) \u0BB5\u0BB4\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.
2. \u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8 \u0B9C\u0BA9\u0BBE\u0BA4\u0BBF\u0BAA\u0BA4\u0BBF \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BC6\u0BB3\u0BBF\u0BB5\u0BBF\u0B95\u0BBE\u0BB0 \u0B85\u0BAE\u0BC8\u0B9A\u0BCD\u0B9A\u0BC1 \u0B89\u0B9F\u0BA9\u0B9F\u0BBF\u0BAF\u0BBE\u0B95 \u0B9A\u0BB5\u0BC2\u0BA4\u0BBF \u0BA4\u0BC2\u0BA4\u0BB0\u0B95\u0BA4\u0BCD\u0BA4\u0BC1\u0B9F\u0BA9\u0BCD \u0B89\u0BAF\u0BB0\u0BCD\u0BAE\u0B9F\u0BCD\u0B9F \u0B87\u0BB0\u0BBE\u0B9C\u0BA4\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BAA\u0BC7\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BBE\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC8\u0B95\u0BB3\u0BC8 (Diplomatic Mediation) \u0BAE\u0BC1\u0BA9\u0BCD\u0BA9\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.

\u0B92\u0BB5\u0BCD\u0BB5\u0BCA\u0BB0\u0BC1 \u0B95\u0BC8\u0BAF\u0BCA\u0BAA\u0BCD\u0BAA\u0BAE\u0BC1\u0BAE\u0BCD \u0B85\u0BA9\u0BCB\u0B9C\u0BA9\u0BBF\u0BA9\u0BCD \u0B89\u0BAF\u0BBF\u0BB0\u0BC8\u0B95\u0BCD \u0B95\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0BAE\u0BBE\u0BAA\u0BC6\u0BB0\u0BC1\u0BAE\u0BCD \u0B9A\u0B95\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE\u0B95 \u0BAE\u0BBE\u0BB1\u0BC1\u0BAE\u0BCD. \u0BA4\u0BAF\u0BB5\u0BC1\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BC1 \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BC8\u0BAF\u0BCA\u0BAA\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BC8\u0BAA\u0BCD \u0BAA\u0BA4\u0BBF\u0BB5\u0BC1\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BC1, \u0B85\u0BA9\u0BCB\u0B9C\u0BA9\u0BC8 \u0BAE\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0BA4\u0BCD \u0BA4\u0BB0 \u0B89\u0BA4\u0BB5\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.`,
        targetCount: 1e6,
        currentCount: 312411,
        creatorId: adminId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "active"
      },
      {
        id: "hikkaduwa-coral-reef-id",
        title: "Protect Sri Lanka's Coral Reefs in Hikkaduwa from Commercial Boating",
        slug: "protect-hikkaduwa-coral-reefs",
        description: `Hikkaduwa Marine Sanctuary is facing critical degradation due to plastic pollution, illegal anchoring, and rising sea temperatures. This petition urges the Department of Wildlife Conservation (DWC) to declare the area a strict marine reserve and restrict commercial motorized boating inside the shallow lagoon. 

Our coral reefs are an irreplaceable natural treasure and key to Sri Lanka's marine tourism. We must protect them before they are completely bleached and destroyed.`,
        targetCount: 5e4,
        currentCount: 14205,
        creatorId: adminId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "active"
      },
      {
        id: "safe-transport-colombo-id",
        title: "Introduce Safer CCTV-Monitored Public Transport Options for Women in Colombo",
        slug: "safe-transport-colombo",
        description: `Over 80% of women using public buses and trains in Colombo report facing verbal or physical harassment during transit. We appeal to the Ministry of Transport and Highways to introduce dedicated CCTV-monitored compartments, trained transit marshals, and a direct emergency reporting hotline. 

Safe transit is a fundamental right of every citizen. Let us build a safer Colombo for our mothers, sisters, and daughters.`,
        targetCount: 1e5,
        currentCount: 48922,
        creatorId: adminId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "active"
      }
    ],
    signatures: [
      {
        id: "sig-1",
        petitionId: "anojan-petition-id",
        fullName: "Saman Kumara",
        phone: "+94718881234",
        district: "Colombo",
        comment: "\u0B85\u0BA9\u0BCB\u0B9C\u0BA9\u0BCD \u0B89\u0BAF\u0BBF\u0BB0\u0BC8\u0B95\u0BCD \u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BB1\u0BCD\u0BB1 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD. \u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8 \u0B85\u0BB0\u0B9A\u0BBE\u0B99\u0BCD\u0B95\u0BAE\u0BCD \u0B89\u0B9F\u0BA9\u0BC7 \u0BA4\u0BC2\u0BA4\u0BB0\u0B95 \u0BB0\u0BC0\u0BA4\u0BBF\u0BAF\u0BBE\u0B95 \u0BA4\u0BB2\u0BC8\u0BAF\u0BBF\u0B9F \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.",
        signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Saman",
        createdAt: new Date(Date.now() - 36e5 * 2).toISOString()
      },
      {
        id: "sig-2",
        petitionId: "anojan-petition-id",
        fullName: "Fathima Rizna",
        phone: "+94754445678",
        district: "Kandy",
        comment: "Praying for Anojans safe return. We appeal to the mercy of the Saudi King.",
        signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Fathima",
        createdAt: new Date(Date.now() - 36e5 * 1.5).toISOString()
      },
      {
        id: "sig-3",
        petitionId: "anojan-petition-id",
        fullName: "A. Thamilselvan",
        phone: "+94779998888",
        district: "Jaffna",
        comment: "\u0BAE\u0BBF\u0B95\u0BB5\u0BC1\u0BAE\u0BCD \u0BAE\u0BA9\u0BBF\u0BA4\u0BBE\u0BAA\u0BBF\u0BAE\u0BBE\u0BA9 \u0B85\u0B9F\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC8\u0BAF\u0BBF\u0BB2\u0BBE\u0BA9 \u0B95\u0BCB\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BC8. \u0B9A\u0BB5\u0BC2\u0BA4\u0BBF \u0BAE\u0BA9\u0BCD\u0BA9\u0BB0\u0BCD \u0BAA\u0BCA\u0BA4\u0BC1\u0BAE\u0BA9\u0BCD\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0BB5\u0BB4\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.",
        signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Thamil",
        createdAt: new Date(Date.now() - 36e5 * 0.5).toISOString()
      },
      {
        id: "sig-4",
        petitionId: "anojan-petition-id",
        fullName: "Dilshan Perera",
        phone: "+94722223333",
        district: "Gampaha",
        comment: "We stand with Anojans family. Let us make this petition reach the Saudi Embassy.",
        signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Dilshan",
        createdAt: new Date(Date.now() - 12e5).toISOString()
      }
    ],
    polls: [
      {
        id: "poll-1",
        title: "Do you support the proposed 22nd Amendment to the Constitution of Sri Lanka?",
        description: "The proposed 22nd Amendment aims to restrict the executive powers of the Executive Presidency, empowering the Constitutional Council and establishing independent public commissions. We seek the public consensus on this vital legislative transition.",
        creatorId: adminId,
        createdAt: new Date(Date.now() - 36e5 * 48).toISOString(),
        status: "active"
      },
      {
        id: "poll-2",
        title: "Do you agree with implementing stricter environment levies on vehicles entering Colombo limits?",
        description: "To curb rising carbon emissions and severe congestion, a congestion charge and environment levy is proposed for all private combustion engines entering Colombo during peak hours. Share your sovereign opinion.",
        creatorId: adminId,
        createdAt: new Date(Date.now() - 36e5 * 24).toISOString(),
        status: "active"
      }
    ],
    pollVotes: [
      { id: "pv-1", pollId: "poll-1", fullName: "Roshan S.", phone: "+94711111111", option: "yes", district: "Colombo", comment: "Highly supportive! This reform is long overdue for Sri Lanka.", signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Roshan", createdAt: new Date(Date.now() - 36e5 * 10).toISOString() },
      { id: "pv-2", pollId: "poll-1", fullName: "Meena K.", phone: "+94711111112", option: "yes", district: "Kandy", comment: "We must restrict executive authority to ensure public trust.", signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Meena", createdAt: new Date(Date.now() - 36e5 * 9).toISOString() },
      { id: "pv-3", pollId: "poll-1", fullName: "Nimal P.", phone: "+94711111113", option: "no", district: "Galle", comment: "No, this proposal does not go far enough. We need total abolition.", signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Nimal", createdAt: new Date(Date.now() - 36e5 * 8).toISOString() },
      { id: "pv-4", pollId: "poll-1", fullName: "Sarah G.", phone: "+94711111114", option: "neutral", district: "Jaffna", comment: "Waiting to see the final draft before forming a stance.", signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah", createdAt: new Date(Date.now() - 36e5 * 7).toISOString() },
      { id: "pv-5", pollId: "poll-2", fullName: "Amila W.", phone: "+94711111115", option: "no", district: "Colombo", comment: "This will unfairly penalize poor drivers and micro-businesses.", signatureImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Amila", createdAt: new Date(Date.now() - 36e5 * 6).toISOString() }
    ]
  };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf-8");
  } catch (e) {
  }
  return defaultDb;
}
async function syncDbFromBunny() {
  const STORAGE_ZONE = "gnanasara-petition";
  const ACCESS_KEY = "e09085cd-4065-4aa7-a543641e2577-a063-4a05";
  const ENDPOINT = "sg.storage.bunnycdn.com";
  const DB_FILENAME = "db.json";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4e3);
    const response = await fetch(`https://${ENDPOINT}/${STORAGE_ZONE}/${DB_FILENAME}`, {
      method: "GET",
      headers: {
        "AccessKey": ACCESS_KEY,
        "Accept": "application/json"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (response.ok) {
      const data = await response.text();
      fs.writeFileSync(DB_FILE, data, "utf-8");
      console.log("Database synchronized successfully from Bunny.net storage!");
    }
  } catch (error) {
    console.warn("Bunny sync non-blocking catch:", error);
  }
}
async function uploadDbToBunny(data) {
  const STORAGE_ZONE = "gnanasara-petition";
  const ACCESS_KEY = "e09085cd-4065-4aa7-a543641e2577-a063-4a05";
  const ENDPOINT = "sg.storage.bunnycdn.com";
  const DB_FILENAME = "db.json";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5e3);
    await fetch(`https://${ENDPOINT}/${STORAGE_ZONE}/${DB_FILENAME}`, {
      method: "PUT",
      headers: {
        "AccessKey": ACCESS_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data, null, 2),
      signal: controller.signal
    });
    clearTimeout(timeout);
  } catch (err) {
    console.error("Error uploading db.json to Bunny.net:", err);
  }
}
function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (!parsed.users) parsed.users = [];
      if (!parsed.polls) parsed.polls = [];
      if (!parsed.pollVotes) parsed.pollVotes = [];
      const hasAdmin = parsed.users.some((u) => (u.phone === "+94771234567" || u.phone === "0771234567") && u.role === "admin");
      if (!hasAdmin) {
        parsed.users.push({
          id: "admin-user-id",
          fullName: "Changelk Administrator",
          phone: "+94771234567",
          passwordHash: "ChangeLKadmin123",
          role: "admin",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
        } catch (e) {
        }
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error reading database file:", err);
  }
  return seedDefaultDb();
}
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    uploadDbToBunny(data).catch(() => {
    });
  } catch (err) {
    console.error("Error writing database:", err);
  }
}
async function uploadToBunny(base64Image, filename) {
  const STORAGE_ZONE = "gnanasara-petition";
  const ACCESS_KEY = "e09085cd-4065-4aa7-a543641e2577-a063-4a05";
  const ENDPOINT = "sg.storage.bunnycdn.com";
  const CDN_BASE = "https://gnanasara-petition.b-cdn.net";
  try {
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const response = await fetch(`https://${ENDPOINT}/${STORAGE_ZONE}/${filename}`, {
      method: "PUT",
      headers: {
        "AccessKey": ACCESS_KEY,
        "Content-Type": "image/png"
      },
      body: buffer
    });
    if (response.ok) {
      return `${CDN_BASE}/${filename}`;
    }
  } catch (error) {
  }
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(filename)}`;
}
function generateToken(userId, role) {
  return crypto.createHash("sha256").update(userId + "-" + role + "-changelk-secret-2026").digest("hex");
}
function validateSession(req, userId, expectedRole) {
  let token = "";
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }
  if (!token && req.query.token) {
    token = req.query.token;
  }
  if (!token || !userId) return false;
  try {
    const db = readDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return false;
    const expectedToken = generateToken(user.id, user.role);
    if (token !== expectedToken) return false;
    if (expectedRole && user.role !== expectedRole) return false;
    return true;
  } catch {
    return false;
  }
}
var app = express();
app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
syncDbFromBunny().catch(() => {
});
var router = express.Router();
router.get("/petitions", (req, res) => {
  try {
    const db = readDb();
    res.json(db.petitions);
  } catch {
    res.status(500).json({ error: "Failed to retrieve petitions" });
  }
});
router.get("/petitions/:slug", (req, res) => {
  try {
    const db = readDb();
    const petition = db.petitions.find((p) => p.slug === req.params.slug);
    if (!petition) return res.status(404).json({ error: "Petition not found" });
    const petitionSignatures = db.signatures.filter((s) => s.petitionId === petition.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ ...petition, signatures: petitionSignatures });
  } catch {
    res.status(500).json({ error: "Failed to retrieve petition details" });
  }
});
router.post("/petitions/:id/sign", async (req, res) => {
  const { id: petitionId } = req.params;
  const { fullName, phone, district, comment, signatureBase64 } = req.body;
  if (!fullName || !phone || !district) {
    return res.status(400).json({ error: "Missing required signature details" });
  }
  try {
    const db = readDb();
    const petition = db.petitions.find((p) => p.id === petitionId);
    if (!petition) return res.status(404).json({ error: "Petition not found" });
    const existingSig = db.signatures.find((s) => s.petitionId === petitionId && s.phone === phone);
    if (existingSig) {
      return res.status(409).json({ error: "\u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B8F\u0BB1\u0BCD\u0B95\u0BA9\u0BB5\u0BC7 \u0B87\u0BA8\u0BCD\u0BA4 \u0BAE\u0BA9\u0BC1\u0BB5\u0BBF\u0BB2\u0BCD \u0B95\u0BC8\u0BAF\u0BCA\u0BAA\u0BCD\u0BAA\u0BAE\u0BBF\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD! (You have already signed this petition!)" });
    }
    let user = db.users.find((u) => u.phone === phone);
    let accountCreated = false;
    let tempPassword = "";
    if (!user) {
      tempPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
      user = {
        id: "user_" + crypto.randomUUID(),
        fullName,
        phone,
        passwordHash: tempPassword,
        role: "user",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.users.push(user);
      accountCreated = true;
    }
    let sigImgUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;
    if (signatureBase64 && signatureBase64.startsWith("data:image/png;base64,")) {
      const filename = `sig_${petitionId}_${Date.now()}.png`;
      sigImgUrl = await uploadToBunny(signatureBase64, filename);
    }
    const newSignature = {
      id: "sig_" + crypto.randomUUID(),
      petitionId,
      fullName,
      phone,
      district,
      comment: comment || "",
      signatureImageUrl: sigImgUrl,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.signatures.push(newSignature);
    petition.currentCount += 1;
    writeDb(db);
    res.status(201).json({
      success: true,
      signature: newSignature,
      accountCreated,
      generatedPassword: tempPassword,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch {
    res.status(500).json({ error: "Failed to register signature" });
  }
});
router.post("/petitions", async (req, res) => {
  const { title, description, targetCount, creatorId, imageUrl, imageBase64 } = req.body;
  if (!title || !description || !targetCount || !creatorId) {
    return res.status(400).json({ error: "Missing required campaign details" });
  }
  try {
    const db = readDb();
    if (!validateSession(req, creatorId, "admin")) {
      return res.status(401).json({ error: "\u0BAE\u0BA9\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BC8 \u0B85\u0B9F\u0BCD\u0BAE\u0BBF\u0BA9\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7 \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD! (Only admins can start petitions!)" });
    }
    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "petition-" + Date.now();
    let finalImageUrl = imageUrl || "";
    if (imageBase64 && imageBase64.startsWith("data:image/")) {
      finalImageUrl = await uploadToBunny(imageBase64, `petition_${Date.now()}.png`);
    }
    const newPetition = {
      id: "pet_" + crypto.randomUUID(),
      title,
      slug: cleanSlug,
      description,
      targetCount: Number(targetCount),
      currentCount: 0,
      creatorId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "active",
      imageUrl: finalImageUrl
    };
    db.petitions.push(newPetition);
    writeDb(db);
    res.status(201).json({ success: true, petition: newPetition });
  } catch {
    res.status(500).json({ error: "Failed to create petition" });
  }
});
router.put("/petitions/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, targetCount, creatorId, imageUrl, imageBase64 } = req.body;
  try {
    const db = readDb();
    if (!validateSession(req, creatorId, "admin")) {
      return res.status(401).json({ error: "\u0B85\u0B9F\u0BCD\u0BAE\u0BBF\u0BA9\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7 \u0BAE\u0BA9\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BC8 \u0BA4\u0BBF\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD!" });
    }
    const petition = db.petitions.find((p) => p.id === id);
    if (!petition) return res.status(404).json({ error: "Petition not found" });
    if (title) petition.title = title;
    if (description) petition.description = description;
    if (targetCount) petition.targetCount = Number(targetCount);
    if (imageUrl) petition.imageUrl = imageUrl;
    if (imageBase64 && imageBase64.startsWith("data:image/")) {
      petition.imageUrl = await uploadToBunny(imageBase64, `petition_edit_${Date.now()}.png`);
    }
    writeDb(db);
    res.json({ success: true, petition });
  } catch {
    res.status(500).json({ error: "Failed to update petition" });
  }
});
router.delete("/petitions/:id", (req, res) => {
  const { id } = req.params;
  const creatorId = req.body && req.body.creatorId || req.query.creatorId;
  try {
    const db = readDb();
    if (!validateSession(req, creatorId, "admin")) {
      return res.status(401).json({ error: "\u0B85\u0B9F\u0BCD\u0BAE\u0BBF\u0BA9\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7 \u0BAE\u0BA9\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BC8 \u0BA8\u0BC0\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD!" });
    }
    db.petitions = db.petitions.filter((p) => p.id !== id);
    db.signatures = db.signatures.filter((s) => s.petitionId !== id);
    writeDb(db);
    res.json({ success: true, message: "Petition deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete petition" });
  }
});
router.get("/petitions/:id/export", (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId;
  try {
    const db = readDb();
    if (!validateSession(req, userId, "admin")) {
      return res.status(401).send("Unauthorized export");
    }
    const petition = db.petitions.find((p) => p.id === id);
    if (!petition) return res.status(404).send("Petition not found");
    const sigs = db.signatures.filter((s) => s.petitionId === id);
    let csvContent = "Full Name,Phone Number,District,Date,Comment\n";
    sigs.forEach((s) => {
      csvContent += `"${(s.fullName || "").replace(/"/g, '""')}","${(s.phone || "").replace(/"/g, '""')}","${(s.district || "").replace(/"/g, '""')}","${new Date(s.createdAt).toLocaleDateString()}","${(s.comment || "").replace(/"/g, '""')}"
`;
    });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="signatures_${petition.slug}.csv"`);
    res.status(200).send(csvContent);
  } catch {
    res.status(500).send("Error generating export");
  }
});
router.get("/polls", (req, res) => {
  try {
    const db = readDb();
    const pollSummaries = db.polls.map((poll) => {
      const votes = db.pollVotes.filter((v) => v.pollId === poll.id);
      const total = votes.length;
      const yes = votes.filter((v) => v.option === "yes").length;
      const no = votes.filter((v) => v.option === "no").length;
      const neutral = votes.filter((v) => v.option === "neutral").length;
      return {
        ...poll,
        totalVotes: total,
        yesCount: yes,
        noCount: no,
        neutralCount: neutral,
        yesPercentage: total > 0 ? Math.round(yes / total * 100) : 0,
        noPercentage: total > 0 ? Math.round(no / total * 100) : 0,
        neutralPercentage: total > 0 ? Math.round(neutral / total * 100) : 0,
        votes: votes.slice(-20).reverse()
      };
    });
    res.json(pollSummaries);
  } catch {
    res.status(500).json({ error: "Failed to retrieve polls" });
  }
});
router.post("/polls/:id/vote", async (req, res) => {
  const { id: pollId } = req.params;
  const { fullName, phone, option, district, comment, signatureBase64 } = req.body;
  if (!fullName || !phone || !option) {
    return res.status(400).json({ error: "Missing required voting details" });
  }
  try {
    const db = readDb();
    const poll = db.polls.find((p) => p.id === pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    const existingVote = db.pollVotes.find((v) => v.pollId === pollId && v.phone === phone);
    if (existingVote) {
      return res.status(409).json({ error: "\u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B8F\u0BB1\u0BCD\u0B95\u0BA9\u0BB5\u0BC7 \u0B87\u0BA8\u0BCD\u0BA4 \u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BA3\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0BB2\u0BCD \u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BB3\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1\u0BB5\u0BBF\u0B9F\u0BCD\u0B9F\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD! (You have already voted!)" });
    }
    let user = db.users.find((u) => u.phone === phone);
    let accountCreated = false;
    let tempPassword = "";
    if (!user) {
      tempPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
      user = {
        id: "user_" + crypto.randomUUID(),
        fullName,
        phone,
        passwordHash: tempPassword,
        role: "user",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.users.push(user);
      accountCreated = true;
    }
    let sigImgUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;
    if (signatureBase64 && signatureBase64.startsWith("data:image/png;base64,")) {
      sigImgUrl = await uploadToBunny(signatureBase64, `vote_${pollId}_${Date.now()}.png`);
    }
    const newVote = {
      id: "pv_" + crypto.randomUUID(),
      pollId,
      fullName,
      phone,
      option,
      district: district || "",
      comment: comment || "",
      signatureImageUrl: sigImgUrl,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.pollVotes.push(newVote);
    writeDb(db);
    res.status(201).json({
      success: true,
      vote: newVote,
      accountCreated,
      generatedPassword: tempPassword,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch {
    res.status(500).json({ error: "Failed to cast vote" });
  }
});
router.post("/polls", (req, res) => {
  const { title, description, creatorId } = req.body;
  if (!title || !description || !creatorId) {
    return res.status(400).json({ error: "Missing required poll details" });
  }
  try {
    const db = readDb();
    if (!validateSession(req, creatorId, "admin")) {
      return res.status(401).json({ error: "\u0BAE\u0BA9\u0BC1 \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BA3\u0BBF\u0BAA\u0BCD\u0BAA\u0BC8 \u0B85\u0B9F\u0BCD\u0BAE\u0BBF\u0BA9\u0BCD \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7 \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD!" });
    }
    const newPoll = {
      id: "poll_" + crypto.randomUUID(),
      title,
      description,
      imageUrl: req.body.imageUrl || "",
      creatorId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "active"
    };
    db.polls.push(newPoll);
    writeDb(db);
    res.status(201).json({ success: true, poll: newPoll });
  } catch {
    res.status(500).json({ error: "Failed to create poll" });
  }
});
router.put("/polls/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, creatorId, imageUrl } = req.body;
  try {
    const db = readDb();
    if (!validateSession(req, creatorId, "admin")) {
      return res.status(401).json({ error: "\u0B85\u0B9F\u0BCD\u0BAE\u0BBF\u0BA9\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7 \u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BA3\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BC8 \u0BA4\u0BBF\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD!" });
    }
    const poll = db.polls.find((p) => p.id === id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    if (title) poll.title = title;
    if (description) poll.description = description;
    if (imageUrl !== void 0) poll.imageUrl = imageUrl;
    writeDb(db);
    res.json({ success: true, poll });
  } catch {
    res.status(500).json({ error: "Failed to update poll" });
  }
});
router.delete("/polls/:id", (req, res) => {
  const { id } = req.params;
  const creatorId = req.body && req.body.creatorId || req.query.creatorId;
  try {
    const db = readDb();
    if (!validateSession(req, creatorId, "admin")) {
      return res.status(401).json({ error: "\u0B85\u0B9F\u0BCD\u0BAE\u0BBF\u0BA9\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7 \u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BA3\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BC8 \u0BA8\u0BC0\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD!" });
    }
    db.polls = db.polls.filter((p) => p.id !== id);
    db.pollVotes = db.pollVotes.filter((v) => v.pollId !== id);
    writeDb(db);
    res.json({ success: true, message: "Poll deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete poll" });
  }
});
router.get("/polls/:id/export", (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId;
  try {
    const db = readDb();
    if (!validateSession(req, userId, "admin")) {
      return res.status(401).send("Unauthorized export");
    }
    const poll = db.polls.find((p) => p.id === id);
    if (!poll) return res.status(404).send("Poll not found");
    const votes = db.pollVotes.filter((v) => v.pollId === id);
    let csvContent = "Full Name,Phone Number,Option,Date\n";
    votes.forEach((v) => {
      csvContent += `"${(v.fullName || "").replace(/"/g, '""')}","${(v.phone || "").replace(/"/g, '""')}","${(v.option || "").toUpperCase()}","${new Date(v.createdAt).toLocaleDateString()}"
`;
    });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="votes_poll_${poll.id}.csv"`);
    res.status(200).send(csvContent);
  } catch {
    res.status(500).send("Error generating export");
  }
});
router.post("/auth/login", (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: "Phone number and password are required" });
  }
  try {
    const db = readDb();
    const cleanPhone = phone.trim().replace(/\s+/g, "");
    const altPhone = cleanPhone.startsWith("0") ? "+94" + cleanPhone.slice(1) : cleanPhone.startsWith("+94") ? "0" + cleanPhone.slice(3) : cleanPhone;
    const user = db.users.find((u) => u.phone === cleanPhone || u.phone === altPhone);
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BA4\u0BCA\u0BB2\u0BC8\u0BAA\u0BC7\u0B9A\u0BBF \u0B8E\u0BA3\u0BCD \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0B95\u0B9F\u0BB5\u0BC1\u0B9A\u0BCD\u0B9A\u0BCA\u0BB2\u0BCD! (Invalid phone number or password!)" });
    }
    res.json({
      success: true,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch {
    res.status(500).json({ error: "Authentication failed" });
  }
});
app.use("/api/server", router);
app.use("/api", router);
app.use("/", router);
var api_default = app;

// server.ts
import path2 from "path";
import express2 from "express";
import { fileURLToPath as fileURLToPath2 } from "url";
var __dirname2 = path2.dirname(fileURLToPath2(import.meta.url));
async function start() {
  if (process.env.NODE_ENV === "production") {
    api_default.use(express2.static(path2.join(__dirname2, "dist")));
    api_default.get("*", (req, res) => {
      res.sendFile(path2.join(__dirname2, "dist", "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    api_default.use(vite.middlewares);
  }
  const port = process.env.PORT || 3e3;
  api_default.listen(port, () => {
    console.log(`Changelk Sovereign Server listening at http://localhost:${port}`);
  });
}
start();
var server_default = api_default;
export {
  server_default as default
};
