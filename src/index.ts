import { existsSync, readFileSync } from "fs"
import { TestFailure } from "./TestFailure"

// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"
export declare var danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

/**
 * The configuration options that can be provided to `xcodeReport`.
 */
export interface XcodeReportOptions {
  /**
   * The path to the generated json file produced by `xcpretty-json-formatter`. Relative to project root, defaults to `./build/reports/errors.json`.
   */
  pathToReport?: string
  /**
   * Whether the test summary message will be reported using danger's `message()`. Defaults to true.
   */
  showMessageTestSummary?: boolean
  /**
   * Whether each test failure will be reported using danger's `fail()`. Defaults to true.
   */
  showTestFailures?: boolean
  /**
   * Custom name of the workspace, which will appear in file locations
   */
  workspace?: string
}

/**
 * A Danger plugin to process the xcpretty json output into danger messages.
 * @param options You must provide an options object, but each has a default value so it can be empty if you want the default configuration.
 */
export function xcodeReport(options: XcodeReportOptions) {
  const currentPath: string = options.pathToReport !== undefined ? options.pathToReport! : "./build/reports/errors.json"
  const shouldShowMessageTestSummary: boolean =
    options.showMessageTestSummary !== undefined ? options.showMessageTestSummary! : true
  const shouldShowTestFailures: boolean = options.showTestFailures !== undefined ? options.showTestFailures! : true
  // @ts-ignore - When tsc runs, it considers this a failure since danger is undefined
  const workspace: string = options.workspace !== undefined ? options.workspace : danger.github.pr.base.repo.name

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
      findFailures(testsFailures, workspace)
    }
  } else {
    warn(`:mag: Can't find xcpretty report at \`${currentPath}\`, skipping generating Xcode Report.`)
  }
}

function findFailures(testFailures: any, workspace: string) {
  for (const testSuite in testFailures) {
    if (testFailures.hasOwnProperty(testSuite)) {
      const suiteFailures = testFailures[testSuite]

      suiteFailures.forEach((failure: any) => {
        const newFail = new TestFailure(failure, testSuite, workspace)
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
