import {
  GIVEN_DOC_REGEX,
  SCENARIO_DOC_REGEX,
  STEP_DOC_REGEX,
} from "./constants";
import { StepLine } from "./types";

export const mapMarkdownScenarios = (lines: string[]): StepLine[][] => {
  let lineNumber = 1;
  const currentMarkdown: StepLine[][] = [];
  let currentScenarioIndex = -1;

  for (const line of lines) {
    const [, scenarioMatch, scenarioContentMatch] =
      SCENARIO_DOC_REGEX.exec(line) ?? [];
    const [, givenMatch, givenContentMatch] = GIVEN_DOC_REGEX.exec(line) ?? [];
    const [, stepMatch, stepContentMatch] = STEP_DOC_REGEX.exec(line) ?? [];

    if (scenarioMatch) {
      currentScenarioIndex++;
      currentMarkdown[currentScenarioIndex] = [];
      currentMarkdown[currentScenarioIndex].push({
        step: `${scenarioMatch} ${scenarioContentMatch}`,
        line: lineNumber,
      });
    }

    if (givenMatch) {
      currentMarkdown[currentScenarioIndex].push({
        step: `${givenMatch} ${givenContentMatch}`,
        line: lineNumber,
      });
    }

    if (stepMatch) {
      currentMarkdown[currentScenarioIndex].push({
        step: `${stepMatch} ${stepContentMatch}`,
        line: lineNumber,
      });
    }

    lineNumber++;
  }

  return currentMarkdown;
};
