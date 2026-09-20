format: yyyy-mm-dd

# List of Updates
## 2024
- v1.0
- v1.1
- v1.2
- v1.3
- v1.4
## 2025
- v1.4.1
- v1.5
- v1.5.1
## 2026
- v1.5.1
- v1.6
- v1.7
- v1.7.1
- v1.8



# Patch notes
## v1.0 2024-05-13
- Release



## v1.1 2024-06-15
- New feature: Combine Gain Calc (the first actual calc here, lol)
- Added images to the top left of features
- Added Terms of Service
- Re-organized the info boxes a bit, merged scrap content and wiki, to make space for the patch notes



## v1.2 2024-10-17
- Added More Scrap Calc (for the book upgrade)
- Formula and research made by K. whale.
- Added Donate link
- Minor improvements 



## v1.3 2024-12-03
- New calc: Token Cost Calc (how many tokens for x combinations, or how many combinations with x tokens)
- Input fields are now yellow if optional, red if required
- Donate button prettier
- Fixed an issue with deciding if it's sumer time



## v1.4 2024-12-28
- New calc: Barrel Production Calc (calculate production of a barrel based on your barrel 1)
- Implemented breakinfinity
- Added favicon
- Re-organized some files



### v1.4.1 2025-04-30
- Added more invalid input texts (when you enter something illegal)
- Added some placeholder texts (gray) to indicate what you are meant to enter
- Fixed Summer time issue
- Minor improvements



## v1.5 2025-09-07
-> New calc: Achievement Boost Calc
- Calculates how many Crystals upgrading costs
- Insert start level and goal level

