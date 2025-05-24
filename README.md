# Cybersecurity News Feed for Google Sheets

This project imports the latest cybersecurity news from multiple RSS feeds into a Google Sheets spreadsheet using Google Apps Script. It also provides a nice UI to display news cards and lets you view detailed news items directly from the sheet.

---

## Features

- Fetches and aggregates news from multiple cybersecurity RSS feeds.
- Imports news with title, source, and date into a Google Sheet.
- Formats titles as clickable links.
- Applies alternating row colors and header styling.
- Supports a pop-up modal showing news details when you select a row.
- Responsive card-style UI (via HTML service).
- Automatic sorting by date (newest first).
- Easily extendable with additional RSS sources.

---

## Setup

### Prerequisites

- A Google account.
- Access to [Google Apps Script](https://script.google.com).
- [Clasp](https://github.com/google/clasp) installed (optional, for local development).

### Installation

1. **Clone this repository:**

   ```bash
   git clone https://github.com/yourusername/cybersecurity-news-feed.git
   cd cybersecurity-news-feed

