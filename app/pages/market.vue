<template>
    <HeroCard />
    <div class="wrapper">
        <div class="gradientBorder">
            <header class="storeHeader">
                <h1>Zorakh's Emporium</h1>
                <div class="headerStoreContainer">
                    <article>
                        <p>Browse around, have a look! I'm sure you'll find something you can afford.</p>
                        <p>A new trinket, perhaps?</p>
                    </article>
                    <img src="../assets/images/vendor.png" alt="The goblin vendor welcomes you" class="vendorImg" />
                </div>
            </header>
        </div>
        <section class="storeAwaits" v-if="!data">
            <h2>Waiting for inventory..</h2>
        </section>
        <section class="storeContainer" v-else>
            <div class="category">
                <h2>Weapons</h2>
                <div class="item" v-for="weapon in data.items[0]">
                    <p>[{{ weapon.name }}]</p>
                    <div class="part">
                        <p>Cost: {{ weapon.goldCost }} gold</p>
                        <button class="inspectBtn">Inspect</button>
                    </div>
                </div>
            </div>
            <div class="category">
                <h2>Shields</h2>
                <div class="item" v-for="shield in data.items[1]">
                    <p>{{ shield.name }}</p>
                    <div class="part">
                        <p>Cost: {{ shield.goldCost }} gold</p>
                        <button class="inspectBtn">Inspect</button>
                    </div>
                </div>
            </div>
            <div class="category">
                <h2>Armour</h2>
                <div class="item" v-for="armour in data.items[2]">
                    <p>{{ armour.name }}</p>
                    <div class="part">
                        <p>Cost: {{ armour.goldCost }} gold</p>
                        <button class="inspectBtn">Inspect</button>
                    </div>
                </div>
            </div>
            <div class="category">
                <h2>Trinkets</h2>
                <div class="item" v-for="trinket in data.items[3]">
                    <p>{{ trinket.name }}</p>
                    <div class="part">
                        <p>Cost: {{ trinket.goldCost }} gold</p>
                        <button class="inspectBtn">Inspect</button>
                    </div>
                </div>
            </div>
        </section>
        <section class="storeHeroSales">
            <h2>Your items:</h2>
        </section>
    </div>
    <HeroNav />
</template>

<script setup>
const { data } = await useFetch('/api/items/itemCatalog')
</script>

<style scoped>
.wrapper {
    margin-top: 6.5rem;
    padding: 0.5rem;
}

.storeHeader {
    background-color: var(--bone-white);
    padding: 0.5rem;
}

.storeHeader h1 {
    margin: 0;
}

.headerStoreContainer {
    display: flex;
    flex-direction: row;
}

.vendorImg {
    width: 7rem;
    height: auto;
    border-radius: 50%;
}

.item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.part {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.category {
    width: 20rem;
    padding: 0.5rem;
}

.inspectBtn {
    border: none;
    border-left: 3px solid var(--light-green);
    font-family: monospace;
    font-weight: 600;
    color: var(--light-green);
    background-color: var(--dark-green);
    border-radius: 0px 5px 5px 0px;
    padding: 0.5rem;
}

.storeHeroSales {
    padding: 0.5rem;
}
</style>