## 1. Acceptance Specification

- [ ] 1.1 Validate the OpenSpec change with `openspec validate <change> --type change --strict`
- [ ] 1.2 Configure the acceptance-test stack from `openspec/config.yaml` when `acceptance-tests/` is absent
- [ ] 1.3 Extract and lint the fenced Gherkin scenarios

## 2. Failing Acceptance Test

- [ ] 2.1 Add the step definitions or page-object behavior needed to execute one scenario
- [ ] 2.2 Run that scenario and confirm it fails for the missing product behavior

## 3. Implementation

- [ ] 3.1 Implement the smallest product change that makes the failing scenario pass
- [ ] 3.2 Run the scenario and confirm it passes with no pending or undefined steps

## 4. Verification

- [ ] 4.1 Run the effective acceptance suite and generate its HTML report
- [ ] 4.2 Run the project's regression checks
- [ ] 4.3 Re-run `openspec validate <change> --type change --strict`
