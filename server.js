// ===== server.js =====
// Serveur proxy local pour la Steam API (protège la clé API)

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.STEAM_API_KEY;

app.use(cors());

// --- Route 1 : Profils Steam (login.html)
app.get("/api/players", async (req, res) => {
  try {
    const ids = req.query.steamids;
    if (!ids) return res.status(400).json({ error: "Paramètre 'steamids' manquant" });

    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${ids}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Erreur /api/players :", err);
    res.status(500).json({ error: "Erreur serveur interne" });
  }
});

// --- Route 2 : Jeux possédés (index.html)
app.get("/api/ownedgames", async (req, res) => {
  try {
    const id = req.query.steamid;
    if (!id) return res.status(400).json({ error: "Paramètre 'steamid' manquant" });

    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${id}&include_appinfo=true&include_played_free_games=true&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Erreur /api/ownedgames :", err);
    res.status(500).json({ error: "Erreur serveur interne" });
  }
});

// --- Route 3 : Succès Steam (succes.html)
app.get("/api/achievements", async (req, res) => {
  try {
    const id = req.query.steamid;
    const appid = req.query.appid;
    if (!id || !appid)
      return res.status(400).json({ error: "Paramètres 'steamid' et 'appid' requis" });

    const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${API_KEY}&steamid=${id}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Erreur /api/achievements :", err);
    res.status(500).json({ error: "Erreur serveur interne" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur Steam Proxy lancé sur http://localhost:${PORT}`);
});
