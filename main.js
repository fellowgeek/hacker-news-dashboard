// === Day.js Plugin Initialization ===
// Extend dayjs with the relativeTime plugin if available.
// This enables formatting timestamps like '37 minutes ago'.
if (window.dayjs_plugin_relativeTime) {
	dayjs.extend(window.dayjs_plugin_relativeTime);
}

// === Dashboard State Variables ===
// lastStory: stores the most recently fetched story for error fallback
// lastError: tracks if the last fetch resulted in an error
// relativeTimeTimer: interval for updating relative time in the sub-headline
let lastStory = null;
let lastError = false;
let relativeTimeTimer = null;

// === Utility Functions ===
// Returns the external URL for a story, or falls back to the HN item page for Ask HN posts.
function getStoryUrl(story) {
	if (story.url) return story.url;
	return `https://news.ycombinator.com/item?id=${story.id}`;
}

// === Dashboard Rendering ===
// Renders the latest story headline, metadata, and QR code to the dashboard.
// Also sets up dynamic font scaling and relative time updates.
function renderStory(story) {
	lastStory = story;
	lastError = false;
	// Headline: display main story title in center
	const headlineEl = document.getElementById('headline');
	headlineEl.textContent = story.title;
	// Dynamic font size scaling for long headlines
	headlineEl.style.fontSize = '6vw';
	setTimeout(() => {
		// If headline overflows, scale down font size to prevent clipping
		if (headlineEl.scrollHeight > headlineEl.offsetHeight * 1.2 || headlineEl.scrollWidth > headlineEl.offsetWidth * 1.1) {
			headlineEl.style.fontSize = '4vw';
		}
	}, 100);

	// Sub-headline: upvotes and relative time, updates every second
	function updateRelativeTime() {
		const subEl = document.getElementById('subheadline');
		let rel = '';
		if (window.dayjs_plugin_relativeTime) {
			rel = dayjs.unix(story.time).fromNow();
		} else {
			rel = '';
		}
		subEl.textContent = `${story.score || 0} upvotes • ${rel}`;
	}
	// Clear previous interval to avoid multiple timers
	if (relativeTimeTimer) clearInterval(relativeTimeTimer);
	updateRelativeTime();
	// Start interval to update relative time every second
	relativeTimeTimer = setInterval(updateRelativeTime, 1000);

	// QR code: generate for article URL (or fallback for Ask HN)
	const qrEl = document.getElementById('qr');
	qrEl.innerHTML = '';
	const qrUrl = getStoryUrl(story);
	new QRCode(qrEl, {
		text: qrUrl,
		width: 160,
		height: 160,
		colorDark: '#000000',
		colorLight: '#ffffff',
		correctLevel: QRCode.CorrectLevel.H
	});
}

// Renders error state: shows last headline with 'Connecting...' if available, or just a message.
function renderError() {
	lastError = true;
	const subEl = document.getElementById('subheadline');
	if (lastStory) {
		// Show last headline, but indicate error
		let rel = '';
		if (window.dayjs_plugin_relativeTime) {
			rel = dayjs.unix(lastStory.time).fromNow();
		}
		subEl.textContent = `${lastStory.score || 0} upvotes • ${rel} (Connecting...)`;
	} else {
		subEl.textContent = 'Connecting...';
	}
}

// === Dashboard Update Logic ===
// Fetches the latest story and updates the dashboard.
// If fetch fails, shows error state and last headline.
async function refreshStory() {
	const story = await fetchLatestStory();
	if (story) {
		renderStory(story);
	} else {
		renderError();
	}
}
// === Hacker News Data Fetching ===
const HN_API = 'https://hacker-news.firebaseio.com/v0'; // Base API URL

// === Setup Variable ===
// Set FEED_TYPE to 'top' for top stories, 'new' for latest stories, or null to use URL parameter
const FEED_TYPE = null; // 'top', 'new', or null

// Determines which feed to use: setup variable takes precedence, otherwise uses URL parameter
function getFeedType() {
	if (FEED_TYPE === 'top') return 'topstories';
	if (FEED_TYPE === 'new') return 'newstories';
	const params = new URLSearchParams(window.location.search);
	const feed = params.get('feed');
	if (feed === 'top') return 'topstories';
	return 'newstories';
}

