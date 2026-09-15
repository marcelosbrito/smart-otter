## Context

Smart Otter uses Ollama as a fallback AI provider when Groq Cloud is unavailable or for local development. During development, Ollama runs on the developer's machine at `http://localhost:11434`. The deployed Vercel application cannot reach localhost directly — it needs a public HTTPS endpoint to proxy requests to the local Ollama instance.

The current README documents Cloudflare Tunnel setup using `scripts/setup-tunnel.sh`, but the actual development workflow uses a Windows BAT helper (`start-ollama-quick-tunnel.bat`) that runs a Quick Tunnel with the required `--http-host-header` flag, extracts the generated URL, copies it to the clipboard, and keeps running. This workflow is undocumented.

## Goals / Non-Goals

**Goals:**
- Document the actual Quick Tunnel development workflow used for Vercel deployments
- Clarify that Quick Tunnels are temporary (URL changes per session) and intended for development/testing only
- Provide clear step-by-step instructions for developers to expose their local Ollama to Vercel
- Document the `start-ollama-quick-tunnel.bat` helper script behavior

**Non-Goals:**
- No application code changes
- No new infrastructure or services
- No production Cloudflare Tunnel setup (that would be a separate configuration)
- No custom domain or named tunnel documentation

## Decisions

### Decision: Document Quick Tunnel workflow over Named Tunnel

**Choice**: Use `cloudflared tunnel --url http://localhost:11434` (Quick Tunnel / ephemeral) instead of documenting Named Tunnels with custom domains.

**Rationale**:
- The current portfolio project does not use a custom domain for Ollama access
- Quick Tunnels require zero Cloudflare account setup beyond installing `cloudflared`
- No permanent DNS records or tunnel configuration needed
- The temporary URL is sufficient for development and testing purposes
- A Named Tunnel with controlled domain would be a separate, future configuration

### Decision: Document the BAT helper script as primary workflow

**Choice**: Feature `start-ollama-quick-tunnel.bat` as the documented entry point instead of the shell script.

**Rationale**:
- The BAT file is already in the repository at the project root
- It handles URL extraction and clipboard copying automatically (Windows-native)
- It includes the required `--http-host-header="localhost:11434"` flag for Ollama compatibility
- The shell script (`scripts/setup-tunnel.sh`) does not include this flag

### Decision: Architecture diagram in README

**Choice**: Include a simple ASCII architecture diagram showing the Quick Tunnel flow.

```
Vercel Deployment
    ↓
Cloudflare Quick Tunnel (https://<random>.trycloudflare.com)
    ↓
cloudflared --url http://localhost:11434
    ↓
http://localhost:11434
    ↓
Ollama (local model)
```

**Rationale**: Makes the indirection clear for developers unfamiliar with Cloudflare Tunnels.

## Risks / Trade-offs

- **[Risk]**: Quick Tunnel URL changes on each restart — developers may forget to update Vercel env vars → **Mitigation**: Document clearly that URL must be updated in Vercel after each tunnel restart, and note that a redeployment is required for the new env var to take effect.
- **[Risk]**: Developers running non-Windows systems cannot use the BAT helper → **Mitigation**: Also document the equivalent `cloudflared` command directly for cross-platform users.
- **[Risk]**: Quick Tunnels are intended for development, not production → **Mitigation**: Clearly label this as a "development workflow" and note that a Named Tunnel with controlled domain would be needed for production use.

## Migration Plan

This is a documentation-only change. No migration steps or rollback strategy needed. The existing application code, environment variables, and deployment pipeline remain unchanged.

## Open Questions

None. This change documents the current development workflow without introducing new decisions.
