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



### v1.9 2026-10-09
-> Posupg Calc:
- Massive new tool (Other subcategory)
- Re-uses the heatmap's UI system, calculates costs of Position Upgrades
- Levels of the 4 Mastery Boosts and the Achievement Boost that reduce costs can be set
- Switch between tabs at the bottom, all 5 are available, with all 20 positions each

- Use the two buttons right above the positions to toggle between: setting currently owned levels, setting target levels
- Click on a position to set its level
- Use the Set all button in the top right to set levels for all 20 positions
- Use the (admittedly small) buttons on the left to set levels for all 4 positions in that row
- Owned level and target level are displayed on the positions (highlighted depending on current mode)
- Target level is +1 by default, set it to 0 to have +1 again
- When setting the target level for a single position, you can type it in the +100 format to base it off the owned level (it's inserted once, so when the owned level changes, this stays the same)

- The combined costs and amount of levels are displayed at the top
- Hover over a position to only see the costs and levels for that one
- Fullscreen option is available here as well
- You can enter how much of the currency you have and then it calculates the levels possible with that amount (even distribution), this does not overwrite your set levels/targets
- Automatically saves your levels & more! (Every time something gets calculated)
- Tab 3 getting Mastery Tokens back is not considered
- Special thanks to cubruce and Baydırman for the tab 1 cost formula past level 1000 (which was not listed anywhere, the other website & wiki both had it wrong)
- Special thanks to Mike9090 for suggesting this idea that definitely did not escalate

-> Storm Mastery Calc:
- New tool (Other subcategory)
- Enter start and end level to see how much a SM upgrade costs
- Enter level, progress and type of mastery (such as Wrench Storms) to see an approximation of how many items, storms & hours that is

-> Merge Heatmap:
- Merging no longer moves the barrel to the middle of the mouse, to be closer to SC2 than Fanmade
- Added setting at the bottom of the tool, if you wish to revert this change

-> Wiki:
- Added buttons leading to a relevant wiki article to a lot of tools, next to the Clear button
- Other Scrap content: replaced links to Global Challenge and Combine Tokens with a link to a list of all articles, because CombCalc has branched out a lot more by now

-> Share:
- Added buttons for sharing to all tools
- Click it to copy an URL for CombCalc that directly jumps to this tool when opened
- Useful to share a tool without the other person having to search for it

-> PWA:
- Added PWA support, meaning CombCalc can basically be "installed" on PC and mobile
- It works when offline, and auto updates when online
- It doesn't have the browser-own extra bars and buttons at the top/bottom