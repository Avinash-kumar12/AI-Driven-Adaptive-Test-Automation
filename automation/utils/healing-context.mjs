let healingState = {
    healed: false,
    healingScore: null,
    locator: null,
    command: null
};

export function markHealing(locator = null, command = null, score = null) {
    healingState = {
        healed: true,
        healingScore: score,
        locator,
        command
    };
}

export function getHealingState() {
    return { ...healingState };
}

export function resetHealingState() {
    healingState = {
        healed: false,
        healingScore: null,
        locator: null,
        command: null
    };
}