// Fetches the latest story from the selected feed (newstories or topstories)
// Returns the story object or null on error
async function fetchLatestStory() {
	const feedType = getFeedType();
	try {
		// 1. Fetch list of story IDs from the selected feed
		const idsRes = await fetch(`${HN_API}/${feedType}.json`);
		if (!idsRes.ok) throw new Error('Failed to fetch story IDs');
		const ids = await idsRes.json();
		if (!Array.isArray(ids) || ids.length === 0) throw new Error('No stories found');
		const firstId = ids[0];
		// 2. Fetch story details for the first ID
		const storyRes = await fetch(`${HN_API}/item/${firstId}.json`);
		if (!storyRes.ok) throw new Error('Failed to fetch story details');
		const story = await storyRes.json();
		if (!story || !story.title) throw new Error('Invalid story data');
		return story;
	} catch (err) {
		// Log error and return null to trigger error state
		console.error('HN fetch error:', err);
		return null;
	}
}

// === Live Clock ===
// Updates every second in the top-left corner
// Displays local date and time in a readable format
function updateClock() {
	const clock = document.getElementById('clock');
	const now = new Date();
	const options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	};
	clock.textContent = now.toLocaleString(undefined, options);
}

// === Interval Setup ===
// All intervals are started after the main HTML document is loaded
document.addEventListener('DOMContentLoaded', () => {
	setInterval(updateClock, 1000); // Live clock update
	updateClock(); // Initial clock render

	refreshStory(); // Initial story fetch and render
	setInterval(refreshStory, 60000); // Story refresh every 60 seconds
	// === Subtle Sparkle/Dot Animation ===
	const canvas = document.getElementById('sparkle-bg');
	const ctx = canvas.getContext('2d');
	let width = window.innerWidth;
	let height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;

	function resizeCanvas() {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
	}
	window.addEventListener('resize', resizeCanvas);

			// Sparkle/dot/star config
			const NUM_PARTICLES = Math.round(44 * 1.2); // 20% more particles
			const particles = [];
			for (let i = 0; i < NUM_PARTICLES; i++) {
				// 70% dots, 30% stars
				const isStar = Math.random() < 0.3;
				// Increase size variation
				const r = isStar
					? (2.2 + Math.random() * 3.8) // stars: 2.2 - 6.0
					: (1.0 + Math.random() * 3.5); // dots: 1.0 - 4.5
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					r,
					opacity: isStar ? (0.18 + Math.random() * 0.22) : (0.13 + Math.random() * 0.27),
					dx: (Math.random() - 0.5) * 0.275, // 25% more movement
					dy: (Math.random() - 0.5) * 0.275, // 25% more movement
					phase: Math.random() * Math.PI * 2,
					isStar,
					twinkleSpeed: isStar ? (0.8 + Math.random() * 1.2) : 0,
					twinklePhase: Math.random() * Math.PI * 2
				});
			}

	function animateSparkles() {
		ctx.clearRect(0, 0, width, height);
			for (let p of particles) {
				// Subtle floating movement
				p.x += p.dx + Math.sin(Date.now()/1200 + p.phase) * 0.05;
				p.y += p.dy + Math.cos(Date.now()/1200 + p.phase) * 0.05;
				// Wrap around edges
				if (p.x < 0) p.x = width;
				if (p.x > width) p.x = 0;
				if (p.y < 0) p.y = height;
				if (p.y > height) p.y = 0;
				// Twinkle effect for stars
				let opacity = p.opacity;
				if (p.isStar) {
					opacity *= 0.7 + 0.3 * Math.abs(Math.sin(Date.now()/900 * p.twinkleSpeed + p.twinklePhase));
				}
				ctx.save();
				ctx.shadowColor = '#fff';
				ctx.shadowBlur = p.isStar ? 14 : 8;
				if (p.isStar) {
					// Draw a subtle star shape
					ctx.beginPath();
					const spikes = 5;
					const outerRadius = p.r;
					const innerRadius = p.r * 0.45;
					let rot = Math.PI / 2 * 3;
					let x = p.x;
					let y = p.y;
					ctx.moveTo(x, y - outerRadius);
					for (let i = 0; i < spikes; i++) {
						x = p.x + Math.cos(rot) * outerRadius;
						y = p.y + Math.sin(rot) * outerRadius;
						ctx.lineTo(x, y);
						rot += Math.PI / spikes;
						x = p.x + Math.cos(rot) * innerRadius;
						y = p.y + Math.sin(rot) * innerRadius;
						ctx.lineTo(x, y);
						rot += Math.PI / spikes;
					}
					ctx.closePath();
					ctx.fillStyle = `rgba(255,255,255,${opacity})`;
					ctx.fill();
				} else {
					// Draw a dot
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(255,255,255,${opacity})`;
					ctx.fill();
				}
				ctx.restore();
			}
			requestAnimationFrame(animateSparkles);
		}
		animateSparkles();
});
