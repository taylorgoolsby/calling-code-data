
import path from 'path'
import fs from 'fs'
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const dataPath = path.resolve(__dirname, './data.json')
const data = JSON.parse(fs.readFileSync(dataPath, {encoding: 'utf-8'}))

export default data