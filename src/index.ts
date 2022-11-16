import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { downloadAndCreateShopData } from './scraping.js'
import { area, genre } from './targetData.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const distDir = path.join(__dirname, '../data')
try {
  await fs.promises.access(distDir, fs.constants.R_OK | fs.constants.W_OK)
} catch (e) {
  if ((e as any).code === 'ENOENT') {
    await fs.promises.mkdir(distDir, { recursive: true })
  }
}

const promiseList = Object.entries(area).map(([key, id]) => downloadAndCreateShopData(id, key, genre, distDir))
const result = await Promise.allSettled(promiseList)

const failedTasks = result.filter((r): r is PromiseRejectedResult => r.status === 'rejected')
failedTasks.forEach((r) => console.error(r.reason))
if (failedTasks.length > 0) {
  process.exit(1)
}
