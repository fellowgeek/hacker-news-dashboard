
# Hacker News Dashboard

A fullscreen digital signage dashboard for displaying live Hacker News headlines, built with vanilla JS, HTML, and CSS. Designed for offices, hackathons, or personal use to keep up with the latest or top stories on Hacker News.

## Demo

[Live Demo](https://fellowgeek.github.io/hacker-news-dashboard/)

---

## Features

- **Live Headline:** Displays the latest or top Hacker News story in large, readable text.
- **Upvotes & Relative Time:** Shows upvote count and how long ago the story was posted (e.g., "37 minutes ago").
- **QR Code:** Scan to open the story on your device instantly.
- **Live Clock:** Local time displayed in the top-left corner.
- **Automatic Refresh:** Headlines update every 60 seconds.
- **Responsive Design:** Looks great on TVs, monitors, and projectors.

---

## Getting Started

### 1. Clone or Download

```sh
git clone https://github.com/fellowgeek/hacker-news-dashboard.git
cd hacker-news-dashboard
```

Or [download the ZIP](https://github.com/fellowgeek/hacker-news-dashboard/archive/refs/heads/main.zip) and extract.

### 2. Open in Browser

Simply open `index.html` in your web browser. No build step or server required.

---

## Usage

### Default Behavior

- By default, the dashboard shows the **latest Hacker News story** ("new" feed).

### Show Top Stories

- To display the top story instead, add `?feed=top` to the URL:
	- Example: `index.html?feed=top`

### Digital Signage / TV Mode

- For best results, use in fullscreen mode (F11 or browser's fullscreen button).
- Works on most modern browsers and devices.

---

## Customization

- **Headline Font:** Uses [Momo Trust Display](https://fonts.google.com/specimen/Momo+Trust+Display) for headlines and [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) for clock.
- **Colors & Layout:** Edit `styles.css` to change colors, spacing, or font sizes.
- **Refresh Interval:** Change the refresh rate in `main.js` (default: 60 seconds).
- **Feed Type:** Set the `FEED_TYPE` variable in `main.js` to `'top'` or `'new'` for a fixed feed.

---

## How It Works

1. Fetches story IDs from the Hacker News API (`https://hacker-news.firebaseio.com/v0/newstories.json` or `topstories.json`).
2. Loads details for the first story (latest/top).
3. Renders headline, upvotes, relative time, and QR code.
4. Updates every minute; relative time and clock update every second.

---

## Dependencies

- [QRCode.js](https://github.com/davidshimjs/qrcodejs) for QR code generation (loaded via CDN).
- [day.js](https://day.js.org/) for date formatting (loaded via CDN).

No build tools or package managers required.

---

## Troubleshooting

- **Headline says "Connecting..."**: Likely a network issue or API rate limit. Check your internet connection.
- **QR code not showing?**: Make sure QRCode.js is loaded (see browser console for errors).
- **Font not loading?**: Check Google Fonts CDN access.

---

## License

MIT
