# Lesson 4 Plan — Filling Spaces and Spawning Mobs

> Reference current lessons: [lesson1/index.html](lesson1/index.html), [lesson2/index.html](lesson2/index.html), [lesson3/index.html](lesson3/index.html).

## Why this fits after Lesson 3

Lesson 3 ended on a deliberate idea: *"choosing a smarter tool lets your code do the same job in far fewer lines."* The progression so far is:

1. **Agent** — visible, step-by-step, easy to debug.
2. **Agent + loops** — visible repetition and patterns.
3. **Builder + `trace_path` / `mark` + `line`** — invisible but fast, great for big structures.
4. **`blocks.fill()` + `mobs.spawn()`** — direct region-based world editing and population.

Lesson 4 extends — not contradicts — Lesson 3. The point is: *sometimes even the Builder is more work than necessary.*

## Lesson header

- **Title:** Filling Spaces and Spawning Mobs
- **Subtitle:** Use `blocks.fill()` to create rooms, arenas, ponds, and habitats, then use `mobs.spawn()` to bring them to life.
- **Essential Question:** How can a program use coordinates to create and populate a whole space at once?

## Learning goals — "By the end of this lesson, I will..."

- Explain when `blocks.fill()` is a better tool than the Agent or Builder.
- Use two positions as **opposite corners** of a 3D rectangular region.
- Use `FillOperation.REPLACE`, `HOLLOW`, and `OUTLINE` intentionally.
- Use `mobs.spawn()` to place mobs at a specific or random position.
- Combine `blocks.fill()`, a `for` loop, and `mobs.spawn()` to create an interactive scene.

## What students bring in (recap card)

| From | Carries forward |
| --- | --- |
| Lesson 1 | Sequences run in order. Events (`player.on_chat`) start your code. |
| Lesson 2 | `for` loops repeat instructions; indentation decides what's inside the loop. |
| Lesson 3 | `pos(x, y, z)` is measured from the player. Builder commands. "Fewer-lines-is-better" thinking. |

> **Important syntax note** — in MakeCode's Python API, `pos(x, y, z)` is *already* relative to the player. The `~` symbol belongs in chat commands (`/tp ~ ~ ~10`), **not** inside `pos()`. Call this out explicitly the first time `pos(0, 0, 0)` appears.

## Lesson flow

### Step 1 — Warm-up: "Which tool would you choose?"

Show four short build tasks, students pick the best tool. The point is to reinforce the *sequence* of lessons rather than make Lesson 4 feel like a correction.

| Task | Best tool | Why |
| --- | --- | --- |
| Watch a character walk through a maze | Agent | Visible movement, easy to debug |
| Draw a long straight wall | Builder | `mark()` + `line()` is efficient |
| Make a 20×20×10 glass box | `blocks.fill()` | One command fills a whole region |
| Add 10 animals inside the box | `mobs.spawn()` + loop | Repeats mob creation |

### Step 2 — Bridge from Lesson 3

In Lesson 3, students built a wall with a loop + `mark()` + `line()`. Show the same wall as a single `blocks.fill()`:

```python
def on_chat():
    blocks.fill(STONE,
                pos(0, 0, 0),
                pos(10, 5, 0),
                FillOperation.REPLACE)
player.on_chat("wall", on_chat)
```

Ask: *"What part of this is like Lesson 3?"* — Still coordinates and dimensions, but no Builder movement at all.

### Step 3 — Opposite corners (the key new idea)

`blocks.fill()` does not *move* like the Agent or Builder. It needs **two opposite corners** of a rectangular prism.

```python
blocks.fill(GLASS, pos(0, 0, 0), pos(10, 5, 10), FillOperation.REPLACE)
```

That fills a solid glass brick. Then immediately show:

```python
blocks.fill(GLASS, pos(0, 0, 0), pos(10, 5, 10), FillOperation.HOLLOW)
```

A hollow room instead of a solid cube. Introduce the operations:

