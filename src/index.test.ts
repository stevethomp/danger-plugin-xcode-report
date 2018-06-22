import { generateXcodeReport } from "./index"

declare const global: any

describe("generateXcodeReport()", () => {
  beforeEach(() => {
    global.warn = jest.fn()
    global.message = jest.fn()
    global.fail = jest.fn()
    global.markdown = jest.fn()
  })

  afterEach(() => {
    global.warn = undefined
    global.message = undefined
    global.fail = undefined
    global.markdown = undefined
  })

  it("Needs a real json file", () => {
    generateXcodeReport({})

    expect(global.warn).toHaveBeenCalledWith(
      ":mag: Can't find xcpretty report at `./build/reports/errors.json`, skipping generating Xcode Report."
    )
  })

  it("Checks nothing was posted", () => {
    global.danger = {
      github: { pr: { title: "My Test Title", base: { repo: { name: "testRepo" } } }, utils: { fileLinks: jest.fn() } }
    }
  
    generateXcodeReport({ pathToReport: "./fixtures/errors.json", showMessageTestSummary: false, showTestFailures: false })

    expect(global.message).not.toHaveBeenCalled()
    expect(global.warn).not.toHaveBeenCalled()
    expect(global.fail).not.toHaveBeenCalled()
    expect(global.markdown).not.toHaveBeenCalled()
  })

  it("Checks summary message was posted", () => {
    global.danger = {
      github: { pr: { title: "My Test Title", base: { repo: { name: "testRepo" } } }, utils: { fileLinks: jest.fn() } }
    }
  
    generateXcodeReport({ pathToReport: "./fixtures/errors.json", showMessageTestSummary: true, showTestFailures: false })

    expect(global.message).toHaveBeenCalledWith(
      "Executed 166 tests, with 4 failures (0 unexpected) in 0.234 (0.309) seconds",
    )
  })
})
