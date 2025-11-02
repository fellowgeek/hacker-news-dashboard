# **Product Requirements Document:** 

# **Hacker News Live Headline Dashboard**

Version: 1.0  
Date: November 1, 2025  
Owner: Erfan Reed

## 

## **1\. Overview**

This document defines the requirements for a web-based, fullscreen digital signage application designed to display the latest headline from Hacker News. It is intended for viewing on large screens (e.g., 1080p TVs) in a 16:9 aspect ratio. The application will serve as a live, self-refreshing dashboard that always shows the most current top or newest story, providing a scannable headline, metadata, and a QR code for easy access to the article.

## **2\. Goals**

* **Primary Goal:** Create a visually appealing, "glanceable" dashboard that provides ambient, real-time information about the latest Hacker News headline.  
* **Secondary Goal:** Ensure the application is robust, automatically recovering from API or network failures without manual intervention.  
* **Target Environment:** Office lobbies, team common areas, developer spaces, or any public display where tech news is relevant.

## **3\. Functional Requirements**

### **3.1. Data Fetching**

* **Data Source:** The official Hacker News API (Firebase).  
* **Default Feed:** The application will fetch the list of story IDs from the "newest stories" endpoint (/newstories.json).  
* **Configurable Feed:** The application MUST support a URL parameter (e.g., ?feed=) to switch the data source.  
  * ?feed=new (or no parameter): Use the /newstories.json endpoint.  
  * ?feed=top: Use the /topstories.json endpoint.  
* **Data Retrieval:**  
  1. Fetch the list of story IDs from the selected feed endpoint.  
  2. Take the first ID from the list.  
  3. Fetch the full story item details for that ID (e.g., /item/8863.json).  
* **Refresh Interval:** The application must automatically fetch the latest headline (repeating steps 3.1.1 \- 3.1.3) every **60 seconds**.

### **3.2. Data Display**

The following elements must be displayed on the screen:

* **Headline (title):** The main story title.  
* **Upvotes (score):** The number of upvotes the story has received.  
* **Post Time (time):** The time the story was posted (Unix timestamp).  
* **Article Link (url):** The URL the story links to. If the url field is empty (e.g., an "Ask HN" post), use the Hacker News item URL (e.g., https://news.ycombinator.com/item?id=...).  
* **Live Clock:** A digital clock displaying the current local date and time.

### **3.3. Visual Layout & Design (16:9 Aspect Ratio)**

* **Background:** The entire screen background must be the "Hacker News orange" (\#FF6600).  
* **Font Color:** All text on the screen must be white (\#FFFFFF).  
* **Typography:** Use a clean, highly legible sans-serif font from Google Fonts (e.g., "Inter" or "Roboto").  
* **Screen Layout:**  
  * **Top Left:** The live date and time clock (e.g., "Sat, Nov 1, 2025, 06:56:00 AM"). This should be in a medium, clear font.  
  * **Center Area (Main):**  
    * **Headline:** This is the primary element. It should be in a very large font, filling the majority of the central screen area.  
    * The font size must be dynamic to prevent overflow. It should scale down if the headline is too long to fit on one or two lines, but it should be as large as possible by default.  
    * Text should be center-aligned.  
  * **Center Area (Sub-headline):**  
    * Displayed directly below the headline in a smaller, medium font.  
    * This line must contain the upvote count and the relative post time.  
    * Format: \[Upvotes\] upvotes • \[Relative Time\] (e.g., "127 upvotes • 37 minutes ago").  
  * **Bottom Right:**  
    * **QR Code:** A QR code that encodes the article URL (url).  
    * The QR code must be scannable from a distance and have a white background (or sufficient padding) to ensure contrast against the orange background.

### **3.4. Dynamic Content**

* **Relative Time:** The post time ("37 minutes ago") must not be static. It must be recalculated and updated every second (or at a high frequency) to remain accurate.  
* **Live Clock:** The clock in the top-left corner must update every second.

## **4\. Non-Functional Requirements**

### **4.1. Robustness & Error Handling**

* **API Errors:** If the Hacker News API fails to respond, sends an error, or rate-limits the application, the UI should not crash. It should ideally display the last successfully fetched headline with a subtle visual indicator of the error (e.g., a small "Connecting..." message).  
* **Network Disconnection:** The application must detect network loss. When the network is disconnected, it should periodically attempt to reconnect.  
* **Recovery:** Upon successful API response or network reconnection, the application must automatically resume its normal 60-second refresh cycle without requiring a page reload.

### **4.2. Performance**

* The application must be lightweight and run efficiently in a browser for extended periods (days/weeks) without memory leaks or performance degradation.  
* The initial load time should be minimal.

### **4.3. Technology Stack**

* The application must be built using standard web technologies: **HTML, CSS, and vanilla JavaScript.**  
* Major frameworks (e.g., React, Angular, Vue) or legacy libraries (e.g., jQuery) should not be used, to ensure minimal footprint and high performance.  
* A small, lightweight, third-party library is permitted **only** for the following two functions:  
  1. Generating the QR code.  
  2. Formatting the relative time (e.g., day.js, date-fns).

## **5\. Assumptions**

* The application will be run in a modern, evergreen browser (e.g., Chrome, Firefox, Safari) with JavaScript enabled.  
* The display device has a stable internet connection.

## **6\. Out of Scope (Future Considerations)**

* User authentication or posting capabilities.  
* Displaying comments.  
* Caching data in localStorage.  
* Sound notifications.  
* Support for aspect ratios other than 16:9.