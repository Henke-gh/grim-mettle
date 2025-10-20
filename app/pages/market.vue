<template>
    <HeroCard />
    <div class="wrapper">
        <h1>Bar'flergh's Sharp and Shiny</h1>
        <img src="../assets/images/vendor.png" alt="The goblin vendor welcomes you" class="vendorImg" />
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
                <p v-for="shield in data.items[1]">{{ shield.name }}</p>
            </div>
            <div class="category">
                <h2>Armour</h2>
                <p v-for="armour in data.items[2]">{{ armour.name }}</p>
            </div>
            <div class="category">
                <h2>Trinkets</h2>
                <p v-for="trinket in data.items[3]">{{ trinket.name }}</p>
            </div>
        </section>
    </div>
    <HeroNav />
</template>

<script setup>
const { data } = await useFetch('/api/items/itemCatalog')

onMounted(async () => {
    const data = await $fetch('/api/items/itemCatalog')
    console.log(data.items[0])
})
</script>

<style scoped>
.wrapper {
    margin-top: 6.5rem;
    padding: 0.5rem;
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
</style>