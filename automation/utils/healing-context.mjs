let healingState = {
    healed: false,
    healingScore: null
};

export function markHealing(score = null) {
    healingState = {
        healed: true,
        healingScore: score
    };
}

export function getHealingState() {
    return { ...healingState };
}

export function resetHealingState() {
    healingState = {
        healed: false,
        healingScore: null
    };
}