# Proposal: Update Ollama Quick Tunnel Documentation

## Why

The Smart Otter README documents an outdated Cloudflare Tunnel setup using `scripts/setup-tunnel.sh` without the required `--http-host-header` flag, and references a generic tunnel workflow that no longer reflects the actual development setup. The project now uses a Windows BAT helper (`start-ollama-quick-tunnel.bat`) that starts a Quick Tunnel, extracts the generated URL, copies it to the clipboard, and runs continuously — but this is undocumented. The README also lacks clear Vercel deployment instructions for updating `OLLAMA_BASE_URL` when tunnel URLs change.

## What Changes

- **Updated**: Cloudflare Tunnel section in README.md — replace generic setup with Quick Tunnel workflow documentation
- **Added**: Step-by-step Quick Tunnel development workflow (start Ollama → start tunnel → copy URL → configure Vercel → redeploy)
- **Added**: Documentation of `start-ollama-quick-tunnel.bat` helper script and its behavior (starts tunnel, extracts URL, copies to clipboard, keeps running)
- **Added**: Architecture diagram showing the Quick Tunnel flow: Vercel → Cloudflare Quick Tunnel → cloudflared → localhost:11434 → Ollama
- **Updated**: `OLLAMA_BASE_URL` documentation — clarify it accepts either `http://localhost:11434` (local dev) or a `trycloudflare.com` URL (Vercel deployment)
- **Removed**: Reference to `scripts/setup-tunnel.sh` as the primary tunnel setup method (it exists but is not the documented workflow)
- **Added**: Note about `--http-host-header="localhost:11434"` being required for Ollama compatibility
- **Updated**: Tech Stack table — clarify "Ollama local/GPU (fallback via Cloudflare Quick Tunnel)" instead of generic "Cloudflare Tunnel"

## Capabilities

### New Capabilities

None. This change is documentation-only and does not modify application behavior or introduce new capabilities.

### Modified Capabilities

- **search-and-discover**: No spec-level behavior changes. Only README/developer documentation is updated to reflect the actual Ollama tunnel workflow used in production deployments.

## Impact

- **Affected files**: `README.md` (primary), `AGENTS.md` (secondary — Ollama env var section)
- **No code changes**: This is a documentation-only update
- **No dependency changes**: No new packages or configuration files added
- **No breaking changes**
