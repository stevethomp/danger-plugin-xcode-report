import { generateXcodeReport } from "./index"

declare const global: any

describe("generateXcodeReport()", () => {
  beforeEach(() => {
    global.warn = jest.fn()
    global.message = jest.fn()
    global.fail = jest.fn()
    global.markdown = jest.fn()
    global.danger = {
      github: {
        pr: { title: "My Test Title", base: { repo: { name: "testRepo" } } },
        utils: { fileLinks: jest.fn(() => "github.com/filelink") },
      },
    }
  })

  afterEach(() => {
    global.warn = undefined
    global.message = undefined
    global.fail = undefined
    global.markdown = undefined
    global.danger = undefined
  })

  it("Needs a real json file", () => {
    generateXcodeReport({})

    expect(global.warn).toHaveBeenCalledWith(
      ":mag: Can't find xcpretty report at `./build/reports/errors.json`, skipping generating Xcode Report."
    )
  })

  it("Checks nothing was posted", () => {
    generateXcodeReport({
      pathToReport: "./fixtures/errors.json",
      showMessageTestSummary: false,
      showTestFailures: false,
    })

    expect(global.message).not.toHaveBeenCalled()
    expect(global.warn).not.toHaveBeenCalled()
    expect(global.fail).not.toHaveBeenCalled()
    expect(global.markdown).not.toHaveBeenCalled()
  })

  it("Checks summary message was posted", () => {
    generateXcodeReport({
      pathToReport: "./fixtures/errors.json",
      showMessageTestSummary: true,
      showTestFailures: false,
    })

    expect(global.message).toHaveBeenCalledWith(
      "Executed 166 tests, with 4 failures (0 unexpected) in 0.234 (0.309) seconds"
    )
  })

  it("Checks test failures were failed", () => {
    generateXcodeReport({
      pathToReport: "./fixtures/errors.json",
      showMessageTestSummary: false,
      showTestFailures: true,
    })

    expect(global.fail).toHaveBeenCalledTimes(3)
    expect(global.fail).toHaveBeenCalledWith(
      '**Tests.NotificationTests - testDisplayName:** XCTAssertEqual failed: ("Test failed!\ngithub.com/filelink'
    )
    expect(global.fail).toHaveBeenCalledWith(
      '**Tests.NotificationTests - testOther:** XCTAssertEqual failed: ("Test failed!\ngithub.com/filelink'
    )
    expect(global.fail).toHaveBeenCalledWith(
      '**Tests.MoreTests - testMore:** XCTAssertEqual failed: ("Test failed!\ngithub.com/filelink'
    )
  })
})
