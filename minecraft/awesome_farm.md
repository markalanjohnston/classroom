# Awesome Farm — `farm` chat command

A full working Minecraft farm in **one** chat command — barn, silo, perimeter fence with a gated entrance, three animal pens, a wheat field with a scarecrow, a pond, shade trees, and the right animals in the right places.

## Before you run it

- The whole farm builds **to the east of you (positive X)**. Either face east before typing `farm`, or type `/tp ~ ~ ~5` in chat first to step a few blocks south so the farm goes up to your east where you can see it.
- Use a **flat world** ([Lesson 0](lesson0/)) with plenty of open space. The footprint is roughly **38 long × 33 wide × 14 tall**.
- Save your MakeCode project before running — undoing a build this size is painful.

## How to find block names yourself — the real answer

**The pxt-minecraft GitHub repo went private**, so there is no public canonical list of MakeCode's `Block` constants. The enum names also change between MakeCode builds (your editor has `DANDELION_YELLOW`; mine had `DANDELION`; a third build might have `YELLOW_FLOWER`). Chasing the right constant name is a losing game.

**The fix: use [`blocks.blockByName(...)`](https://minecraft.makecode.com/reference/blocks/block-by-name) with the Minecraft game ID instead of the MakeCode enum.**

```python
# Instead of guessing whether your build calls it DANDELION or DANDELION_YELLOW:
blocks.place(blocks.blockByName("dandelion"), pos(10, 1, 0))

# Same trick for any block — pass the Minecraft block ID as a lowercase string:
blocks.place(blocks.blockByName("poppy"),     pos(11, 1, 0))
blocks.place(blocks.blockByName("lantern"),   pos(12, 1, 0))
blocks.place(blocks.blockByName("hay_block"), pos(13, 1, 0))
```

The string is the Minecraft Bedrock block ID — **lowercase, snake_case, no namespace prefix.** Those IDs are stable across MakeCode builds because they come from the game itself, not from MakeCode's enum.

### Where to look up the game IDs

- **[Minecraft Wiki — Bedrock block IDs](https://minecraft.wiki/w/Bedrock_Edition_data_values#Blocks)** — the authoritative list. Search the page for what you want and use the ID column.
- **[Graham Edgecombe's Minecraft ID list](https://minecraft-ids.grahamedgecombe.com/)** — searchable interactive table.
- **In-game test**: type `/give @p dandelion 1` in Minecraft chat. If the game accepts it, `blocks.blockByName("dandelion")` will work too. (If the game says "unknown item", try a different ID like `yellow_flower`.)

### Two backup tricks for when you still want the enum

1. **Toolbox trick** — switch to **Blocks** view, drag a block tile from the BLOCKS category into your program, switch back to Python. The exact enum name your build uses appears in your code.
2. **JavaScript trick** — switch to **JavaScript** view, type `Block.` and read the autocomplete list. That's every enum entry your build has.

### Why `LANTERN` failed for you

Lanterns were added to Minecraft in 1.14 (2019). Many MakeCode for Education builds predate that block, so the enum entry doesn't exist. **`blocks.blockByName("lantern")`** works in newer builds; `TORCH` is the universal fallback for older ones. (This program uses `TORCH` so it runs everywhere.)

## The program

Paste this into MakeCode (Python Only) and run it. Then type `farm` in Minecraft chat.

```python
def on_farm():
    """Build a complete working farm in front of the player."""

    # ============================================================
    # 1. FOUNDATION — clear the air, lay a fresh grass field
    # ============================================================
    blocks.fill(AIR,   pos(3, 1, -16), pos(40, 14, 16), FillOperation.REPLACE)
    blocks.fill(GRASS, pos(3, 0, -16), pos(40, 0, 16),  FillOperation.REPLACE)

    # Cobblestone path from the front gate to the barn doors.
    blocks.fill(COBBLESTONE, pos(3, 0, -1), pos(25, 0, 1), FillOperation.REPLACE)

    # ============================================================
    # 2. PERIMETER FENCE — three sides + gated front
    # ============================================================
    blocks.fill(OAK_FENCE, pos(40, 1, -16), pos(40, 1, 16),  FillOperation.REPLACE)  # back (east)
    blocks.fill(OAK_FENCE, pos(3, 1, -16),  pos(40, 1, -16), FillOperation.REPLACE)  # north
    blocks.fill(OAK_FENCE, pos(3, 1, 16),   pos(40, 1, 16),  FillOperation.REPLACE)  # south
    blocks.fill(OAK_FENCE, pos(3, 1, -16),  pos(3, 1, -2),   FillOperation.REPLACE)  # front-left of gate
    blocks.fill(OAK_FENCE, pos(3, 1, 2),    pos(3, 1, 16),   FillOperation.REPLACE)  # front-right of gate

    # Lanterns: four corner posts + two welcome lanterns on the gate
    blocks.place(TORCH, pos(3, 2, -16))
    blocks.place(TORCH, pos(3, 2, 16))
    blocks.place(TORCH, pos(40, 2, -16))
    blocks.place(TORCH, pos(40, 2, 16))
    blocks.place(TORCH, pos(3, 2, -2))
    blocks.place(TORCH, pos(3, 2, 2))

    # ============================================================
    # 3. THE BARN — 14 wide × 7 tall × 15 deep, stepped pitched roof
    # ============================================================
    # Solid oak shell, then carve out the interior with AIR
    blocks.fill(OAK_PLANKS, pos(25, 1, -10), pos(38, 7, 4), FillOperation.REPLACE)
    blocks.fill(AIR,        pos(26, 1, -9),  pos(37, 6, 3), FillOperation.REPLACE)

    # Stepped pitched roof in DARK_OAK_PLANKS — each layer narrower
    blocks.fill(DARK_OAK_PLANKS, pos(25, 8,  -9), pos(38, 8,  3), FillOperation.REPLACE)
    blocks.fill(DARK_OAK_PLANKS, pos(25, 9,  -8), pos(38, 9,  2), FillOperation.REPLACE)
    blocks.fill(DARK_OAK_PLANKS, pos(25, 10, -7), pos(38, 10, 1), FillOperation.REPLACE)
    blocks.fill(DARK_OAK_PLANKS, pos(25, 11, -6), pos(38, 11, 0), FillOperation.REPLACE)

    # Timber-frame corner posts
    blocks.fill(OAK_LOG, pos(25, 1, -10), pos(25, 7, -10), FillOperation.REPLACE)
    blocks.fill(OAK_LOG, pos(25, 1, 4),   pos(25, 7, 4),   FillOperation.REPLACE)
    blocks.fill(OAK_LOG, pos(38, 1, -10), pos(38, 7, -10), FillOperation.REPLACE)
    blocks.fill(OAK_LOG, pos(38, 1, 4),   pos(38, 7, 4),   FillOperation.REPLACE)

    # Big barn doorway: 3 wide × 4 tall on the front (west) face
    blocks.fill(AIR, pos(25, 1, -2), pos(25, 4, 0), FillOperation.REPLACE)

    # Lantern over the barn doorway
    blocks.place(TORCH, pos(25, 5, -1))

    # ============================================================
    # 4. SILO — rustic stone tower at the back corner
    # ============================================================
    blocks.fill(COBBLESTONE,     pos(35, 1, -14),  pos(38, 12, -11), FillOperation.HOLLOW)
    blocks.fill(DARK_OAK_PLANKS, pos(35, 13, -14), pos(38, 13, -11), FillOperation.REPLACE)
    blocks.fill(AIR,             pos(35, 1, -13),  pos(35, 3, -12),  FillOperation.REPLACE)  # door

    # ============================================================
    # 5. HAY STORAGE — stack of bales beside the barn
    # ============================================================
    # blockByName "hay_block" works on every MakeCode build, regardless of
    # whether the enum calls it HAY_BLOCK or HAY_BALE.
    hay = blocks.blockByName("hay_block")
    blocks.fill(hay, pos(20, 1, -8), pos(22, 3, -6), FillOperation.REPLACE)
    blocks.place(hay, pos(23, 1, -5))
    blocks.place(hay, pos(19, 1, -4))

    # ============================================================
    # 6. POND — sandy bank with water in the middle
    # ============================================================
    blocks.fill(SAND,  pos(31, 0, 9),  pos(37, 0, 15), FillOperation.REPLACE)
    blocks.fill(WATER, pos(32, 0, 10), pos(36, 0, 14), FillOperation.REPLACE)

    # ============================================================
    # 7. CROP FIELD — farmland with a water channel + wheat + scarecrow
    # ============================================================
    blocks.fill(FARMLAND, pos(10, 0, -12), pos(18, 0, -3), FillOperation.REPLACE)
    blocks.fill(WATER,    pos(14, 0, -12), pos(14, 0, -3), FillOperation.REPLACE)
    wheat = blocks.blockByName("wheat")   # the growing crop block, not the item
    blocks.fill(wheat, pos(10, 1, -12), pos(13, 1, -3), FillOperation.REPLACE)
    blocks.fill(wheat, pos(15, 1, -12), pos(18, 1, -3), FillOperation.REPLACE)

    # Scarecrow: oak-log post, hay-block shoulders, pumpkin head
    blocks.fill(OAK_LOG, pos(14, 1, -7), pos(14, 3, -7), FillOperation.REPLACE)
    blocks.place(hay,     pos(13, 2, -7))
    blocks.place(hay,     pos(15, 2, -7))
    blocks.place(PUMPKIN, pos(14, 4, -7))

    # A few pumpkins for the harvest look
    blocks.place(PUMPKIN, pos(11, 1, -4))
    blocks.place(PUMPKIN, pos(17, 1, -10))
    blocks.place(PUMPKIN, pos(12, 1, -11))

    # ============================================================
    # 8. COW PEN — north paddock
    # ============================================================
    blocks.fill(OAK_FENCE, pos(8, 1, 4),   pos(16, 1, 4),  FillOperation.REPLACE)
    blocks.fill(OAK_FENCE, pos(8, 1, 9),   pos(16, 1, 9),  FillOperation.REPLACE)
    blocks.fill(OAK_FENCE, pos(8, 1, 4),   pos(8, 1, 9),   FillOperation.REPLACE)
    blocks.fill(OAK_FENCE, pos(16, 1, 4),  pos(16, 1, 9),  FillOperation.REPLACE)
    blocks.place(AIR, pos(12, 1, 4))  # gate

    # ============================================================
    # 9. PIG PEN — south paddock with muddy patches
    # ============================================================
    blocks.fill(OAK_FENCE, pos(8, 1, 10),  pos(16, 1, 10), FillOperation.REPLACE)
    blocks.fill(OAK_FENCE, pos(8, 1, 15),  pos(16, 1, 15), FillOperation.REPLACE)
    blocks.fill(OAK_FENCE, pos(8, 1, 10),  pos(8, 1, 15),  FillOperation.REPLACE)
    blocks.fill(OAK_FENCE, pos(16, 1, 10), pos(16, 1, 15), FillOperation.REPLACE)
    blocks.place(AIR, pos(12, 1, 10))  # gate
    blocks.fill(DIRT, pos(10, 0, 12), pos(13, 0, 14), FillOperation.REPLACE)  # mud

    # ============================================================
    # 10. CHICKEN COOP — small oak shed
    # ============================================================
    blocks.fill(OAK_PLANKS,      pos(18, 1, 5), pos(22, 3, 8), FillOperation.HOLLOW)
    blocks.fill(DARK_OAK_PLANKS, pos(18, 4, 5), pos(22, 4, 8), FillOperation.REPLACE)
    blocks.fill(AIR,             pos(18, 1, 6), pos(18, 2, 7), FillOperation.REPLACE)  # door

    # ============================================================
    # 11. SHADE TREES — corners of the property
    # ============================================================
    # NW tree
    blocks.fill(OAK_LOG,    pos(7, 1, -13), pos(7, 4, -13), FillOperation.REPLACE)
    blocks.fill(OAK_LEAVES, pos(5, 4, -15), pos(9, 6, -11), FillOperation.REPLACE)
    # SW tree
    blocks.fill(OAK_LOG,    pos(7, 1, 13), pos(7, 4, 13), FillOperation.REPLACE)
    blocks.fill(OAK_LEAVES, pos(5, 4, 11), pos(9, 6, 15), FillOperation.REPLACE)

    # ============================================================
    # 12. DECORATION — flowers along the path
    # ============================================================
    # Flowers use blockByName so this works regardless of whether your build
    # calls them POPPY/DANDELION, DANDELION_YELLOW, or RED_FLOWER/YELLOW_FLOWER.
    poppy     = blocks.blockByName("poppy")
    dandelion = blocks.blockByName("dandelion")
    blocks.place(poppy,     pos(7, 1, -3))
    blocks.place(dandelion, pos(7, 1, 3))
    blocks.place(poppy,     pos(12, 1, -3))
    blocks.place(dandelion, pos(12, 1, 3))
    blocks.place(poppy,     pos(18, 1, -3))
    blocks.place(dandelion, pos(18, 1, 3))

    # ============================================================
    # 13. ANIMALS — populate each pen
    # ============================================================
    for i in range(4):
        mobs.spawn(COW, randpos(pos(9, 1, 5), pos(15, 1, 8)))

    for i in range(4):
        mobs.spawn(PIG, randpos(pos(9, 1, 11), pos(15, 1, 14)))

    for i in range(8):
        mobs.spawn(CHICKEN, randpos(pos(17, 1, 5), pos(24, 1, 12)))

    for i in range(3):
        mobs.spawn(SHEEP, randpos(pos(8, 1, -8), pos(13, 1, -3)))

    # Horses at the barn entrance for ambiance
    mobs.spawn(HORSE, pos(23, 1, -1))
    mobs.spawn(HORSE, pos(23, 1, 1))

    # A llama hanging out by the hay
    mobs.spawn(LLAMA, pos(21, 1, -3))

player.on_chat("farm", on_farm)
```

## Farm map

```
                            FARM PROPERTY (player at X=0, facing east →)
                                                                              
            (-Z, north)                                                       
              ▲                                                               
              │                                                               
   ┌──────────┼──────────────────────────────────────────────────────────┐    
   │  🌳      │ wheat field  scarecrow  hay storage     SILO             │    
   │          │     ▒▒▒▒▒▒▒▒▒    🎃         🟨🟨🟨     ▒▒▒▒              │    
   │          │     ▒▒▒▒▒▒▒▒▒              🟨🟨🟨     ▒▒▒▒              │    
   │ - - - - -┼- - - - - - - - - - - - - - - -- - - - -- - - - - - - - -│    
   │  GATE ▶▶▶│▶▶▶ cobblestone path ▶▶▶▶▶▶▶▶ BARN DOORS                  │    
   │ - - - - -┼- - - - - - - - - - - - - - -                             │    
   │          │   COW PEN              CHICKEN COOP        BARN          │    
   │          │   🐄🐄🐄🐄                 🐔                              │    
   │          │ - - - - - - - - -                                        │    
   │          │   PIG PEN                                                │    
   │          │   🐖🐖🐖🐖                                  POND          │    
   │  🌳      │ (muddy patches)                            🟦🟦🟦          │    
   └──────────┼──────────────────────────────────────────────────────────┘    
              │                                                               
              ▼                                                               
            (+Z, south)                                                       
```

## What's where (X / Y / Z ranges)

| Section | X range | Z range | Notes |
| --- | --- | --- | --- |
| Foundation | 3 → 40 | -16 → 16 | Fresh grass, cobble path through middle |
| Perimeter fence | 3 / 40 / boundary | -16 → 16 | Gated front at Z = -1 to 1 |
| Barn | 25 → 38 | -10 → 4 | 14×7×15 with stepped pitched roof |
| Silo | 35 → 38 | -14 → -11 | Tall cobblestone tower |
| Hay storage | 19 → 23 | -8 → -4 | Big stack + loose bales |
| Pond | 31 → 37 | 9 → 15 | Sand banks, water in the middle |
| Crop field | 10 → 18 | -12 → -3 | Wheat + central water channel |
| Scarecrow | X = 14 | Z = -7 | In the middle of the field |
| Cow pen | 8 → 16 | 4 → 9 | 4 cows |
| Pig pen | 8 → 16 | 10 → 15 | 4 pigs, muddy patch |
| Chicken coop | 18 → 22 | 5 → 8 | 8 chickens roaming the yard |
| Shade trees | X = 7 | Z = ±13 | NW + SW corners |

## If something doesn't render

The version-bouncy constants (flowers, hay, wheat) already use `blocks.blockByName(...)` so they'll work on any build. The remaining MakeCode enum constants are the ones that could vary. If you get an "unknown identifier" error in Python, you have two choices: swap to the older generic name in the fallback column, **or** replace the constant with `blocks.blockByName("...")` and the Minecraft game ID string.

| MakeCode constant | Older fallback | `blockByName` form |
| --- | --- | --- |
| `DARK_OAK_PLANKS` | `OAK_PLANKS` (single-tone roof) | `blocks.blockByName("dark_oak_planks")` |
| `OAK_FENCE` | `FENCE` | `blocks.blockByName("oak_fence")` |
| `OAK_LOG` | `LOG` | `blocks.blockByName("oak_log")` |
| `OAK_PLANKS` | `PLANKS` | `blocks.blockByName("oak_planks")` |
| `OAK_LEAVES` | `LEAVES` | `blocks.blockByName("oak_leaves")` |
| `LLAMA` | another `SHEEP` | n/a (mob, not block) |

Rock-solid in every MakeCode build: `GRASS`, `DIRT`, `STONE`, `COBBLESTONE`, `WATER`, `SAND`, `FARMLAND`, `PUMPKIN`, `TORCH`, `AIR`, `COW`, `PIG`, `CHICKEN`, `SHEEP`, `HORSE`.

## To clean it up later

Drop this companion command into the same project to wipe the farm and restore an empty grass field:

```python
def on_clear():
    blocks.fill(AIR,   pos(3, 1, -16), pos(40, 14, 16), FillOperation.REPLACE)
    blocks.fill(GRASS, pos(3, 0, -16), pos(40, 0, 16),  FillOperation.REPLACE)
player.on_chat("clear", on_clear)
```
