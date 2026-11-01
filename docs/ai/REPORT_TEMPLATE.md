# Final report template

For every meaningful task the final answer is **in Vietnamese**, mostly Markdown tables, concise. Keep code identifiers, commands and paths exact. Omit section V only for demonstrably non-UI work (write one line "Not applicable"). For tiny edits, tables may be merged but must still show files changed, verification result and remaining risks.

Rules: never write PASS without a command result or observable evidence; `NOT RUN` / `BLOCKED` are valid and must give a reason; distinguish "browser emulation" from "physical device"; report baseline failures separately from introduced ones; do not claim a skill or tool ran if it did not.

## I. Executive summary
| Item | Outcome |
| --- | --- |
| Task | [feature / bug / setup] |
| Status | DONE / PARTIAL / BLOCKED |
| Business outcome | [what the user can now do] |
| Main changes | [short summary] |
| Open issues | [none / details] |

## II. Changed files and implementation
| File / module | Type | Change | Reason / impact |
| --- | --- | --- | --- |
| `path/to/file` | Added / Updated / Removed | ... | ... |

## III. Requirements and acceptance criteria
| Acceptance criterion | Status | Evidence / location |
| --- | --- | --- |
| ... | PASS / FAIL / NOT VERIFIED | ... |

## IV. Verification and tests
| Check / command | Scope / environment | Result | Evidence / notes |
| --- | --- | --- | --- |
| `...` | ... | PASS / FAIL / NOT RUN / BLOCKED | ... |

## V. Responsive / UI / accessibility QA (UI work)
| Device class / viewport | Scenario | Status | Notes / evidence |
| --- | --- | --- | --- |
| Mobile / ...px | ... | ... | ... |
| Tablet / ...px | ... | ... | ... |
| Desktop / ...px | ... | ... | ... |

## VI. MCP / plugin / skill usage
| Tool / skill | Availability | Used? | Purpose / reason not used |
| --- | --- | --- | --- |
| ... | Active / unavailable / unverified | Yes / No | ... |

## VII. Risks / limitations / next actions
| Severity | Finding / limitation | Suggested next action |
| --- | --- | --- |
| P0 / P1 / P2 / P3 / Info | ... | ... |
