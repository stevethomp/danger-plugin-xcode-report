export class TestFailure {
  testSuite: string
  filePath: string
  reason: string
  testCase: string

  constructor(object: any, testSuite: string) {
    this.testSuite = testSuite
    this.filePath = object["file_path"] as string
    this.reason = object["reason"] as string
    this.testCase = object["test_case"] as string
  }
  /** Formats a message for the test failure */
  formattedMessage() {
    return `**${this.testSuite} - ${this.testCase}:** ${this.reason}\n${this.formattedFilePath()}`
  }
  /**
   * Takes a filePath and turns it into an HTML formatted link, with line number
   */
  formattedFilePath(): string {
    // Users/steven/Aequilibrium/repos/kinzoo-ios/KinzooTests/Model/ApprovalTests.swift:58
    // converts to =>
    // KinzooTests/Model/ApprovalTests.swift#L31
    // @ts-ignore
    const name = danger.github.pr.base.repo.name
    const fileUrlPath = this.filePath.split(`${name}/`)[1].replace(":", "#L")
    // @ts-ignore
    return danger.github.utils.fileLinks([`${fileUrlPath}`])
  }
}
