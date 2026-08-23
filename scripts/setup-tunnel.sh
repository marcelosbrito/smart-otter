#!/usr/bin/env bash
# Smart Otter — Cloudflare Tunnel Setup Script
# Exposes local Ollama (port 11434) via a public HTTPS URL
#
# Prerequisites:
#   1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
#   2. Run this script, then copy the generated URL into OLLAMA_BASE_URL in .env.local
#
# Usage:
#   bash scripts/setup-tunnel.sh
#
# Note: Modern cloudflared (v2024+) uses named tunnels. This script creates a temporary
# tunnel and prints the public URL, then exits when you press Ctrl+C.

echo "Starting Cloudflare Tunnel to localhost:11434..."
cloudflared tunnel --url http://localhost:11434
