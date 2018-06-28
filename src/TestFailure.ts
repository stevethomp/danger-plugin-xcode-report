export class TestFailure {
  testSuite: string
  filePath: string
  reason: string
  testCase: string
  workspace: string

  constructor(object: any, testSuite: string, workspace: string) {
    this.testSuite = testSuite
    this.workspace = workspace
    this.filePath = object["file_path"] as string
    this.reason = object["reason"] as string
    this.testCase = object["test_case"] as string
  }
  /** Formats a message for the test failure */
  formattedMessage() {
    return `**${this.testSuite} - ${this.testCase}:** \`${this.reason.trim()}\`\n${this.formattedFilePath()}`
  }
  /**
   * Takes a filePath and turns it into an HTML formatted link, with line number
   */
  formattedFilePath(): string {
    // Users/me/TestRepo/repos/workspace/Tests/NameTests.swift:58
    // converts to =>
    // Tests/NameTests.swift#L31
    // In tests and production danger is either present or mocked, so we can safely ignore the next line.
    const splitFilePath = this.filePath.split(`${this.workspace}/`)[1]
    if (splitFilePath !== undefined && typeof splitFilePath === "string") {
      const fileUrlPath = splitFilePath.replace(":", "#L")
      // @ts-ignore
      return danger.github.utils.fileLinks([`${fileUrlPath}`])
    } else {
      return ""
    }
  }
}
