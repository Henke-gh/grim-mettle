<template>
    <HeroCard v-if="user && hero" />
    <CustomHeader v-else />
    <div class="guideWrapper" :style="{ marginTop: (user && hero) ? '7rem' : null }">
        <h1 class="roboto-mono-600 centerText">Game Guide</h1>
        <article class="gameGuide roboto-mono-400">
            <p class="centerText">This guide provides a quick run down of the skills and mechanics of Grim Mettle.</p>
            <div class="swordlineContainer spacing"><img src="/divider.svg"
                    alt="A line of four swords, with a shield in the middle" /></div>
            <h2 class="headline bold">- Character Stats -</h2>
            <h3 class="headline bold">[Hitpoints]</h3>
            <p>Everyone knows what these are, they represent your life total. The beating heart.
                If you loose them all in battle your hero will perish. Actually die. Really, be careful.</p>
            <p>This game doesn't want you to die, but many of its monsters do and some hit hard.
                If you're up against unfamiliar enemies, play it safe until you know what's up.</p>
            <p>Lost hitpoints are regenerated over time, along with Grit, but if waiting around is not your thing then
                check the Healer's Hut.</p>
            <h3 class="headline bold">[Grit]</h3>
            <p>Stamina, that's Grit. You can only engage in work or combat as long as you have sufficient Grit.
                It replenishes over time, if you run out give it a couple of minutes and well, you get more.</p>
            <h3 class="headline bold">[XP]</h3>
            <p>Some say XP is why we play these games. To watch numbers go up. XP is your ticket to making numbers
                larger.
                By earning XP in combat your hero levels up and gets more skillpoints to spend. Fantastic!</p>
            <h3 class="headline bold">[Base Attributes - Strength]</h3>
            <p>One of three base stats, strength represents the heroes raw power.
                Points spent increases both damage done and your maximum hitpoint-total.
                If hitting like an absolute truck is your jam, I say invest here while the market is hot.</p>
            <h3 class="headline bold">[Base Attributes - Speed]</h3>
            <p>Speed governs a semi-hidden stat called "Fatigue" which determines how many turns your hero can fight in
                any single combat encounter.
                If your hero lacks the fatigue to continue the fight he or she will simply fold over and surrender.</p>
            <p>The speed attribute also influences the players Initiative, Evasion and Block skills. Making you slightly
                better at each one!</p>
            <h3 class="headline bold">[Base Attributes - Vitality]</h3>
            <p>Vitality is health, good health and that means hitpoints. You won't get far around here without those.
                Make sure to drop points here along your journey.</p>
            <h3 class="headline bold">[Weapon Skills]</h3>
            <p>Putting points here is very handy if you want to be able to hit things with your fancy weapons. A healthy
                weapon skill is needed both to overcome
                a specific weapons skill requirement aswell as to counteract enemies Evasion skill. Points well spent,
                seriously.</p>
            <h3 class="headline bold">[Skill - Initiative]</h3>
            <p>Wanna go fast? First even? That's what initiative does. It decides which combatant gets to act first each
                turn.</p>
            <h3 class="headline bold">[Skill - Evasion]</h3>
            <p>Evasion lets you dodge blows in combat, like take no damage. Who needs hitpoints now, huh? Counteracted
                by weapon skill level. Yes, monsters have those too!</p>
            <h3 class="headline bold">[Skill - Block]</h3>
            <p>Sword and board! Hide behind a shield and reduce incoming damage. Pretty similar to Evasion,
                except it reduces damage based off of the equipped shield's damage reduction value.</p>

            <h2 class="headline">- Combat -</h2>
            <p>Just a couple of things, not too much to divulge here.</p>

            <h3 class="bold headline">[Stances]</h3>
            <p>When your hero enters a fight you get to choose one of three different stances. These affect your stats
                and skills in some way.</p>
            <p>Offensive - Grants a bonus to your chance to hit as well as Initiative, while applying a reduction to
                Evasion and Block.</p>
            <p>Balanced - No seasoning. Your hero swings, dodges, blocks and does damage using unmodified values. A good
                baseline!</p>
            <p>Defensive - The reverse of the Offensive stance. Grants a bonus to Block and Evasion while reducing
                Initiative and your skill with equipped weapon.</p>

            <h3 class="bold headline">[Misc]</h3>
            <p>What if you don't have a weapon equipped during combat you say? Then you will do battle with your fists,
                relying only on your strength!</p>

            <!--  <p class="bold headline">[Critical hits]</p>
            <p>Just thought I'd throw this in here aswell. Both the player and the monsters you fight have a chance to
                critically strike, dealing increased damage. You have been warned!</p> -->
            <div class="swordlineContainer spacing"><img src="/divider.svg"
                    alt="A line of four swords, with a shield in the middle" /></div>
            <p class="italic">Last updated: 14/11-25</p>
        </article>
    </div>
    <HeroNav v-if="user && hero" />
    <CustomFooter v-else />
</template>

<script setup>
import { useHeroView } from '#imports';
import CustomFooter from '~/components/CustomFooter.vue';
const user = useSupabaseUser();
const hero = useHeroView();
</script>

<style scoped>
.guideWrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    padding-bottom: 5rem;
    font-family: monospace;
}

.gameGuide {
    display: flex;
    flex-direction: column;
    gap: 0.4rem
}
</style>