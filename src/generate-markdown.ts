import {
  GIVEN_TESTS_REGEX,
  SCENARIO_TESTS_REGEX,
  STEP_TESTS_REGEX,
} from "./constants";

export const generateMarkdown = (selectedText: string) => {
  let docContent = "";
  let isFirstScenario = true;
  const textByLine = selectedText.split("\n");

  for (const line of textByLine) {
    const scenarioMatch = SCENARIO_TESTS_REGEX.exec(line)?.[1];
    const [, givenMatch, givenContentMatch] =
      GIVEN_TESTS_REGEX.exec(line) ?? [];
    const [, stepMatch, stepContentMatch] = STEP_TESTS_REGEX.exec(line) ?? [];

    if (scenarioMatch) {
      if (isFirstScenario) {
        isFirstScenario = false;
        docContent += `## ${scenarioMatch}\n`;
      } else {
        docContent += `\n## ${scenarioMatch}\n`;
      }
    }

    if (givenMatch) {
      docContent += `- **${givenMatch}** ${givenContentMatch}\n`;
    }

    if (stepMatch) {
      docContent += `- **${stepMatch}** ${stepContentMatch}\n`;
    }
  }

  return docContent;
};
