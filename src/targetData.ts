export const area = {
  // It takes so long time to enable this
  osakashi: 'area01',
  sakai: 'area02',
  toyonaka: 'area03',
  mishima: 'area04',
  kitakawachi: 'area05',
  nakakawachi: 'area06',
  senboku: 'area07',
  sennan: 'area08',
  minamikawachi: 'area09',
}

export interface Genre {
  id: string
  t: string
}

export const genre: Genre[] = [
  { id: 'category_all', t: 'すべてのジャンル' },
  // { id: 'feas_0_1_0', t: '居酒屋' },
  // { id: 'feas_0_1_1', t: '和食' },
  // { id: 'feas_0_1_2', t: '寿司・魚料理' },
  // { id: 'feas_0_1_3', t: 'うどん・そば' },
  // { id: 'feas_0_1_4', t: '鍋' },
  // { id: 'feas_0_1_5', t: 'お好み焼き・たこ焼き' },
  // { id: 'feas_0_1_6', t: 'ラーメン・つけ麺' },
  // { id: 'feas_0_1_7', t: '郷土料理' },
  // { id: 'feas_0_1_8', t: '洋食・西洋料理' },
  // { id: 'feas_0_1_9', t: 'カレー' },
  // { id: 'feas_0_1_10', t: '焼肉・ホルモン' },
  // { id: 'feas_0_1_11', t: 'イタリアン・フレンチ' },
  // { id: 'feas_0_1_12', t: '中華料理' },
  // { id: 'feas_0_1_13', t: 'アジア・エスニック料理' },
  // { id: 'feas_0_1_14', t: 'カフェ・スイーツ' },
  // { id: 'feas_0_1_15', t: 'ホテルレストラン' },
  { id: 'feas_0_1_16', t: 'その他' },
]
