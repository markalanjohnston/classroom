# ============================================================
# Lesson 5 - advanced patterns to try
#
# Most of the structural helpers now take PARAMETERS:
#   - cx, cz are the CENTER of the structure (in blocks from player)
#   - other params control size / height / material / etc.
# This means we can call one helper from another - see castle() at
# the very bottom, which builds a moat + walls + tower + dome all
# centered at the same (cx, cz).
#
# Each helper has a small wrapper (named _name) that triggers the
# chat command using sensible default values. The wrappers exist
# because player.on_chat calls its handler with no arguments.
# ============================================================


# ----- A: Same 4-color pattern, but with a LIST instead of nested if/else
def steps_list():
    colors = [WOOL, OBSIDIAN, STONE, REDSTONE_BLOCK]
    for i in range(32):
        for j in range(32):
            height = i + j + 1
            color = colors[(i % 2) * 2 + (j % 2)]
            blocks.fill(color,
                        pos(1 + i * 2, 0, j * 2),
                        pos(1 + i * 2, height, j * 2),
                        FillOperation.REPLACE)
    player.say("DONE :)")
player.on_chat("steps_list", steps_list)


# ----- B: Big tiles using INTEGER DIVISION //
def steps_tiles():
    for i in range(32):
        for j in range(32):
            height = i + j + 1
            if (i // 4 + j // 4) % 2 == 0:
                color = WOOL
            else:
                color = OBSIDIAN
            blocks.fill(color,
                        pos(1 + i * 2, 0, j * 2),
                        pos(1 + i * 2, height, j * 2),
                        FillOperation.REPLACE)
    player.say("DONE :)")
player.on_chat("steps_tiles", steps_tiles)


# ----- C: Diamond step-pyramid using abs() and max()
def pyramid(cx, cz, size):
    half = size // 2
    for di in range(-half, half):
        for dj in range(-half, half):
            height = half - max(abs(di), abs(dj))
            if height > 0:
                blocks.fill(SANDSTONE,
                            pos(cx + di, 0, cz + dj),
                            pos(cx + di, height, cz + dj),
                            FillOperation.REPLACE)

def _pyramid():
    pyramid(16, 16, 32)
    player.say("DONE :)")
player.on_chat("pyramid", _pyramid)


# ----- D: Round volcano using the Pythagorean theorem
def volcano(cx, cz, size):
    half = size // 2
    for di in range(-half, half):
        for dj in range(-half, half):
            dist = (di * di + dj * dj) ** 0.5
            height = int(half - dist)
            if height > 0:
                blocks.fill(STONE,
                            pos(cx + di, 0, cz + dj),
                            pos(cx + di, height, cz + dj),
                            FillOperation.REPLACE)

def _volcano():
    volcano(16, 16, 32)
    player.say("DONE :)")
player.on_chat("volcano", _volcano)


# ----- D2: Volcano with a LAVA crater (three passes)
def volcano_lava(cx, cz, size):
    half = size // 2
    crater = 4
    # Pass 1: stone cone
    for di in range(-half, half):
        for dj in range(-half, half):
            dist = (di * di + dj * dj) ** 0.5
            height = int(half - dist)
            if height > 0:
                blocks.fill(STONE,
                            pos(cx + di, 0, cz + dj),
                            pos(cx + di, height, cz + dj),
                            FillOperation.REPLACE)
    # Pass 2: lava pool in the upper middle of the cone
    for di in range(-crater, crater + 1):
        for dj in range(-crater, crater + 1):
            if di * di + dj * dj < crater * crater:
                blocks.fill(LAVA,
                            pos(cx + di, half - crater - 4, cz + dj),
                            pos(cx + di, half - 4, cz + dj),
                            FillOperation.REPLACE)
    # Pass 3: clear the stone above the lava (inside the crater circle)
    for di in range(-crater, crater + 1):
        for dj in range(-crater, crater + 1):
            if di * di + dj * dj < crater * crater:
                blocks.fill(AIR,
                            pos(cx + di, half - 3, cz + dj),
                            pos(cx + di, half, cz + dj),
                            FillOperation.REPLACE)

def _volcano_lava():
    volcano_lava(16, 16, 32)
    player.say("DONE :)")
player.on_chat("volcano_lava", _volcano_lava)


# ----- E: Round tower
# When hollow is True, only the outer ring is filled - the inside is
# empty so you can stand in it. Used for the castle's central keep.
def round_tower(cx, cz, radius, height, material, hollow):
    inner_r = radius - 1
    for di in range(-radius, radius + 1):
        for dj in range(-radius, radius + 1):
            d2 = di * di + dj * dj
            in_outer = d2 <= radius * radius
            on_ring = d2 >= inner_r * inner_r
            if in_outer and (not hollow or on_ring):
                blocks.fill(material,
                            pos(cx + di, 0, cz + dj),
                            pos(cx + di, height, cz + dj),
                            FillOperation.REPLACE)

def _round_tower():
    round_tower(16, 16, 12, 8, GOLD_BLOCK, False)
    player.say("DONE :)")
player.on_chat("round_tower", _round_tower)


# ----- F: Triple-nested loop - 3D sponge
def sponge():
    SIZE = 8
    for i in range(SIZE):
        for j in range(SIZE):
            for k in range(SIZE):
                if (i + j + k) % 2 == 0:
                    blocks.place(YELLOW_WOOL, pos(1 + i, k, j))
    player.say("DONE :)")
player.on_chat("sponge", sponge)


# ============================================================
# Castle / village / town building blocks
# ============================================================


# ----- G: Castle wall with crenellations
def castle_wall(cx, cz, half_size, height):
    for di in range(-half_size, half_size + 1):
        for dj in range(-half_size, half_size + 1):
            on_edge = (di == -half_size or di == half_size or
                       dj == -half_size or dj == half_size)
            if on_edge:
                if (di + dj) % 2 == 0:
                    h = height        # merlon (tall)
                else:
                    h = height - 2    # crenel (short gap)
                blocks.fill(STONE_BRICKS,
                            pos(cx + di, 0, cz + dj),
                            pos(cx + di, h, cz + dj),
                            FillOperation.REPLACE)

def _castle_wall():
    castle_wall(16, 16, 12, 6)
    player.say("DONE :)")
player.on_chat("castle_wall", _castle_wall)


# ----- H: Solid dome (Pythagorean theorem in 3D)
# base_y lets the dome sit on top of something (a tower!) instead of
# only on the ground.
def dome(cx, cz, radius, base_y, material):
    for di in range(-radius, radius + 1):
        for dj in range(-radius, radius + 1):
            d2 = di * di + dj * dj
            if d2 <= radius * radius:
                height = int((radius * radius - d2) ** 0.5)
                blocks.fill(material,
                            pos(cx + di, base_y, cz + dj),
                            pos(cx + di, base_y + height, cz + dj),
                            FillOperation.REPLACE)

def _dome():
    dome(16, 16, 12, 0, WOOL)
    player.say("DONE :)")
player.on_chat("dome", _dome)


# ----- I: Moat - a water RING
def moat(cx, cz, inner, outer):
    for di in range(-outer, outer + 1):
        for dj in range(-outer, outer + 1):
            d2 = di * di + dj * dj
            if inner * inner <= d2 <= outer * outer:
                blocks.fill(WATER,
                            pos(cx + di, -1, cz + dj),
                            pos(cx + di, -1, cz + dj),
                            FillOperation.REPLACE)

def _moat():
    moat(16, 16, 14, 18)
    player.say("DONE :)")
player.on_chat("moat", _moat)


# ----- K: Village - a grid of little houses
def village(cx, cz, count, spacing, house_size):
    for i in range(count):
        for j in range(count):
            ox = cx + i * spacing
            oz = cz + j * spacing
            blocks.fill(PLANKS_OAK,
                        pos(ox, 0, oz),
                        pos(ox + house_size - 1, 3, oz + house_size - 1),
                        FillOperation.HOLLOW)
            blocks.fill(BLACKSTONE,
                        pos(ox, 4, oz),
                        pos(ox + house_size - 1, 4, oz + house_size - 1),
                        FillOperation.REPLACE)
            blocks.fill(AIR,
                        pos(ox + 2, 1, oz),
                        pos(ox + 2, 2, oz),
                        FillOperation.REPLACE)

def _village():
    village(1, 0, 3, 8, 5)
    player.say("DONE :)")
player.on_chat("village", _village)


# ----- L: Spiral staircase using TRIG
def spiral(cx, cz, radius, steps):
    for k in range(steps):
        angle = k * 0.4
        x = int(Math.cos(angle) * radius)
        z = int(Math.sin(angle) * radius)
        blocks.fill(BRICKS,
                    pos(cx + x, 0, cz + z),
                    pos(cx + x, k // 2, cz + z),
                    FillOperation.REPLACE)

def _spiral():
    spiral(16, 16, 5, 40)
    player.say("DONE :)")
player.on_chat("spiral", _spiral)


# ============================================================
# CASTLE - the payoff
#
# Composes moat + outer wall + central keep + dome roof at one
# shared center. Because each helper takes (cx, cz), they line up
# automatically. To move the whole castle, change CX and CZ.
#
# Layout (CX, CZ = 30, 0):
#   - Moat:        ring from r=18 to r=22  (4 blocks wide, water)
#   - Wall:        24x24 square, 6 tall, crenellated stone bricks
#   - Keep:        hollow stone tower, radius 5, 14 tall
#   - Roof:        quartz dome on top of the keep at y=14
# ============================================================
def castle():
    CX = 30
    CZ = 0
    # Moat ring, 4 blocks wide, just outside the wall corners
    moat(CX, CZ, 18, 22)
    # Square outer wall with crenellations
    castle_wall(CX, CZ, 12, 6)
    # Hollow stone keep, 14 tall, in the middle of the courtyard
    round_tower(CX, CZ, 5, 14, STONE_BRICKS, True)
    # Quartz dome roof sitting on the top of the keep
    dome(CX, CZ, 5, 14, WOOL)
    player.say("CASTLE COMPLETE :)")
player.on_chat("castle", castle)
