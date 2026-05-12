# 3-Hour Self-Paced Practicum Lesson

## Transitioning from CMU Academy to Professional Local Development

### Lesson Focus

Students will move one of their CMU Graphics programs from the browser into a professional local development environment using:

- VS Code
- Python
- CMU Graphics
- Git
- Local repositories

Students will also begin learning professional development workflow concepts such as:

- version control
- commits
- local repositories
- iterative development
- documentation

---

## Lesson Structure (180 Minutes)

### BLOCK 1 — Mission Briefing + Environment Validation

**0–25 Minutes**

#### Student Tasks

Students should:

1. Open VS Code
2. Verify Python installation
3. Open terminal in VS Code
4. Run:
   ```bash
   python --version
   ```
5. Create a folder named:
   ```
   cmu-local-project
   ```
6. Create a simple test file:
   ```python
   print("Python works!")
   ```
7. Run the file locally

#### Deliverable Checkpoint

Students take:

- screenshot of terminal
- screenshot of successful execution

#### Teacher Role

- Verify environment setup
- Help troubleshoot PATH issues
- Ensure everyone can execute Python locally

---

### BLOCK 2 — Installing and Testing CMU Graphics

**25–60 Minutes**

#### Student Tasks

Students attempt:

```bash
pip install cmu-graphics
```

Then create:

```python
from cmu_graphics import *

app.background = 'black'

Circle(200, 200, 50, fill='lime')

cmu_graphics.run()
```

Students must:

- troubleshoot issues
- document errors
- compare behavior to CMU Academy

#### Reflection Prompt

Students answer:

> What advantages or disadvantages do you notice when running CMU Graphics locally instead of inside the browser?

*(Short paragraph)*

---

### BLOCK 3 — Importing a Real CMU Program

**60–100 Minutes**

#### Student Tasks

Students:

- choose one of their previous CMU programs
- copy it into VS Code
- clean up formatting
- add comments
- improve readability

Encourage:

- indentation
- multi-line formatting
- section comments

#### Required Improvements

Students must:

- add at least 3 comments
- improve formatting
- rename unclear variables if necessary

---

### BLOCK 4 — Introduction to Git

**100–130 Minutes**

#### Mini-Lesson Topics

Students read/watch provided materials explaining:

- What Git is
- Why version control matters
- Difference between Git and GitHub/Gitea
- Commits as "snapshots"
- Why developers use repositories

#### Student Git Tasks

Inside project folder:

```bash
git init
```

Then:

```bash
git status
```

Then:

```bash
git add .
```

Then:

```bash
git commit -m "Initial local CMU project"
```

Students then:

```bash
git log
```

#### Required Screenshot

Students capture:

- terminal showing commit
- `git log` output

---

### BLOCK 5 — Iteration & Versioning

**130–160 Minutes**

#### Student Tasks

Students modify their project:

- colors
- animation
- movement
- interaction
- layout

Then create:

```bash
git add .
git commit -m "Improved visuals and formatting"
```

#### Reflection Questions

Students respond:

1. Why might version control be important in professional software development?
2. What problems could happen if developers worked without version control?
3. How could Git help teams collaborate more effectively?

*(Complete sentences required)*

---

### BLOCK 6 — Final Deliverable Submission

**160–180 Minutes**

Students submit a PDF containing:

#### Required Sections

**1. Environment Validation**

- screenshots proving Python works

**2. CMU Graphics Local Test**

- screenshot of local CMU program
- notes about issues or differences

**3. Git Repository Evidence**

Screenshot of:

- `git status`
- commit
- `git log`

**4. Critical Reflection**

Students write:

- what they learned
- why local development differs from browser development
- why version control matters
- whether they think Git is useful

Minimum:

- 2 well-developed paragraphs

---

## Finished Early?

Students may:

- experiment with additional CMU features
- add keyboard/mouse interaction
- create additional commits
- intentionally break code and restore it
- test Git rollback behavior
- help troubleshoot classmates' systems
- attempt connection to classroom Gitea server (if configured)

---

## Suggested Grading Breakdown

| Category | Points |
| --- | --- |
| Environment setup completed | 20 |
| CMU Graphics runs locally | 20 |
| Git initialized and commits created | 20 |
| Screenshots/documentation | 20 |
| Reflection quality | 20 |

---

## Why This Is Strong Practicum Work

This lesson naturally aligns with:

- deployment
- troubleshooting
- environment configuration
- version control
- documentation
- iterative development
- professional workflow

It also begins transitioning students from:

> "students using a coding website"

to:

> "developers managing a software project locally."
