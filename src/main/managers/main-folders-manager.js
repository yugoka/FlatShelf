//------------------------------------
// フォルダーの読み込み/書き込み for メインプロセス
//------------------------------------
class FoldersManager {
  getStructure() {
    return [
      {
        id: 1,
        name: "親フォルダ1",
        children: [
          {
            id: 4,
            name: "子フォルダ1",
            children: [
              {
                id: 6,
                name: "孫フォルダ",
                children: [
                  {
                    id: 7,
                    name: "ひひひ孫フォルダ"
                  },
                ]
              },
            ]
          },
          {
            id: 5,
            name: "子フォルダ2"
          },
        ]
      },
      {
        id: 2,
        name: "親フォルダ2"
      }
    ]
  }
}

export const folders = new FoldersManager()
