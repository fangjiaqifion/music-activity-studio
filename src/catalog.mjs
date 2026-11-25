import { GAMES } from "./core.mjs";

const game = (id) => {
  const { name, tag, image } = GAMES.find((item) => item.id === id);
  return { id, name, topic: tag, image: `assets/${image}.png` };
};

const worksheet = (slug, name, topic) => ({
  name,
  topic,
  image: `assets/preview_${slug}.jpg`,
  href: `${slug}.html`,
});

export const catalog = [
  {
    id: "staff",
    label: "五线谱与识谱",
    entries: [
      worksheet("balloons", "气球里的线与间", "红蓝涂色 · 认识线音与间音"),
      worksheet("cows", "奶牛的谱号斑纹", "黑棕涂色 · 认识高低音谱号"),
      worksheet("cheesecake", "芝士蛋糕里的线与间", "圈选 S / L · 认识线音与间音"),
      worksheet("ladybirds", "请你画个音", "按线间位置画音符"),
      worksheet("sunshine", "两个音，比高低", "两个音符 · 比较高低"),
      worksheet("treble", "高音谱号的相对音高", "根据已知音 · 推算音名"),
      worksheet("bass", "低音谱号的相对音高", "根据已知音 · 推算音名"),
      worksheet("alto", "中音谱号的相对音高", "根据已知音 · 推算音名"),
      worksheet("fish-notes", "小鱼找音符", "音名与八度 · 五线谱配对"),
      worksheet("pitch-motion", "音符怎样走？", "辨认级进 · 跳进 · 远跳 · 重复"),
      worksheet("note-houses", "音符小镇", "送音符回家 · 找楼上楼下的邻居"),
    ],
  },
  {
    id: "keyboard",
    label: "钢琴键盘与指法",
    entries: [
      worksheet("hands", "我的左右手", "辨认左右手 · 五指指号"),
      worksheet("keyboard", "钢琴键盘", "黑键涂色 · 圈选完整音组"),
      worksheet("key-notes", "音符住在哪个琴键？", "看谱找键组 · 找琴键"),
      worksheet("fish-keys", "小鱼找琴键", "音名小鱼 · 配对标记琴键"),
      worksheet("key-names", "琴键叫什么？", "看标记琴键 · 选择音名"),
    ],
  },
  {
    id: "pitch",
    label: "音名与听辨",
    entries: [
      worksheet("sea-neighbors", "海底世界：找相邻音名", "观察已有音名 · 填出相邻音名"),
      game("detective"),
      game("ocean"),
      game("bingo"),
    ],
  },
  {
    id: "harmony",
    label: "音程与和弦",
    entries: [
      worksheet("fish-steps", "小鱼的全音与半音", "全音涂蓝 · 半音涂红"),
      game("builder"),
    ],
  },
  {
    id: "rhythm",
    label: "节奏与创作",
    entries: [
      game("shop"),
      game("dice"),
    ],
  },
];
