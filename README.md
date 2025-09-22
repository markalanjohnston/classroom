# Mark Johnston's Classroom

An interactive educational platform for engineering students, featuring gamified learning tools and resources.

## 🎓 Overview

This educational website provides interactive learning experiences for engineering students at El Paso ISD. The platform focuses on making technical concepts engaging through gamification and collaborative activities.

### Courses Offered

- **Principles of Applied Engineering (PAE)** - Comprehensive engineering fundamentals with 17 chapters of interactive content, vocabulary games, study guides, and weekly agendas
- **Engineering Design Process (EDP)** - Project-based robotics curriculum focusing on design thinking, problem-solving, and team collaboration
- **W.I.N. Robotics** - Programming challenges, VEX VR simulations, binary/ASCII activities, and Python in Minecraft

## 🎮 Features

### Interactive Learning Tools

#### Vocabulary Games (PAE)
- **Jeopardy-style gameplay** with team-based competition (2-6 teams)
- **Dynamic board sizing** that adapts to available content (3-5 rows)
- **Smart question distribution** with MIX categories for incomplete datasets
- **30-second timed challenges** with steal mechanics for incorrect answers
- **Random All Chapters mode** for comprehensive review
- **Certificate generation** for completed games with PDF download
- **Responsive design** optimized for projectors, tablets, and mobile devices

#### Programming Challenges (W.I.N.)
- **VEX VR simulations** with block-based programming
- **Binary/ASCII decoder** with interactive visualizations
- **Python in Minecraft** coding activities
- **Progressive difficulty** from basic movement to complex algorithms
- **Real-world applications** connecting code to robotics

#### Weekly Planning Tools
- **Interactive weekly agendas** for all three courses
- **Collapsible week sections** for easy navigation
- **Color-coded activities** by topic type
- **Learning objectives** and essential questions for each day
- **Assessment tracking** with grade categories

### Technical Features
- **Jekyll-powered** static site with GitHub Pages compatibility
- **JSON-based content management** for easy updates
- **Bootstrap 5** responsive framework with custom styling
- **Local storage** for game state persistence
- **Print-friendly** certificates with signature support
- **Accessibility-focused** design with keyboard navigation
- **Collapsible interfaces** for organized content navigation
- **Interactive visualizations** for binary/ASCII learning
- **Embedded iframe support** for modular weekly agendas
- **Multi-language support** (English/Spanish) for parent resources

## 📁 Project Structure

```
classroom/
├── _config.yml                    # Jekyll configuration
├── _includes/
│   ├── navigation.html           # Reusable navigation component
│   ├── pae-weekly-agenda.html    # PAE weekly planning content
│   ├── edp-weekly-agenda.html    # EDP weekly planning content
│   └── win-weekly-agenda.html    # WIN weekly planning content
├── index.html                    # Main landing page
├── about.html                    # Instructor information
├── css/
│   └── styles.css               # Global styles (scaled for optimal viewing)
├── images/
│   ├── johnston.png             # Instructor profile photo
│   ├── johnston-small.png       # Navigation bar photo
│   └── signature.png            # Digital signature for certificates
├── media/
│   ├── correct.mp3              # Sound effects for games
│   ├── incorrect.mp3
│   └── ding-ding.mp3
├── parents/
│   ├── index.html               # Parent information (English)
│   └── index-es.html            # Parent information (Spanish)
├── pae/                         # Principles of Applied Engineering
│   ├── index.html              # PAE course hub
│   ├── syllabus.html           # Course syllabus
│   ├── weekly-agenda.html      # Weekly planning interface
│   ├── study/                  # Study guides
│   │   ├── index.html          # Study guide hub
│   │   ├── ch4-study-guide.html
│   │   └── ch5-study-guide.html
│   └── vocab/                  # Vocabulary game system
│       ├── index.html          # Chapter selection menu
│       ├── game.html           # Main game engine
│       ├── certificate.html    # Certificate generator
│       └── ch[1-17]vocab.json  # Chapter vocabulary data
├── edp/                        # Engineering Design Process
│   ├── index.html              # EDP course hub
│   ├── syllabus.html           # Course syllabus
│   ├── edp_scope.md            # Course scope and sequence
│   └── weekly-agenda-iframe.html
└── win/                        # W.I.N. Robotics
    ├── index.html              # Robotics course hub
    ├── robotics.html           # Robotics overview
    ├── weekly-agenda.html      # Weekly planning interface
    ├── binary-quiz.html        # Binary number quiz
    ├── binary-visualizer.html  # Binary visualization tool
    └── programming-challenges/  # VEX VR programming activities
        ├── index.html          # Challenge hub
        ├── blocks/             # Block-based challenges
        │   ├── index.html
        │   ├── getting-started.html
        │   ├── basic-movement.html
        │   ├── sensors-detection.html
        │   ├── loops-patterns.html
        │   ├── decision-making.html
        │   ├── rover-rescue.html
        │   └── challenge-projects.html
        └── python/             # Python programming challenges
            └── index.html
```

