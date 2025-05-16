document.addEventListener("DOMContentLoaded", () => {
    // Battle Menu
    const fightButton = document.getElementById("fight-button") as HTMLButtonElement | null;
    const battleMenu = document.getElementById("battle-menu");
    const healthBar = document.getElementById("health-bar");
    const goalsSection = document.getElementById("goals-section");

    const attackMenu = document.getElementById("attack-menu");
    const itemsMenu = document.getElementById("items-menu");
    const attackButton = document.getElementById("attack-button") as HTMLButtonElement | null;
    const itemsButton = document.getElementById("items-button") as HTMLButtonElement | null;

    const attackGoBack = document.getElementById("attack-go-back");
    const itemsGoBack = document.getElementById("items-go-back");
    const battleGoBack = document.getElementById("go-back-button") as HTMLButtonElement | null;

    // Fight Button
    fightButton?.addEventListener("click", () => {
        fightButton.classList.add("hidden");
        battleMenu?.classList.remove("hidden");
        healthBar?.classList.remove("hidden");
        goalsSection?.classList.add("hidden");
    });

    // Attack & Items Navigation
    attackButton?.addEventListener("click", () => {
        battleMenu?.classList.add("hidden");
        attackMenu?.classList.remove("hidden");
    });

    itemsButton?.addEventListener("click", () => {
        battleMenu?.classList.add("hidden");
        itemsMenu?.classList.remove("hidden");
    });

    // Go Back from Attack
    attackGoBack?.addEventListener("click", () => {
        attackMenu?.classList.add("hidden");
        battleMenu?.classList.remove("hidden");
    });

    // Go Back from Items
    itemsGoBack?.addEventListener("click", () => {
        itemsMenu?.classList.add("hidden");
        battleMenu?.classList.remove("hidden");
    });

    // Go back from battle menu to default screen
    battleGoBack?.addEventListener("click", () => {
        battleMenu?.classList.add("hidden");
        healthBar?.classList.add("hidden");
        goalsSection?.classList.remove("hidden");
        fightButton?.classList.remove("hidden");
    });

    // Streaks Modal
    const openStreaks = document.getElementById("open-streaks");
    const closeStreaks = document.getElementById("close-streaks");
    const streaksModal = document.getElementById("streaks-modal");

    openStreaks?.addEventListener("click", () => {
        streaksModal?.classList.remove("hidden");
    });

    closeStreaks?.addEventListener("click", () => {
        streaksModal?.classList.add("hidden");
    });
});
