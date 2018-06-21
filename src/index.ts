// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"
declare var danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void
import { existsSync, readFileSync } from "fs"

interface XcodeReportOptions {
  pathToReport?: string
  showMessageTestSummary?: boolean
  showTestFailures?: boolean
}

export function generateXcodeReport(options: XcodeReportOptions) {
  const currentPath: string = options.pathToReport || "./build/reports/errors.json"
  const shouldShowMessageTestSummary: boolean = options.showMessageTestSummary || true
  const shouldShowTestFailures: boolean = options.showTestFailures || true

  if (existsSync(currentPath)) {
    const fileText = readFileSync(currentPath, "utf8")
    const fileJSON = JSON.parse(fileText)

    if (shouldShowMessageTestSummary) {
      // Comment total test results
      const tests_summary_messages = fileJSON["tests_summary_messages"]
      messageTestSummary(tests_summary_messages)
    }

    if (shouldShowTestFailures) {
      // Fail with each test failure
      const tests_failures = fileJSON["tests_failures"]
      findFailures(tests_failures)
    }
  } else {
    warn(`:mag: Can't find xcpretty report at \`${currentPath}\`, skipping generating Xcode Report.`)
  }
}

class TestFailure {
  testSuite: string
  file_path: string
  reason: string
  test_case: string

  constructor(object: any, testSuite: string) {
    this.testSuite = testSuite
    this.file_path = object["file_path"] as string
    this.reason = object["reason"] as string
    this.test_case = object["test_case"] as string
  }

  /**
   * Takes the file_path from the failure and turns it into an HTML formatted link, with line number
   */
  formattedFilePath() {
    // Users/steven/Aequilibrium/repos/kinzoo-ios/KinzooTests/Model/ApprovalTests.swift:58
    // converts to =>
    // KinzooTests/Model/ApprovalTests.swift#L31
    let fileUrlPath = this.file_path.split(`${danger.github.pr.base.repo.name}/`)[1].replace(":", "#L")
    return danger.github.utils.fileLinks([`${fileUrlPath}`])
  }

  /** Formats a message for the test failure */
  formattedMessage() {
    return `**${this.testSuite} - ${this.test_case}:** ${this.reason}\n${this.formattedFilePath()}`
  }
}

function findFailures(testFailures: any) {
  for (let testSuite in testFailures) {
    let suiteFailures = testFailures[testSuite]

    suiteFailures.forEach((failure: any) => {
      let newFail = new TestFailure(failure, testSuite)
      fail(newFail.formattedMessage())
    })
  }
}

function messageTestSummary(tests_summary_messages: any[]) {
  if (Array.isArray(tests_summary_messages) && tests_summary_messages.length) {
    let testMessage = tests_summary_messages[0]
    if (typeof testMessage == "string") {
      let trimmedSummary = (testMessage as string).trim()
      message(`${trimmedSummary}`)
    }
  }
}
