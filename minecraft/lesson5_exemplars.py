# Use RED_WOOOL for red color
# Use BLUE_WOOL for blue color
# Use GREEN_WOOL for green color
# Use WOOL for white color
# Use STONE for gray color
# Use OBSIDIAN for black color


def steps():
    for i in range(32):
        for j in range(32):
            height = i + j + 1
            if j % 2 == 0:
                if i % 2 == 0:
                    blocks.fill(WOOL,
                    pos(1+ i * 2, 0, j * 2),
                    pos(1+ i * 2, height, j * 2),
                    FillOperation.REPLACE)
                else:
                    blocks.fill(OBSIDIAN,
                    pos(1+ i * 2, 0, j * 2),
                    pos(1+ i * 2, height, j * 2),
                    FillOperation.REPLACE)
            else:
                if i % 2 == 0:
                    blocks.fill(STONE,
                    pos(1+ i * 2, 0, j * 2),
                    pos(1+ i * 2, height, j * 2),
                    FillOperation.REPLACE)
                else:
                    blocks.fill(REDSTONE_BLOCK,
                    pos(1+ i * 2, 0, j * 2),
                    pos(1+ i * 2, height, j * 2),
                    FillOperation.REPLACE)

    player.say("DONE :)")
player.on_chat("steps", steps)