-> Design:
- Boxes get ligher and wider when hovered over
- Changed box border
- Changed some colors (less flashy whites)
- Changed design of the left-right green thing (and on mobile it's below now)
- Smaller title (Schrottii's CombCalc)
- Patch notes aligned to the left to be easier to read

-> Images:
- Added background image
- New image for Barrel Production Calc
- Moved calc images more to the left and made them a bit bigger

-> Other:
- More Scrap Calc: highest scrap ever is now inserted without log (ie 1e100 instead of 100)
- Slightly changed some texts to be easier to understand
- Slightly improved performance
- Code improvements & re-organizing



### v1.5.1 2025-12-03
-> New calc: Abstract Calc
- Convert between abstract and scientific notation
- Based on the python original by K. Whale, requested by some 

-> Other:
- More Scrap Calc: both 1e100 and 100 format are now supported



### v1.5.2 2026-01-20
- More Scrap Calc: implemented new (complex) formula for a, requiring More Scrap upgrade level
- Updated Info and Contact sections at the bottom, including easier-to-read formatting and Balnoom brand name
- Changed purpose from "tool for Global Challenge/Combine Tokens and more" to "collection of various Scrap calcs and tools"



## v1.6 2026-02-03
-> Games and subcategories:
- Added support and UI for multiple games and subcategories
- Added Scrap Collector and SC2FMFR (and the already existing Scrap 2)
- Scrap 2 has these subcategories: GC/Combines, Scrap prod, Other, All
- Added images for all games and subcategories
- Overhauled structure and code to enable these, make it easier to add new tools, and optimize performance

-> New calcs and tools:
- SC2: Merge Pace Calc: get estimates for 1 hour, 6 hours, 12 hours, 1 day and 7 days based on merges in an FB and rest time, along with FB/h and hours per day info
- SCO: Prestige GS Calc: calculates GS on a prestige using the four relevant values
- SCO: Star Calc: calculates cost for a Star or multiple, including discount and the breakeven point
- SCO: Scrapyard Calc: calculates cost and effect at a given Scrapyard level
- SCO: Scrap Boost Calc: calculates the Scrap Boost at a number of collects, or how many are needed to get a certain boost
- FMFR: Second Dimension Calc: find out how many merges it takes for an optimal second dim run
- FMFR: Fairy Dust Calc: calculate current or theoretical gains by inserting all relevant numbers
- FMFR: Alien Dust Calc
- FMFR: Star Dust Calc
- FMFR: Import: paste your SC2FMFR save and the numbers are automatically extracted into the other calcs/tools, making it even easier

-> Other:
- Renamed Abstract <-> Scientific Calc to Abstract <-> Scientific Converter
- Barrel Production Calc appears for SC2FMFR too
- Changed color of squares at the bottom



## v1.7 2026-07-31
-> Saving:
- Inputs into the tools and calcs are now saved (every 3s)
- They get cached and later loaded directly into the tools when revisiting CombCalc
- Added buttons to quickly clear the inputs to most tools (top right)
- Added a button to clear ALL inputs of ALL tools to the Info section

-> Merge Pace Calc:
- Added ability to set a ratio, and the merges of the alt. speed
- This can be used for something like: 2:1 - 2 FBs, 1 am+fb
- Active Speed and Alt. Speed (if using ratio) are now shown (these are for active playing, so not including breaks)
- Seconds and Minutes are now shown
- Design and text changes

-> Other tools:
- SC2FMFR import: improved stability for lategame saves
- Renamed Abstract <-> Scientific Converter to Abstract-Scientific Converter

-> Design:
- Slightly changed hover effect for tools
- Changed positioning of tool images
- Increased size of checkboxes
- Increased size for categories and subcategories
- Limited patch notes height (scrollable)
- Various mobile improvements

-> Other:
- Removed old ToS and inserted new ToS, Balnoom License & Privacy Policy (note: not tailored to CombCalc, so it may be called a "game" or discuss contents that do not exist here)
- Contact: added E-mail (with mailto)
- Other Scrap content: Added link to SC2 Records
- Changed patch_notes.txt to PATCH_NOTES.md
- Added link to all patch notes
- Fixed very weird auto scrolling bug



### v1.7.1 2026-08-01
-> Performance:
- Optimized the rendering of calc results like crazy
- This decreases the amount of render updates by >95% (depends on how the user acts, can be above 99%)
- Amount of performed render updates, omitted updates (that would've usually been performed) and their percentage are shown in the Info section
- Fixes the issue of random inputs being swallowed

-> Design:
- Added hover effect for the new Clear buttons
- Combine Gain Calc: changed colors of the left-right split (from weird greens to dark blues)

-> Other:
- Token Cost Calc: moved image to the right
- More Scrap Calc: moved formula explanation to the right



## v1.8 2026-9-20
-> Merge Heatmap:
- Massive new tool that simulates merging from SC2 from the ground up, to track merges and then show optimal pos for Position Upgrades
- Includes the 20 barrels field (with the first 20 barrels of the game), merging & converting
- Results can show: Merges to, Merges from, Converts
- Top displays the amount of merges and converts (instead of Scrap and Magnets)

- Some extra tools to help you are included:
- Reset tracking (a hard reset that sets things like merges to 0)
- Clear all pos (sets all barrels to barrel 1, tracking is kept)
- Undo last step (reverts one merge, one convert, or one auto merge session)
- Fullscreen (makes it take up the entire screen like the web version of FMFR)
- Auto merge (simulates SC2's auto merge, can do 1 to 100000 merges at once, is included in tracking)

-> Merge Pattern Calc:
- New tool that explains patterns and tiers, and lets you figure out two things:
- How fast each repeat of the pattern has to be, to get a certain merge goal
- How many merges the FB will have, if every repeat takes a certain duration
- Additional milestones (up to 3s faster and 3s slower, so 7 numbers) will be shown in a table at the bottom

-> Barrel Production Calc:
- This tool is not only found under SC2 but also FR, because it works for both, however FR can have more factors. These can now be considered, with new options only visible when viewing it from the FR category.
- Stronger Barrel Tiers level (0 - 200, increases the 3^)
- Second Dimension toggle (1.1^ instead of 3^)

-> Subcategories:
- New Scrap 2 subcategory: Merging
- The only subcategories of Scrap Collector and SC2FMFR now say "(All)" to avoid confusion

-> Tool design:
- Result lines now blink yellow and have a slightly darker background
- Result lines now say Result: for easier finding and consistency
- Hover effect lingers for longer
- Images on the left are a bit smaller

-> Bottom boxes:
- Changed design a bit
- Moved Other Scrap content / wiki box into Info
- Turned legal links and Discord info into lists
- Added Latest patch notes headline
- Added dedicated box for Settings

-> Settings:
- Moved hard reset and tracker for optimized render updates (which is now more clear) here
- Added Setting to disable the new Result text flashing effect
- Added Setting to make tool boxes always wide (not expanding when hovered)
- Added Setting to perform all UI updates, even when unnecessary (see: v1.7.1)

-> Other:
- Added WGGJ v1.7 for the Merge Heatmap
- Improved initialization of tool texts
- Import tool: when something goes wrong, the text now gets updated & shows the save length
- Removed some exclamation marks so nobody thinks it could be an unexpected factorial