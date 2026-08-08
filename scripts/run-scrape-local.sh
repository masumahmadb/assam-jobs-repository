#!/data/data/com.termux/files/usr/bin/bash
set -e

REPO_DIR="$HOME/assam-jobs-repository"
LOG_DIR="$HOME/assam-jobs-logs"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/scrape-$(date +%Y-%m-%d_%H-%M-%S).log"

if [ -f "$HOME/.assam-jobs-env" ]; then
  source "$HOME/.assam-jobs-env"
else
  echo "ERROR: $HOME/.assam-jobs-env not found." >> "$LOG_FILE"
  exit 1
fi

cd "$REPO_DIR"
termux-wake-lock

echo "=== Scrape started: $(date) ===" >> "$LOG_FILE"
npm run scrape >> "$LOG_FILE" 2>&1
echo "=== Scrape finished: $(date) ===" >> "$LOG_FILE"

termux-wake-unlock
