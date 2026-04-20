# How the React Native App Was Built: An AI Collaboration Log

This document walks through the actual conversation used to refactor the CMU Graphics Python project into a working React Native mobile app using [Claude.ai](https://claude.ai). It is included here as a model for teachers and students — showing that AI collaboration is not a single prompt but an **iterative, back-and-forth debugging process**.

---

## The Starting Point

The original CMU CS Academy project was pasted directly into Claude.ai with one request:

> *"Can you refactor a CMU Academy project that uses CMU Graphics in Python to a React Native project?"*

Before generating any code, Claude asked three clarifying questions:

1. **What's the target platform?** → CodeHS / Expo sandbox
2. **How should tap interaction work on mobile?** → Tap individual body parts separately
3. **What should the output be?** → A single `.jsx` component file

This is an important lesson in itself: **a good prompt leads to better output.** Claude needed context before it could produce something useful.

---

## The Iteration Log

What follows is a summary of each round of errors encountered and how they were resolved. The full conversation took roughly 30 minutes.

---

### Round 1 — Missing AppRegistry

**Error received:**
> *"Looks like you forgot to import AppRegistry on line 2!"*

**What happened:** CodeHS requires `AppRegistry.registerComponent()` to identify the root component. The initial output didn't include it.

**Fix:** Added `AppRegistry` to the imports and registered the component at the bottom of the file.

**Lesson:** Platform-specific requirements (like CodeHS's entry point convention) aren't always obvious and may need to be discovered by running the code.

---

### Round 2 — Component Name Mismatch

**Error received:**
> *"ReferenceError: App is not defined (275)"*

**What happened:** The component was named `MickeyScreen`, but CodeHS expects the root component to be called `App`.

**Fix:** Renamed `MickeyScreen` to `App` throughout the file and updated `registerComponent` to match.

**Lesson:** Naming conventions matter on specific platforms. Always check platform documentation for required identifiers.

---

### Round 3 — Hooks Not Supported

**Error received:**
> *"TypeError: (0 , _react.useState) is not a function (240)"*

**First attempt:** Switched from destructured `useState` to `React.useState`.

**Error received again:**
> *"TypeError: _react2.default.useState is not a function (240)"*

**Root cause:** CodeHS runs an older React environment that does not support hooks at all — not just a naming issue.

**Fix:** Rewrote the entire component using ES5-style class syntax with `this.state` and `this.setState` instead of hooks.

**Lesson:** AI tools generate code based on modern best practices, but the target environment may have constraints. Understanding *why* an error occurs matters more than just accepting the fix.

---

### Round 4 — SVG Library Not Available

**Error received:**
> *"Invariant Violation: Minified React error #130"*

**Root cause:** The initial version used `react-native-svg` to draw ellipses and circles. That library is not available in the CodeHS sandbox.

**Fix:** Rewrote all shapes using only core React Native `<View>` components with `borderRadius` to simulate ovals. This eliminated the external dependency entirely.

**Trade-off acknowledged:** Views with `borderRadius` approximate ovals but aren't mathematically perfect ellipses. For a classroom project, this is acceptable.

**Lesson:** When a dependency isn't available, look for what *is* available. Core platform primitives (like `View`) can often approximate the same result.

---

### Round 5 — Export Format

**Error received (on device, not in preview):**
> *"No default export of 'app.js' to render"*

**What happened:** The CodeHS browser preview worked, but loading the app on a real device failed because the file lacked a proper module export.

**Fix:** Added both `module.exports = App` and `module.exports.default = App` to cover both CommonJS and ES module import styles.

**Lesson:** Browser previews and real device environments can have different requirements. Always test in the actual deployment context.

---

### Round 6 — Layout and Responsiveness

**Observation:** The app looked good on a phone but broke in the CodeHS preview window.

**Root cause:** The code used `Dimensions.get('window')` which reads the *physical screen size* at startup — not the size of the CodeHS preview pane.

**Fix:** Switched to `onLayout`, which fires after the root `View` is actually rendered and returns the real dimensions of whatever container the app is running inside. This made the layout respond correctly to both the CodeHS preview and a real device.

**Lesson:** `Dimensions.get()` is not responsive. `onLayout` is. When building for multiple environments (preview + device + tablet), measuring the actual rendered container is more reliable.

---

## Final Polish

Once the app was functional, two more rounds of refinement happened:

1. **UI redesign** — The canvas was reframed as a bordered "picture frame" with a title above and a styled Reset button below, matching the look of the CMU canvas more closely.

2. **Verbose comments** — A version of the file with detailed inline comments was generated to explain every React Native concept used, specifically for educational use.

3. **AI attribution note** — A comment block was added to the bottom of the file explaining how it was created and what Claude Sonnet 4.6 is, written for students who may encounter it.

---

## What This Conversation Shows

| What happened | What it teaches |
|---|---|
| Claude asked clarifying questions before coding | Good prompts include context: platform, constraints, expected output |
| Six rounds of errors before the app worked | AI-generated code is a starting point, not a finished product |
| Each error required a new prompt with the exact error message | Copying and pasting error messages is a valid and effective debugging strategy |
| Some fixes required understanding *why*, not just applying the fix | Critical reading of AI output matters — accepting a fix you don't understand can create new problems |
| The final app required human design decisions | AI handles syntax; humans handle intent, aesthetics, and judgment |

---

## Using This in the Classroom

This log can be used in two ways:

**As a teacher demo:** Walk through the error log before students start their own projects. Set the expectation that errors are normal and that debugging with AI is a skill — not a shortcut.

**As a student reference:** After students get their first error in CodeHS, point them here. Show them that the same errors happened during development and that copying the error message into the AI chat is the right first move.

---

*The full refactored React Native code is in `/examples/react-native-example.jsx`.*