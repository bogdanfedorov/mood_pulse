# Mood Pulse

Mood Pulse is a modern application for mood tracking, emotion analysis, and mental health improvement.

## Description

Mood Pulse helps users record their mood, analyze emotional states, and receive useful tips for well-being improvement. The app features an intuitive interface, analytics, and a reminder system.

## Screenshots

### Main Screen
![Main Screen](docs/main_screen.png)

### Mood Analytics
![Mood Analytics](docs/analytics.png)

### Add Entry
![Add Entry](docs/add_entry.png)

> **Note:** Images should be placed in the `docs` folder. If they are missing, please add the appropriate screenshots.

## Installation & Usage

### Requirements

- Node.js >= 18.x
- npm >= 9.x (or yarn)
- (Optional) Docker

### Clone the repository

```bash
git clone https://github.com/your-username/mood_pulse.git
cd mood_pulse
```

### Install dependencies

```bash
npm install
# or
yarn install
```

### Configure environment variables

Create a `.env` file in the project root and add the required variables (example):

REACT_APP_API_URL=https://api.moodpulse.com
REACT_APP_GOOGLE_ANALYTICS_ID=UA-XXXXXXX-X
