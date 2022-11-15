import puppeteer from "puppeteer"
import fs from "fs"
import path from "path"
import { ShopCard } from "./types/ShopCard"

const sleep = (n: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, n * 1000)
  })

const area = {
  // all: "area_all",
  // north: "feas_0_0_0",
  // south: "feas_0_0_1",
  // osakaCasle: "feas_0_0_2",
  abeno: "feas_0_0_3",
  // bayarea: "feas_0_0_4",
  // hokusetsu: "feas_0_0_5",
  // kitakawachi: "feas_0_0_6",
  // nakakawachi: "feas_0_0_7",
  minamikawachi: "feas_0_0_8",
  // sensyu: "feas_0_0_9",
}

const genre = [
  {
    id: "feas_0_1_0",
    t: "居酒屋",
  },
  {
    id: "feas_0_1_1",
    t: "和食",
  },
  {
    id: "feas_0_1_2",
    t: "寿司・魚料理",
  },
  {
    id: "feas_0_1_3",
    t: "うどん・そば",
  },
  {
    id: "feas_0_1_4",
    t: "鍋",
  },
  {
    id: "feas_0_1_5",
    t: "お好み焼き・たこ焼き",
  },
  {
    id: "feas_0_1_6",
    t: "ラーメン・つけ麺",
  },
  {
    id: "feas_0_1_7",
    t: "郷土料理",
  },
  {
    id: "feas_0_1_8",
    t: "洋食・西洋料理",
  },
  {
    id: "feas_0_1_9",
    t: "カレー",
  },
  {
    id: "feas_0_1_10",
    t: "焼肉・ホルモン",
  },
  {
    id: "feas_0_1_11",
    t: "イタリアン・フレンチ",
  },
  {
    id: "feas_0_1_12",
    t: "中華料理",
  },
  {
    id: "feas_0_1_13",
    t: "アジア・エスニック料理",
  },
  {
    id: "feas_0_1_14",
    t: "カフェ・スイーツ",
  },
  {
    id: "feas_0_1_15",
    t: "ホテルレストラン",
  },
  {
    id: "feas_0_1_16",
    t: "その他",
  },
  // {
  //   "id": "feas_0_2_0",
  //   "t": "ダブルでおトク！WaO特典"
  // }
]

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto("https://goto-eat.weare.osaka-info.jp/gotoeat/", {
    waitUntil: "domcontentloaded",
  })

  // 取得したいエリアのチェックボックスにチェックを入れる
  for (const [_, id] of Object.entries(area)) {
    await page.evaluate((id) => {
      document.getElementById(id)?.click()
    }, id)
  }

  // 取得したいジャンルのチェックボックスにチェックを入れる
  for (const { id } of genre) {
    await page.evaluate((id) => {
      document.getElementById(id)?.click()
    }, id)
  }

  // 検索し結果が表示されるのを待つ
  await Promise.all([
    page.click("#feas-submit-button-0"),
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  ])

  const distFilePath = path.join(__dirname, "../shop.json")
  const file = fs.createWriteStream(distFilePath)

  let pageCounter = 0
  let shopInfoList: ShopCard[] = []

  // 次のページが無くなるまでデータを取得する
  while (await page.$(".nextpostslink")) {
    console.log(`Reading page${++pageCounter}`)
    const shopList =
      (await page.evaluate(() => {
        function cardToObj(dom: HTMLLIElement): ShopCard {
          const tableContent = dom.querySelectorAll("td")
          const tags = Array.from(
            dom.querySelectorAll<HTMLLIElement>(".tag_list li")
          ).map((li) => li.innerText)

          return {
            name: dom.querySelector("p")?.innerText ?? "",
            address: tableContent[0].innerText ?? "",
            tel: tableContent[1].innerText ?? "",
            tags,
            url: dom.querySelector("a")?.href ?? "",
          }
        }

        const list =
          document
            .querySelector(".search_result_box ul")
            ?.querySelectorAll<HTMLLIElement>("ul:not(.tag_list) > li") || []
        return Array.from(list).map(cardToObj)
      })) || []

    for (const s of shopList) {
      shopInfoList.push(s)
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.evaluate(() => {
        document.querySelector<HTMLAnchorElement>(".nextpostslink")?.click()
      }),
    ])
  }

  // 重複データを削除
  const mapBase = shopInfoList.map<[string, ShopCard]>((s) => [s.name, s])
  const shopMap = new Map(mapBase)
  file.write(JSON.stringify([...shopMap.values()], null, 2))
  file.close()

  await browser.close()
})()
