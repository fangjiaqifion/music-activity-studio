import { GAMES } from "./core.mjs";

const game = (id, name, description) => {
  const { image } = GAMES.find((item) => item.id === id);
  return { id, name, description, image: `assets/${image}.png` };
};

const worksheet = (slug, name, description, href = `${slug}.html`) => ({
  name,
  description,
  image: `assets/preview_${slug}.jpg`,
  href,
});

export const catalog = [
  {
    id: "staff",
    label: "五线谱与识谱",
    entries: [
      worksheet("balloons", "线间涂色", "看音头落在哪里，给气球选颜色。"),
      worksheet("cows", "高低音谱号", "用黑色和棕色区分奶牛身上的两种谱号。"),
      worksheet("cheesecake", "线音还是间音", "观察蛋糕上的音符，选 S 或 L。"),
      worksheet("ladybirds", "画音符", "数到指定的线或间，再放上音符。"),
      worksheet("sunshine", "比音高", "看第二个音是升高、降低，还是原地不动。"),
      worksheet("treble", "移动高音谱号", "先找到 G 所在的线，再数出目标音。"),
      worksheet("bass", "移动低音谱号", "以谱号标出的 F 为起点，推算目标音。"),
      worksheet("alto", "移动中音谱号", "从谱号指向的 C 出发，逐线逐间找音。"),
      worksheet("fish-notes", "音名配谱", "把带有音名和八度的小鱼连到对应的谱面。"),
      worksheet("pitch-motion", "音符怎么走", "看两个音隔多远，判断是级进、跳进、远跳还是重复。"),
      worksheet("note-houses", "音符小镇", "把音符送回大谱表上的家，再找楼上楼下的邻居。"),
      worksheet("staff-race", "五线谱竞走", "两人轮流掷骰子，让音符沿着线和间逐格竞走。"),
    ],
  },
  {
    id: "keyboard",
    label: "钢琴键盘与指法",
    entries: [
      worksheet("hands", "左右手与指号", "认出手的方向，从大拇指到小指依次编号。"),
      worksheet("keyboard", "键盘分组", "涂出黑键，再圈出完整的 C 到 B 音组。"),
      worksheet("key-notes", "看谱找琴键", "先圈选对应的键组，再点出谱上的白键。"),
      worksheet("fish-keys", "小鱼配键名", "把带字母的小鱼放到标记琴键对应的位置。"),
      worksheet("key-names", "白键音名", "在完整键盘上看标记，从 A 到 G 选一个字母。"),
    ],
  },
  {
    id: "pitch",
    label: "音名与听辨",
    entries: [
      worksheet("sea-neighbors", "相邻音名", "从左到右读三格，点选空白处缺少的字母。"),
      worksheet("sea-solfege", "唱名版海底世界", "从左到右读三格，点选空白处缺少的唱名。", "sea-neighbors.html?notation=solfege"),
      worksheet("pitch-direction", "音名找树叶", "从左到右读音名，把它们连到走势相同的树叶组。"),
      worksheet("pitch-stairs", "上行还是下行", "读三个音名，选上行或下行的台阶。", "pitch-direction.html?exercise=stairs"),
      game("detective", "音名侦探", "顺着或倒着读五格，找出问号藏住的字母。"),
      game("ocean", "音名配唱名", "看到小鲸鱼带来的字母，选出对应的固定唱名。"),
      game("bingo", "音乐 Bingo", "听口令找字母和八度，标记到连成一线。"),
    ],
  },
  {
    id: "harmony",
    label: "音程与和弦",
    entries: [
      worksheet("fish-steps", "全音与半音", "看小鱼身上的两个音名，用红蓝标出距离。"),
      game("builder", "搭音程与和弦", "在键盘上选两个或三个音，听一听组合。"),
    ],
  },
  {
    id: "rhythm",
    label: "节奏与创作",
    entries: [
      game("shop", "节奏商店", "把不同时值的音符放进篮子，凑够订单拍数。"),
      game("dice", "节奏骰子", "改写格子里的节奏，选一条路线播放四拍。"),
    ],
  },
];
