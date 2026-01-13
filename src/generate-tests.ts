import {
  GIVEN_DOC_REGEX,
  SCENARIO_DOC_REGEX,
  STEP_DOC_REGEX,
} from "./constants";

export const generateTests = (selectedText: string) => {
  let isFirstScenario = true;
  let testContent = "";

  const textByLine = selectedText.split("\n");

  for (const line of textByLine) {
    const [, scenarioMatch, scenarioContentMatch] =
      SCENARIO_DOC_REGEX.exec(line) ?? [];
    const [, givenMatch, givenContentMatch] = GIVEN_DOC_REGEX.exec(line) ?? [];
    const [, stepMatch, stepContentMatch] = STEP_DOC_REGEX.exec(line) ?? [];

    if (scenarioMatch) {
      if (isFirstScenario) {
        isFirstScenario = false;
      } else {
        testContent += `\t});\n});\n\n`;
      }

      testContent += `test.describe('${scenarioMatch} ${scenarioContentMatch}', () => {\n`;
    }
    if (givenMatch) {
      testContent += `\ttest('${givenMatch} ${givenContentMatch}', async ({ page }) => {\n`;
    }
    if (stepMatch) {
      testContent += `\t\t// ${stepMatch} ${stepContentMatch}\n`;
    }
  }

  const hasScenario = textByLine.some((line) => SCENARIO_DOC_REGEX.test(line));
  const hasGiven = textByLine.some((line) => GIVEN_DOC_REGEX.test(line));

  if (!hasScenario && !hasGiven) {
    // Do nothing
  } else if (!hasScenario && hasGiven) {
    testContent += `\t});`;
  } else {
    testContent += `\t});\n});\n`;
  }

  return testContent;
};
