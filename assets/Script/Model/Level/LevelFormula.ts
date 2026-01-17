export interface LevelFormulaVars {
  score: number;
  stepsLeft: number;
  timeLeft: number;
  target: number;
}

export function evaluateStarFormula(formula: string, vars: LevelFormulaVars): number {
  const score = Number(vars.score || 0);
  const stepsLeft = Number(vars.stepsLeft || 0);
  const timeLeft = Number(vars.timeLeft || 0);
  const target = Number(vars.target || 0);

  try {
    const fn = new Function(
      'score',
      'stepsLeft',
      'timeLeft',
      'target',
      `return (${formula});`
    ) as (...args: number[]) => number;

    const result = Number(fn(score, stepsLeft, timeLeft, target));
    if (Number.isNaN(result)) return 0;
    if (result < 0) return 0;
    if (result > 3) return 3;
    return Math.floor(result);
  } catch (error) {
    console.warn('Level formula evaluation failed:', error);
    return 0;
  }
}
