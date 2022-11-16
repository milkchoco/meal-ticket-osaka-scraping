import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'
import type { Genre } from './targetData.js'
import type { ShopCard } from './types/ShopCard.js'

export async function downloadAndCreateShopData(area: string, areaKey: string, genreList: Genre[], distDir: string) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto('https://goto-eat.weare.osaka-info.jp/gotoeat/', {
    waitUntil: 'domcontentloaded',
  })

  // 取得したいエリアのチェックボックスにチェックを入れる
  await page.evaluate((area) => {
    document.getElementById(area)?.click()
  }, area)

  // 取得したいジャンルのチェックボックスにチェックを入れる
  for (const { id } of genreList) {
    await page.evaluate((id) => {
      document.getElementById(id)?.click()
    }, id)
  }

  // 検索し結果が表示されるのを待つ
  await Promise.all([page.click('#feas-submit-button-0'), page.waitForNavigation({ waitUntil: 'domcontentloaded' })])

  const distFilePath = path.join(distDir, `${areaKey}.json`)
  const file = fs.createWriteStream(distFilePath)

  let pageCounter = 0
  const shopInfoList: ShopCard[] = []

  console.log(`${areaKey} area scraping start`)
  // 次のページが無くなるまでデータを取得する
  while (await page.$('.nextpostslink')) {
    ++pageCounter / 10 === 0 && console.log(`${areaKey} area scraping working...`)

    const shopList =
      (await page.evaluate(() => {
        function cardToObj(dom: HTMLLIElement): ShopCard {
          const tableContent = dom.querySelectorAll('td')
          const tags = Array.from(dom.querySelectorAll<HTMLLIElement>('.tag_list li')).map((li) => li.innerText)

          return {
            name: dom.querySelector('p')?.innerText ?? '',
            address: tableContent[0].innerText ?? '',
            tel: tableContent[1].innerText ?? '',
            tags,
            url: dom.querySelector('a')?.href ?? '',
          }
        }

        const list =
          document.querySelector('.search_result_box ul')?.querySelectorAll<HTMLLIElement>('ul:not(.tag_list) > li') ||
          []
        return Array.from(list).map(cardToObj)
      })) || []

    for (const s of shopList) {
      shopInfoList.push(s)
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.evaluate(() => {
        document.querySelector<HTMLAnchorElement>('.nextpostslink')?.click()
      }),
    ])
  }

  // 重複データを削除
  const mapBase = shopInfoList.map<[string, ShopCard]>((s) => [s.name, s])
  const shopMap = new Map(mapBase)
  file.write(JSON.stringify([...shopMap.values()], null, 2))
  file.close()

  console.log(`${areaKey} area scraping done!!`)

  await browser.close()
}
