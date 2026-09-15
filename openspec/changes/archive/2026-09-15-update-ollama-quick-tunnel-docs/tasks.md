## 1. Update README.md — Cloudflare Tunnel section

- [x] 1.1 Replace the existing "Cloudflare Tunnel Setup" section (lines 98–106) with Quick Tunnel workflow documentation
- [x] 1.2 Add architecture diagram showing Vercel → Cloudflare Quick Tunnel → cloudflared → localhost:11434 → Ollama flow
- [x] 1.3 Document the exact `cloudflared tunnel --url http://localhost:11434 --http-host-header="localhost:11434"` command and explain why `--http-host-header` is required
- [x] 1.4 Document `start-ollama-quick-tunnel.bat` helper script behavior (starts tunnel, extracts URL, copies to clipboard, keeps running)
- [x] 1.5 Add step-by-step workflow: start Ollama → start tunnel → copy URL → configure Vercel → redeploy → keep terminal open

## 2. Update README.md — Tech Stack and environment variables

- [x] 2.1 Update AI Providers row in Tech Stack table to say "Ollama local/GPU (fallback via Cloudflare Quick Tunnel)"
- [x] 2.2 Clarify `OLLAMA_BASE_URL` comment: accepts either `http://localhost:11434` or a `trycloudflare.com` URL

## 3. Update README.md — Cleanup outdated references

- [x] 3.1 Remove reference to `scripts/setup-tunnel.sh` as the primary tunnel setup method
- [x] 3.2 Ensure no references to custom Cloudflare hostnames, named tunnels, or permanent DNS records remain
- [x] 3.3 Verify no temporary `trycloudflare.com` URLs are hard-coded in documentation

## 4. Update AGENTS.md — Environment variables section

- [x] 4.1 Clarify that `OLLAMA_BASE_URL` defaults to `http://localhost:11434` for local dev and accepts a Quick Tunnel URL for Vercel deployments
- [x] 4.2 Remove or update any references to generic "Cloudflare Tunnel" setup in favor of Quick Tunnel workflow

## 5. Final verification

- [x] 5.1 Search the repository for any remaining outdated Cloudflare Tunnel instructions (named tunnels, custom domains, `cert.pem`, Windows service)
- [x] 5.2 Verify all documented Ollama commands include `--http-host-header="localhost:11434"`
- [x] 5.3 Verify Vercel environment variable workflow is clearly documented (`OLLAMA_BASE_URL` → update in Vercel dashboard → redeploy)
- [x] 5.4 Confirm no source code or dependencies were modified
