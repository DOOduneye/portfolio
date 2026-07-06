// One-time helper to get a Spotify refresh token for the on-repeat footer line.
//
// 1. Create an app at https://developer.spotify.com/dashboard
//    with redirect URI exactly: http://127.0.0.1:8888/callback
// 2. Run: node scripts/spotify-auth.mjs <client_id> <client_secret>
// 3. Open the printed URL, approve, and copy the refresh token it prints.
// 4. Put all three values in .dev.vars (and `wrangler secret put` for prod):
//      SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN

import http from "node:http";

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error("Usage: node scripts/spotify-auth.mjs <client_id> <client_secret>");
  process.exit(1);
}

const redirectUri = "http://127.0.0.1:8888/callback";

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", redirectUri);
authUrl.searchParams.set("scope", "user-top-read");

console.log("\nOpen this URL in your browser and approve access:\n");
console.log(authUrl.href);
console.log("\nWaiting for the callback on http://127.0.0.1:8888 ...");

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:8888");
  if (url.pathname !== "/callback") {
    response.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    response.writeHead(400).end("No code in callback.");
    return;
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const body = await tokenResponse.json();
  if (!tokenResponse.ok) {
    response.writeHead(500).end("Token exchange failed. Check the terminal.");
    console.error("\nToken exchange failed:", body);
    process.exit(1);
  }

  response.writeHead(200, { "content-type": "text/plain" });
  response.end("Done. Your refresh token is in the terminal. You can close this tab.");

  console.log("\nYour refresh token:\n");
  console.log(body.refresh_token);
  console.log("\nAdd to .dev.vars:");
  console.log(`SPOTIFY_CLIENT_ID=${clientId}`);
  console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
  console.log(`SPOTIFY_REFRESH_TOKEN=${body.refresh_token}`);
  server.close();
  process.exit(0);
});

server.listen(8888);
