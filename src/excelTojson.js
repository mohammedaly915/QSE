const xlsx = require("xlsx")
const fs = require("fs")

// const workbook = xlsx.readFile("GAHAR 2025.xlsx")
const workbook = xlsx.readFile("Upgrade from GAHAR 2021 to GAHAR 2025.xlsx")
const sheet = workbook.Sheets[workbook.SheetNames[0]]

const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 })

let currentCategory = ""
const result = { "GAHAR (2021 to GAHAR 2025)": {} }

rows.forEach(row => {

  const value = row[0]
  if (!value) return

  // لو السطر Category
  if (
    value === "QSE: 1.Organization" ||
    value === "QSE: 2.Customer Focus" ||
    value === "QSE: 3.Facilities and Safety" ||
    value === "QSE: 4.Personnel Management" ||
    value === "QSE: 5.Supplier and Inventory Management" ||
    value === "QSE: 6.Equipment Management" ||
    value === "QSE: 7.Process Management" ||
    value === "QSE: 8.Documents and Records Management" ||
    value === "QSE: 9.Information Management" ||
    value === "QSE: 10.Non-conforming Events Management" ||
    value === "QSE: 11.Assessments" ||
    value === "General QSE: 12.Continual Improvement"
  ) {
    currentCategory = value

    if (!result["GAHAR (2021 to GAHAR 2025)"][currentCategory]) {
      result["GAHAR (2021 to GAHAR 2025)"][currentCategory] = []
    }

  } else {
    result["GAHAR (2021 to GAHAR 2025)"][currentCategory].push({
      question: value
    })
  }

})

fs.writeFileSync("gahar2021to2025.json", JSON.stringify(result, null, 2))