function calculateAdaptiveRisk({
    ruleScore = 0,
    mlProbability = 0,
    dnaScore = 0,
    behaviorScore = 0,
    temporalScore = 0,
    ringScore = 0
}) {
    const rule = Number(ruleScore) || 0;
    const ml = Number(mlProbability) || 0;
    const dna = Number(dnaScore) || 0;
    const behavior = Number(behaviorScore) || 0;
    const temporal = Number(temporalScore) || 0;
    const ring = Number(ringScore) || 0;

    let ruleWeight = 0.30;
    let mlWeight = 0.20;
    let dnaWeight = 0.15;
    let behaviorWeight = 0.10;
    let temporalWeight = 0.10;
    let ringWeight = 0.15;

    if (ring >= 70) {
        ringWeight += 0.15;
        ruleWeight -= 0.05;
        mlWeight -= 0.05;
        dnaWeight -= 0.05;
    }

    if (behavior >= 70) {
        behaviorWeight += 0.10;
        ruleWeight -= 0.05;
        mlWeight -= 0.05;
    }

    if (temporal >= 70) {
        temporalWeight += 0.10;
        ruleWeight -= 0.05;
        mlWeight -= 0.05;
    }

    if (dna >= 70) {
        dnaWeight += 0.10;
        ruleWeight -= 0.05;
        mlWeight -= 0.05;
    }

    const totalWeight =
        ruleWeight +
        mlWeight +
        dnaWeight +
        behaviorWeight +
        temporalWeight +
        ringWeight;

    const adaptiveScore =
        (
            rule * ruleWeight +
            ml * mlWeight +
            dna * dnaWeight +
            behavior * behaviorWeight +
            temporal * temporalWeight +
            ring * ringWeight
        ) / totalWeight;

    const score = Math.min(
        100,
        Math.max(0, Math.round(adaptiveScore))
    );

    let status = "SAFE";

    if (score >= 70) {
        status = "FRAUD";
    } else if (score >= 40) {
        status = "SUSPICIOUS";
    }

    return {
        adaptiveScore: score,
        status,
        weights: {
            rule: Number(ruleWeight.toFixed(2)),
            ml: Number(mlWeight.toFixed(2)),
            dna: Number(dnaWeight.toFixed(2)),
            behavior: Number(behaviorWeight.toFixed(2)),
            temporal: Number(temporalWeight.toFixed(2)),
            ring: Number(ringWeight.toFixed(2))
        }
    };
}

module.exports = {
    calculateAdaptiveRisk
};