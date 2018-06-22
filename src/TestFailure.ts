import { danger } from "./";

export class TestFailure {
  testSuite: string;
  file_path: string;
  reason: string;
  test_case: string;
  constructor(object: any, testSuite: string) {
    this.testSuite = testSuite;
    this.file_path = object["file_path"] as string;
    this.reason = object["reason"] as string;
    this.test_case = object["test_case"] as string;
  }
  /**
   * Takes the file_path from the failure and turns it into an HTML formatted link, with line number
   */
  formattedFilePath() {
    // Users/steven/Aequilibrium/repos/kinzoo-ios/KinzooTests/Model/ApprovalTests.swift:58
    // converts to =>
    // KinzooTests/Model/ApprovalTests.swift#L31
    let name = danger.github.pr.base.repo.name
    let fileUrlPath = this.file_path.split(`${name}/`)[1].replace(":", "#L");
    return danger.github.utils.fileLinks([`${fileUrlPath}`]);
  }
  /** Formats a message for the test failure */
  formattedMessage() {
    return `**${this.testSuite} - ${this.test_case}:** ${this.reason}\n${this.formattedFilePath()}`;
  }
}