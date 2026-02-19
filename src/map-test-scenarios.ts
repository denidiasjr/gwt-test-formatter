import fs from "fs";
import readLine from "readline";
import { StepLine } from "./types";
import {
  GIVEN_TESTS_REGEX,
  SCENARIO_TESTS_REGEX,
  STEP_TESTS_REGEX,
} from "./constants";

export const mapTestScenarios = async (
  e2ePath: string,
): Promise<StepLine[][]> => {
  if (!fs.existsSync(e2ePath)) {
    return [];
  }

  let lineNumber = 1;
  const fileStream = fs.createReadStream(e2ePath);
  const lineReader = readLine.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const existingTests: StepLine[][] = [];
  let currentScenarioIndex = -1;

  for await (const line of lineReader) {
    const scenarioMatch = SCENARIO_TESTS_REGEX.exec(line)?.[1];

    const [, givenMatch, givenContentMatch] =
      GIVEN_TESTS_REGEX.exec(line) ?? [];

    const [, stepMatch, stepContentMatch] = STEP_TESTS_REGEX.exec(line) ?? [];

    if (scenarioMatch) {
      currentScenarioIndex++;
      existingTests[currentScenarioIndex] = [];
      existingTests[currentScenarioIndex].push({
        step: scenarioMatch,
        line: lineNumber,
      });
    }

    if (givenMatch) {
      existingTests[currentScenarioIndex].push({
        step: `${givenMatch} ${givenContentMatch}`,
        line: lineNumber,
      });
    }

    if (stepMatch) {
      existingTests[currentScenarioIndex].push({
        step: `${stepMatch} ${stepContentMatch}`,
        line: lineNumber,
      });
    }

    lineNumber++;
  }

  lineReader.close();

  return existingTests;
};
