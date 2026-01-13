// Regex Patterns
export const SCENARIO_DOC_REGEX = /^## (Scenario:)\s+?(.+)/;
export const GIVEN_DOC_REGEX = /^-\s+?\*\*(Given:)\*\*\s+?(.+)/;
export const STEP_DOC_REGEX = /^-\s+?\*\*(When:|Then:|And:)\*\*\s+?(.+)/;
export const SCENARIO_TESTS_REGEX = /^(?:\s+)?test.describe\('(Scenario: .+)'/;
export const GIVEN_TESTS_REGEX = /^(?:\s+)?test\('(Given:)\s+?(.+)'/;
export const STEP_TESTS_REGEX = /^(?:\s+)?\/\/\s(When:|Then:|And:)\s?(.+)/;