| Fill operation | Student-friendly explanation |
| --- | --- |
| `REPLACE` | Fills every block in the region |
| `HOLLOW` | Builds the outer shell and clears the inside |
| `OUTLINE` | Builds only the outer edge/shell, leaves the inside alone |
| `KEEP` | Fills only empty air blocks (won't overwrite existing) |
| `DESTROY` | Replaces blocks and drops the old ones as if mined |

> **Step-back tip (carry over from Lesson 3):** Before running, press `T` and type `/tp ~ ~ ~10` so the build appears in front of you, not under your feet.

### Step 4 — Starter build: a habitat

```python
def on_chat():
    # Hollow glass shell
    blocks.fill(GLASS_PANE,
                pos(5, 0, -10),
                pos(12, 7, 10),
                FillOperation.HOLLOW)

    # Grass floor inside
    blocks.fill(GRASS,
                pos(6, 0, -9),
                pos(11, 0, 9),
                FillOperation.REPLACE)
player.on_chat("habitat", on_chat)
```

Predict-questions to ask before running:

- Which numbers control **width**? (X-axis difference)
- Which numbers control **height**? (Y-axis difference)
- Which numbers control **depth**? (Z-axis difference)
- Why is the second fill **smaller** than the first?

> Start with a **land habitat** (not water) so it works for more mobs. Save the aquarium for the challenge.

### Step 5 — Add `mobs.spawn()`

Place one mob first:

```python
def on_chat():
    blocks.fill(GLASS_PANE, pos(5, 0, -10), pos(12, 7, 10), FillOperation.HOLLOW)
    blocks.fill(GRASS,      pos(6, 0, -9),  pos(11, 0, 9),  FillOperation.REPLACE)

    mobs.spawn(SHEEP, pos(8, 1, 0))
player.on_chat("habitat", on_chat)
```

Then bring back the **loop from Lesson 2** to fill the habitat with mobs at random positions:

```python
def on_chat():
    blocks.fill(GLASS_PANE, pos(5, 0, -10), pos(12, 7, 10), FillOperation.HOLLOW)
    blocks.fill(GRASS,      pos(6, 0, -9),  pos(11, 0, 9),  FillOperation.REPLACE)

    for i in range(5):
        mobs.spawn(SHEEP, randpos(pos(6, 1, -9), pos(11, 1, 9)))
player.on_chat("habitat", on_chat)
```

Call out the connection: the loop is the same `for i in range(N):` pattern from Lesson 2 — it just controls how many sheep instead of how many forward steps.

### Step 6 — Builder accent (keep all three tools in the toolbox)

`blocks.fill()` is great for *regions* but the Builder still wins for a single *line*. Add a cobblestone walkway down the middle of the habitat using Lesson 3's `mark()` + `line()`:

```python
def on_chat():
    blocks.fill(GLASS_PANE, pos(5, 0, -10), pos(12, 7, 10), FillOperation.HOLLOW)
    blocks.fill(GRASS,      pos(6, 0, -9),  pos(11, 0, 9),  FillOperation.REPLACE)

    # Walkway down the middle (line — Builder is the right tool)
    builder.teleport_to(pos(8, 1, -9))
    builder.mark()
    builder.teleport_to(pos(8, 1, 9))
    builder.line(COBBLESTONE)
player.on_chat("habitat", on_chat)
```

Punchline: **fill for regions, Builder for lines, Agent for things you want to watch happen.** A real program often uses two or three together.

### Step 7 — Debugging focus

**Bug 1 — indentation (callback to Lesson 2):**

```python
def on_chat():
    blocks.fill(GLASS_PANE, pos(5, 0, -10), pos(12, 7, 10), FillOperation.HOLLOW)
    blocks.fill(GRASS,      pos(6, 0, -9),  pos(11, 0, 9),  FillOperation.REPLACE)

    for i in range(5):
    mobs.spawn(SHEEP, randpos(pos(6, 1, -9), pos(11, 1, 9)))
player.on_chat("broken", on_chat)
```

*Why broken?* `mobs.spawn(...)` is not indented inside the loop — same family of bug they saw in Lesson 2's wall.

**Bug 2 — coordinate bug:**

```python
mobs.spawn(SHEEP, randpos(pos(6, 10, -9), pos(11, 10, 9)))
```

*Why are the sheep falling from the sky?* — Y is too high. Reinforces X/Y/Z thinking from Lesson 3.

## Challenge options

### Option A — Animal habitat (Fundamentals)

Build a glass or fence habitat with a floor, walls, **at least 5 mobs**, at least one loop, and at least two block types.

### Option B — Battle arena (APCSP-friendly)

Walls or outline, a floor, mobs spawned at random positions, and at least one obstacle built with `blocks.fill()`. Good for discussing **abstraction** and **parameters**.

### Option C — Trident Aquarium

A glass cube filled with water, then tropical fish, pufferfish, and dolphins spawned at random positions — summoned by **right-clicking with a trident** instead of a chat command. Introduces `player.on_item_interacted()` as an alternate event trigger, plus `blocks.place()` for single-block detail work:

```python
def trident_summon_aquarium():
    blocks.fill(GLASS, pos(5, 0, -10), pos(12, 7, 10), FillOperation.REPLACE)
    blocks.fill(WATER, pos(6, 1, -9),  pos(11, 7, 9),  FillOperation.REPLACE)
    for i in range(4):
        mobs.spawn(TROPICAL_FISH, randpos(pos(6, 1, -9), pos(11, 6, 9)))
        blocks.place(BUBBLE_CORAL, randpos(pos(6, 1, -9), pos(11, 6, 9)))
        mobs.spawn(PUFFERFISH,    randpos(pos(6, 1, -9), pos(11, 6, 9)))
        mobs.spawn(DOLPHIN,       randpos(pos(6, 1, -9), pos(11, 6, 9)))

        # blocks.place(SEAGRASS, randpos(pos(6, 1, -9), pos(11, 1, 9)))
        # Doesn't work because seagrass can't be placed on glass.
        # Fix it later by filling a dirt layer at the bottom first.

player.on_item_interacted(TRIDENT, trident_summon_aquarium)
```

Talking points:
- The solid `GLASS` + `REPLACE` then `WATER` + `REPLACE` is an alternative to `HOLLOW` — same visual result, different mental model.
- The loop spawns three mob types per iteration → `range(4)` produces 12 mobs total.
- `blocks.place()` (one block) vs `blocks.fill()` (whole region) — pick by the size of the job.
- The commented-out seagrass line is a teaching moment: real programs include known-broken code with a comment explaining the constraint and a plan to fix it.

## Minimum requirements

- Program starts with an event (`player.on_chat` *or* `player.on_item_interacted`).
- Uses `blocks.fill()` **at least twice**.
- Uses **at least two different block types**.
- Uses `mobs.spawn()` **at least once**.
- Uses a `for` loop to spawn multiple mobs.
- Uses `randpos(...)` or carefully chosen coordinates to place mobs inside the structure.
- Final result is a habitat, arena, pond, aquarium, or other enclosed scene.
- Student can explain in their reflection which tool was best: Agent, Builder, or `blocks.fill()`.

## Reflection questions

1. What did your program build?
2. Which two positions did you use as opposite corners for your main `blocks.fill()`?
3. What fill operation did you use — `REPLACE`, `HOLLOW`, or `OUTLINE` — and why?
4. How did your loop affect the number of mobs that spawned?
5. Why would this build be harder with the Agent or Builder?

## APCSP angle

- **Abstraction** — `blocks.fill()` hides a huge amount of repeated block placement behind one command.
- **Parameters** — block type, start corner, end corner, fill operation.
- **Iteration** — the loop controls how many mobs spawn.
- **Randomness** — `randpos(...)` produces variation in output.
- **Debugging** — coordinate and indentation errors are visible and fixable in the world.

## Suggested page structure (for the eventual `lesson4/index.html`)

1. Warm-up — pick the right tool: Agent, Builder, or `blocks.fill()`.
2. Review — Lesson 3 wall, rewritten as one `blocks.fill()`. **Call out `pos()` is already relative — no `~` inside.**
3. New command — `blocks.fill()` and the opposite-corners idea.
4. Operations — `REPLACE`, `HOLLOW`, `OUTLINE` (with predict prompts).
5. Starter build — hollow glass habitat + grass floor.
6. Builder accent — `mark()` + `line()` walkway through the habitat (keeps all three tools in the toolbox).
7. Add life — `mobs.spawn()` once, then inside a loop with `randpos()`.
8. Debug — indentation bug + wrong-Y bug.
9. Challenge — Option A / B / C (including trident-summon aquarium + `player.on_item_interacted`).
9. Submit — screenshots + reflection.
