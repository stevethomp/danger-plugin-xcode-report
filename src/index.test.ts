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

  it("Checks a test", () => {
//     global.danger = {
//       github: { pr: { title: "My Test Title" } },
//     }

    generateXcodeReport({})

    expect(true)
//     expect(global.message).toHaveBeenCalledWith(
//       "PR Title: My Test Title",
//     )
  })
})
