# Security Notice

**WARNING: Previously exposed API keys**

During the cleanup of this project, it was found that API keys and credential files (such as Kaggle keys, OpenAI, Anthropic, OpenRouter, and `.env` files) were included in ZIP archives and the repository history.

**Required Action:**
If you previously uploaded real API keys or credentials to this repository, **you must immediately revoke and rotate them** from their respective provider dashboards. 

Any key that has been pushed to a public repository should be considered compromised.

**Future Prevention:**
- Never commit `.env` files.
- Never hardcode API keys in the frontend or backend code.
- Ensure the `.gitignore` correctly ignores all secret files.
- Keep secret keys only in your server environment variables.
