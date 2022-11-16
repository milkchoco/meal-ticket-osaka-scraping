export const area = {
  // It takes so long time to enable this
  //all: 'area_all',
  north: 'feas_0_0_0',
  south: 'feas_0_0_1',
  osakaCasle: 'feas_0_0_2',
  abeno: 'feas_0_0_3',
  bayarea: 'feas_0_0_4',
  hokusetsu: 'feas_0_0_5',
  kitakawachi: 'feas_0_0_6',
  nakakawachi: 'feas_0_0_7',
  minamikawachi: 'feas_0_0_8',
  sensyu: 'feas_0_0_9',
}

export interface Genre {
  id: string
  t: string
}

export const genre: Genre[] = [
  {
    id: 'feas_0_1_0',
    t: '居酒屋',
  },
  {
    id: 'feas_0_1_1',
    t: '和食',
  },
  {
    id: 'feas_0_1_2',
    t: '寿司・魚料理',
  },
  {
    id: 'feas_0_1_3',
    t: 'うどん・そば',
  },
  {
    id: 'feas_0_1_4',
    t: '鍋',
  },
  {
    id: 'feas_0_1_5',
    t: 'お好み焼き・たこ焼き',
  },
  {
    id: 'feas_0_1_6',
    t: 'ラーメン・つけ麺',
  },
  {
    id: 'feas_0_1_7',
    t: '郷土料理',
  },
  {
    id: 'feas_0_1_8',
    t: '洋食・西洋料理',
  },
  {
    id: 'feas_0_1_9',
    t: 'カレー',
  },
  {
    id: 'feas_0_1_10',
    t: '焼肉・ホルモン',
  },
  {
    id: 'feas_0_1_11',
    t: 'イタリアン・フレンチ',
  },
  {
    id: 'feas_0_1_12',
    t: '中華料理',
  },
  {
    id: 'feas_0_1_13',
    t: 'アジア・エスニック料理',
  },
  {
    id: 'feas_0_1_14',
    t: 'カフェ・スイーツ',
  },
  {
    id: 'feas_0_1_15',
    t: 'ホテルレストラン',
  },
  {
    id: 'feas_0_1_16',
    t: 'その他',
  },
]
