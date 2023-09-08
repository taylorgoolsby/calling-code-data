import fs from "fs";
import * as prettier from 'prettier'

const sourceTable = fs.readFileSync("./source.html", { encoding: "utf-8" });

const tdOuterHtmls = sourceTable.match(/<td.*?<\/td>/gs);

const data = new Map();

for (const line of tdOuterHtmls) {
  const innerMatches = line.match(/>(.*?)</gs) || []; // only select stuff between tags.
  const innerString = innerMatches
    .join("")
    .replaceAll(/[^0-9:,a-zA-Z—*]/g, "") // Remove irrelevant characters, like parentheses.
    .replaceAll(/nbsp/gi, "") // remove nbsp
    .replaceAll(/([A-Z][A-Z])([A-Z][A-Z])/g, "$1,$2") // Place a `,` between country codes.
    .replaceAll(/ambig/g, "?") // Lowercase letters will be removed, so replace ambig with a special character.
    .replaceAll(/[A-Z][a-z]/g, "") // Remove combinations of uppercase characters which are paired with a lowercase character.
    .replaceAll(/[a-z]/g, "") // Remove lowercase characters.
    .replaceAll(/—/g, "-"); // Replace long dash with regular dash.
  const keyValuePairs = innerString.replace(/([A-Z])(\d)/g, "$1;$2").split(";");

  // console.log('line', line)
  // console.log('innerMatches', innerMatches)
  // console.log('innerString', innerString)
  // console.log('keyValuePairs', keyValuePairs)

  for (const pair of keyValuePairs) {
    const callingCode = pair.split(":")[0];
    if (!callingCode) {
      continue;
    }
    const countryCodes = pair.split(":")[1]?.split(",") || [];

    // verify countryCodes
    if (!countryCodes.length) {
      throw new Error(`No country codes found for ${callingCode}.`);
    }
    for (const countryCode of countryCodes) {
      const isAmbig = countryCode === "?";
      const isUnassigned = countryCode === "-";
      const isNonGeo = countryCode === "**";
      const isCountryCode = !!countryCode.match(/^[A-Z][A-Z]$/g);
      if (!isCountryCode && !isAmbig && !isUnassigned && !isNonGeo) {
        throw new Error(`${countryCode} is not a valid country code.`);
      }
    }

    const isAmbig = !!countryCodes.find(countryCode => countryCode === "?");
    if (isAmbig) {
      // An ambigous cell is an incomplete calling code.
      continue
    }

    if (!data.has(callingCode)) {
      data.set(callingCode, countryCodes);
    } else {
      throw new Error(`${callingCode} was found in two different cells.`);
    }
  }
}



// let dataFile = `export default ${JSON.stringify(data)}`
let dataFile = 'const callingCodeData = {\n'
for (const [key, value] of data) {
  dataFile += `"${key}": ${JSON.stringify(value)},\n`
}
dataFile += "}\n"

const allCallingCodes = Array.from(data.keys())

dataFile += `
export const allCallingCodes = ${JSON.stringify(allCallingCodes)}
export const geographicCallingCodes = allCallingCodes.filter(callingCode => !callingCodeData[callingCode].includes('-') && !callingCodeData[callingCode].includes('**'))
export default callingCodeData
`

dataFile = await prettier.format(dataFile, {parser: 'flow'})

fs.writeFileSync("./index.js", dataFile, {
  encoding: "utf-8",
});
