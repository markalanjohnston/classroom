<!-- File: classroom/README.md -->
# Mark Johnston's Classroom

A static website designed for classroom instruction and interactive educational activities.

## Overview

This site provides interactive learning tools and resources for engineering education courses:

- **Principles of Applied Engineering (PAE)** - Engineering fundamentals, vocabulary games, and educational activities
- **W.I.N. Robotics** - Robotics programming, competition preparation, and team resources

## Features

### Vocabulary Games
- Interactive team-based Jeopardy-style vocabulary games
- Customizable team setup (2-6 teams)
- Chapter-specific content (Chapters 1-17)
- 30-second question timers
- Point-based scoring system with steal mechanics
- Responsive design for classroom projectors and individual devices

### Technology Stack
- Static HTML/CSS/JavaScript
- Bootstrap 5 for responsive design
- JSON-based content management
- GitHub Pages compatible

## Site Structure

```
├── index.html                    # Landing page
├── css/
│   └── styles.css               # Shared CSS styles
├── images/
│   └── johnston.png             # Instructor profile image
├── pae/                         # Principles of Applied Engineering
│   ├── index.html              # PAE class menu
│   └── vocab/                  # Vocabulary games
│       ├── index.html          # Chapter selection
│       ├── game.html           # Interactive game
│       └── ch[1-17]vocab.json  # Vocabulary data files
└── win/                        # W.I.N. Robotics
    └── index.html              # Robotics class menu
```

## Usage

1. Visit the site homepage
2. Select your class (PAE or W.I.N. Robotics)
3. Choose an activity (currently vocabulary games for PAE)
4. Select a chapter and set up teams
5. Play the interactive vocabulary game

## Deployment

This site is designed to be hosted on GitHub Pages:

1. Fork or clone this repository
2. Enable GitHub Pages in repository settings
3. Add your vocabulary content to the JSON files
4. Access your site at `https://[username].github.io/[repository-name]`

## Content Management

Vocabulary content is stored in JSON files located in `pae/vocab/`. Each file follows this structure:

```json
[
  {
    "index": 0,
    "points": "100",
    "definition": "Question or definition text",
    "choices": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "Option B"
  }
]
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Optimized for classroom projection systems

## Educational Use

This site is intended for educational purposes in Mark Johnston's engineering classroom. The interactive games and activities are designed to:

- Reinforce vocabulary learning through gamification
- Encourage team collaboration
- Provide immediate feedback on student understanding
- Support various learning styles through visual and interactive elements

## License

© 2025 Mark Johnston. All rights reserved.

This educational content and software is proprietary and intended for classroom use. 

**Permitted Uses:**
- Use in educational settings for teaching purposes
- Modification for educational content adaptation
- Personal study and reference

**Prohibited Uses:**
- Commercial distribution or sale
- Redistribution without permission
- Use outside of educational contexts without authorization

For permissions beyond educational use, please contact Mark Johnston.

---

*Built with ❤️ for engineering education*