## 🚀 Getting Started

### For Students
1. Visit [classroom.mjstem.com](https://classroom.mjstem.com)
2. Select your course (PAE, EDP, or W.I.N. Robotics)
3. Choose an activity:
   - **PAE**: Vocabulary games, study guides, or weekly agenda
   - **EDP**: Weekly agenda and project planning
   - **W.I.N.**: Programming challenges, binary tools, or weekly agenda
4. Follow on-screen instructions

### For Educators (Setup)
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Update `_config.yml` with your domain (if using custom domain)
4. Customize vocabulary content in JSON files
5. Replace instructor images in `/images/`

## 📝 Content Management

### Vocabulary JSON Structure
Each chapter's vocabulary is stored in `pae/vocab/ch[N]vocab.json`:

```json
{
  "chapter": 1,
  "title": "What Is Engineering?",
  "categories": ["Category 1", "Category 2", "Category 3", "Category 4"],
  "questions": [
    {
      "index": 0,
      "points": 100,
      "category": "Category 1",
      "definition": "Question or definition text",
      "choices": ["Option A", "Option B", "Option C", "Option D"],
      "correct": "Option B"
    }
  ]
}
```

### Dynamic Board Configuration
The game automatically adjusts based on available questions:
- **Minimum 3 questions per category** for standard display
- Categories with <3 questions become **MIX** category
- Board sizes from **3×4 to 5×4** (rows × categories)
- Supports **12-20 questions** per game

## 🎯 Educational Goals

This platform is designed to:
- **Reinforce vocabulary** through spaced repetition and gamification (PAE)
- **Develop computational thinking** through programming challenges (W.I.N.)
- **Foster design thinking** through project-based robotics (EDP)
- **Encourage collaboration** with team-based activities and documentation
- **Provide immediate feedback** for formative assessment
- **Support diverse learners** with visual, auditory, and kinesthetic elements
- **Track progress** through certificates, scoring, and weekly planning
- **Prepare students** for technical communication and engineering concepts
- **Connect theory to practice** through hands-on robotics and programming
- **Build digital literacy** through modern web-based learning tools

## 💻 Technical Requirements

### Browser Support
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Optimal Display
- **Classroom projectors**: 1024×768 or higher
- **Student devices**: Responsive from 320px width
- **Print certificates**: Letter size (8.5×11")

## 🛠️ Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/classroom.git

# Install Jekyll (optional, for local testing)
gem install bundler jekyll

# Run locally
jekyll serve

# Visit http://localhost:4000
```

### Adding New Content

#### Vocabulary Games (PAE)
1. Create new JSON file: `ch18vocab.json`
2. Follow existing structure with 4 categories
3. Include 5 questions per category (20 total) for optimal gameplay
4. Test locally before pushing

#### Weekly Agendas
1. Edit appropriate file in `_includes/`:
   - `pae-weekly-agenda.html` for PAE
   - `edp-weekly-agenda.html` for EDP
   - `win-weekly-agenda.html` for W.I.N.
2. Add new week section with proper Bootstrap collapse structure
3. Use appropriate topic badges and activity formatting
4. Update "Current Week" badge as needed

#### Programming Challenges (W.I.N.)
1. Create new HTML file in appropriate subdirectory
2. Follow existing template structure
3. Include clear objectives and step-by-step instructions
4. Test with target platform (VEX VR, Minecraft, etc.)

## 📄 License

© 2025 Mark Johnston. All rights reserved.

This educational software is proprietary and designed for classroom use.

### Permitted Uses ✅
- Educational instruction in formal classroom settings
- Student access for learning and practice
- Modification for curriculum adaptation
- Personal study and reference

### Prohibited Uses ❌
- Commercial distribution or resale
- Redistribution without explicit permission
- Scraping or automated data extraction
- Use in competing educational platforms

For permissions or questions, contact Mark Johnston at El Paso ISD.

## 🙏 Acknowledgments

- Built with [Bootstrap 5](https://getbootstrap.com)
- Icons by [Bootstrap Icons](https://icons.getbootstrap.com)
- Hosted on [GitHub Pages](https://pages.github.com)
- PDF generation with [jsPDF](https://github.com/parallax/jsPDF)

## 📊 Version History

- **v3.0** (Current) - Multi-course platform with EDP and expanded W.I.N. features, weekly planning tools, binary visualizations, parent resources
- **v2.0** - Dynamic board sizing, certificate generation, mobile optimization
- **v1.0** - Initial release with basic vocabulary games

---

*Empowering engineering education through interactive technology* 🚀