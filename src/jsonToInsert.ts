import fs from "fs/promises"
import path from "path"
import crypto from "crypto"
import { Shop } from "./types/Shop"
import { ShopCard } from "./types/ShopCard"

const sourcePath = path.join(__dirname, "../shop.json")
const outputPath = path.join(__dirname, "../insert.sql")

function jsonToShop(s: ShopCard): Shop {
  const hash = crypto.createHash("md5")
  const [postalCode, address] = s.address.split("\n")
  const [genre, area] = s.tags

  return {
    id: hash.update(s.name).digest().toString("hex"),
    name: s.name.replace(/'/g, "''"),
    postal_code: postalCode.trim(),
    address: address.trim(),
    area,
    genre,
    launch: false,
  }
}

async function main(): Promise<void> {
  await fs.access(sourcePath)

  const json = await fs.readFile(sourcePath)
  const obj = JSON.parse(json.toString())

  await fs.writeFile(
    outputPath,
    "insert into shops(id, name, postalCode, address, area, genre, launch) values\n"
  )

  const items = [...obj]
    .map(jsonToShop)
    .map((s) => Object.values(s).map((v) => `'${v}'`))
    .map((s) => `(${s.join(",")})`)
  await fs.appendFile(outputPath, items.join(",\n"))
  await fs.appendFile(outputPath, ";")
}

main()
  .catch((e) => console.error(e))
  .finally(() => {
    console.log("done")
  })
