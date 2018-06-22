import { existsSync, readFileSync } from "fs"
import { TestFailure } from "./TestFailure"

// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"
export declare var danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

interface XcodeReportOptions {
  pathToReport?: string
  showMessageTestSummary?: boolean
  showTestFailures?: boolean
}

export function generateXcodeReport(options: XcodeReportOptions) {
  const currentPath: string = options.pathToReport !== undefined ? options.pathToReport! : "./build/reports/errors.json"
  const shouldShowMessageTestSummary: boolean =
    options.showMessageTestSummary !== undefined ? options.showMessageTestSummary! : true
  const shouldShowTestFailures: boolean = options.showTestFailures !== undefined ? options.showTestFailures! : true

  if (existsSync(currentPath)) {
    const fileText = readFileSync(currentPath, "utf8")
    const fileJSON = JSON.parse(fileText)

    if (shouldShowMessageTestSummary) {
      // Comment total test results
      const testsSummaryMessages = fileJSON["tests_summary_messages"]
      messageTestSummary(testsSummaryMessages)
    }

    if (shouldShowTestFailures) {
      // Fail with each test failure
      const testsFailures = fileJSON["tests_failures"]
      findFailures(testsFailures)
    }
  } else {
    warn(`:mag: Can't find xcpretty report at \`${currentPath}\`, skipping generating Xcode Report.`)
  }
}

function findFailures(testFailures: any) {
  for (const testSuite in testFailures) {
    if (testFailures.hasOwnProperty(testSuite)) {
      const suiteFailures = testFailures[testSuite]

      suiteFailures.forEach((failure: any) => {
        const newFail = new TestFailure(failure, testSuite)
        fail(newFail.formattedMessage())
      })
    }
  }
}

function messageTestSummary(testsSummaryMessages: any[]) {
  if (Array.isArray(testsSummaryMessages) && testsSummaryMessages.length) {
    const testMessage = testsSummaryMessages[0]
    if (typeof testMessage === "string") {
      const trimmedSummary = (testMessage as string).trim()
      message(`${trimmedSummary}`)
    }
  }
}
