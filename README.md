Begods Backend

## FLOW

### Start Turn (/turn/start):

1. Update Current Turn +1 ( as new turn has started )
2. Draw 5 cards using seedCycle logic & update game values if there were any coin cards -- and maintain transaction of what he got
3. Update gamePhase state to "drawn"

> Now if user doesnt wants to continue he can END TURN (/turn/end), else battle with charcters he drawn

### Activate Character (/battle/activate)

1. Now, to get into a battle user needs to activate buy paying cost for the character and equip weapon if got any while drawing cards. Update balance after paying and update cards in hand.
2. Now becuase user has activated an characted means he is entering the battle. So update the game phase to "battle" means on going battle
3. Here, BOT will draw his cards and update drawn cards ( if not drawn already )

### Resolve (/battle/resolve)

1. Here, user will drop his activated character on to the battle ground N/3. Update currentBattleGround field + 1
2. Draw one random character out of BOT drawn cards and perform battle calculation based on A/D and resolve the battle. And return results, where if user won they keep his charcter activated and if he lost then deactivate ( remove from activated ) same goes for bot.
3. If user finishes all 3 battle grounds either explore section will be opened or turn would end. If explore updatee isExploreActive to true.
4. If user wants to continue battle, if user had won last battle then he would drop and call RESOLVE api endpoint. If user had lost last battle he would have to ACTIVATE CHARCTER again and so on until N/3 battle grounds are resolved.

> Now if bot didnt had any charcter and it used up its AVATAR then end the turn there itself.

> Now if user doesnt wants to continue he can END TURN (/turn/end), else battle with charcters he drawn

### Explore (/battle/explore)

1. Explore section would be called only if user wins 3/3 or more than the BOT.
2. It would generate a random reward or an encounter. If reward just credit reward and call END TURN.
3. Incase of encounter user would have to ACTIVATE CHARCTER and RESOLVE the battle with encounter and then call end turn.

### End Turn (/turn/end)

1. After drawn user can end
2. After an battle ground is resolved user can end
3. If all 3 rounds have resolved and no chance of explore.
4. Incase of explore, after explore is resolved end.
5. This will reset all drawn cards and activated cards and gamePhase.

## NOTES

1. If user/bot AVATAR loses the turn ends immediately.
