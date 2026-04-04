import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  HelpCircle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Swords,
  Clock,
  Medal,
  User,
} from "lucide-react";
import { clsx } from "clsx";

type LeaderEntry = { nickname: string; correct: number; time: number };
type CompPhase = "idle" | "nickname" | "playing" | "result";

const LEADERBOARD_KEY = "xiao-quiz-leaderboard-v1";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function loadLeaderboard(): LeaderEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) return JSON.parse(raw) as LeaderEntry[];
  } catch (_) {}
  return [];
}

function saveLeaderboard(board: LeaderEntry[]) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
}

function insertAndTrim(
  board: LeaderEntry[],
  entry: LeaderEntry,
): LeaderEntry[] {
  const next = [...board, entry];
  next.sort((a, b) => b.correct - a.correct || a.time - b.time);
  return next.slice(0, 10);
}

function isInTop10(board: LeaderEntry[], entry: LeaderEntry): boolean {
  if (board.length < 10) return true;
  const last = board[board.length - 1];
  return (
    entry.correct > last.correct ||
    (entry.correct === last.correct && entry.time <= last.time)
  );
}

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Competition mode state
  const [compPhase, setCompPhase] = useState<CompPhase>("idle");
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameError, setNicknameError] = useState(false);
  const [compQuestions, setCompQuestions] = useState<typeof questions>([]);
  const [compCurrentQ, setCompCurrentQ] = useState(0);
  const [compSelected, setCompSelected] = useState<number | null>(null);
  const [compShowResult, setCompShowResult] = useState(false);
  const [compCorrect, setCompCorrect] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>(() =>
    loadLeaderboard(),
  );
  const [myEntry, setMyEntry] = useState<LeaderEntry | null>(null);
  const [myInTop10, setMyInTop10] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions = [
    {
      id: 1,
      question:
        "孝感雕花剪纸于哪一年入选联合国教科文组织人类非物质文化遗产代表作名录？",
      options: ["2006年", "2009年", "2015年", "2020年"],
      correct: 1,
      explanation:
        "2009年，孝感雕花剪纸作为中国剪纸的子项目，入选世界级非物质文化遗产名录。",
    },
    {
      id: 2,
      question: "著名的《天仙配》故事发生地，也是董永的故乡在孝感哪个地方？",
      options: ["云梦县", "汉川市", "孝南区", "应城市"],
      correct: 2,
      explanation:
        "董永传说的核心发源地位于现今的孝感市孝南区，建有董永公园纪念这一经典孝文化故事。",
    },
    {
      id: 3,
      question: "《二十四孝》中「孝感动天」的主人公是谁？",
      options: ["舜", "尧", "禹", "启"],
      correct: 0,
      explanation:
        "虞舜因至孝感动天地，大象帮他耕田，小鸟帮他除草，尧帝闻其贤德将两女相嫁，后禅位于他。",
    },
    {
      id: 4,
      question: "「亲尝汤药」讲述的是哪位皇帝的孝行故事？",
      options: ["汉高祖刘邦", "汉文帝刘恒", "汉武帝刘彻", "汉光武帝刘秀"],
      correct: 1,
      explanation:
        "汉文帝刘恒以仁孝闻名，母亲卧病三年期间，他每次煎好汤药必先亲口尝试，确认温度适宜才端给母亲服用。",
    },
    {
      id: 5,
      question: "「啮指痛心」中，母亲咬手指召唤儿子的主人公是？",
      options: ["曾参", "子路", "闵损", "郯子"],
      correct: 0,
      explanation:
        "曾参入山打柴时，母亲因家中来客无措，咬破手指。曾参心中忽感剧痛，知母召唤，立即赶回家中。",
    },
    {
      id: 6,
      question: "「百里负米」中，子路为了供养父母做了什么？",
      options: [
        "百里之外打工赚钱",
        "百里之外背米回家",
        "百里之外求医问药",
        "百里之外砍柴卖钱",
      ],
      correct: 1,
      explanation:
        "子路家贫，父母嗜米，他常常翻越百里山路亲自背米回家供养父母，后来做了大官仍悔恨无法再尽此孝。",
    },
    {
      id: 7,
      question: "「芦衣顺母」中，闵损的继母用什么代替棉花给他做冬衣？",
      options: ["芦花", "柳絮", "棉絮", "鸭绒"],
      correct: 0,
      explanation:
        "闵损继母用芦花填充冬衣，导致闵损在寒冬驾车时无力控缰。父察真相欲休妻，闵损跪求母在一子寒，母去三子单。",
    },
    {
      id: 8,
      question: "「鹿乳奉亲」中，郯子为了给父母治病，假扮成什么动物取乳？",
      options: ["鹿", "羊", "牛", "马"],
      correct: 0,
      explanation:
        "郯子父母双目患疾需鹿乳治疗，郯子披上鹿皮混入鹿群取鹿乳，差点被猎人射中，猎人得知真相后深感其孝而放行。",
    },
    {
      id: 9,
      question: "「戏彩娱亲」中，老莱子用什么方式逗父母开心？",
      options: ["唱歌跳舞", "扮婴儿戏耍", "讲笑话", "变魔术"],
      correct: 1,
      explanation:
        "老莱子年逾七十仍穿五彩衣、持拨浪鼓在父母面前嬉笑，跌倒时故意学婴儿哭声，让父母开怀大笑。",
    },
    {
      id: 10,
      question: "「刻木事亲」中，丁兰用什么材料雕刻父母的像来侍奉？",
      options: ["木头", "石头", "玉石", "青铜"],
      correct: 0,
      explanation:
        "丁兰幼年父母双亡，用木头刻成双亲像供于堂上，每日三餐前请示、出入必禀告，如同父母仍在世一般。",
    },
    {
      id: 11,
      question: "「涌泉跃鲤」讲述的是哪位汉代女子的孝行？",
      options: ["姜诗之妻庞氏", "董永之妻七仙女", "黄香之母", "闵损之母"],
      correct: 0,
      explanation:
        "姜诗之妻庞氏与丈夫共同侍奉婆婆，每日跋涉数里取江水供婆婆饮用，孝心感动上苍，家门前涌出清泉并日日跃出鲤鱼。",
    },
    {
      id: 12,
      question: "「怀橘遗亲」中，陆绩在袁术家做客时，偷偷藏了什么送给母亲？",
      options: ["橘子", "桃子", "李子", "梨子"],
      correct: 0,
      explanation:
        "陆绩六岁随父拜访袁术，将橘子藏入怀中带回给母亲，被袁术发现后坦言欲归以遗母，袁术深为感叹。",
    },
    {
      id: 13,
      question: "「扇枕温衾」中，黄香为父亲做了什么？",
      options: [
        "夏天扇凉枕席，冬天暖热被褥",
        "夏天扇风降温，冬天烧火取暖",
        "夏天打扫房间，冬天铺好被褥",
        "夏天送水降温，冬天送衣保暖",
      ],
      correct: 0,
      explanation:
        "黄香九岁丧母后侍父极孝，夏天用扇子扇凉枕席驱走暑气，冬天用体温暖热被褥，再请父亲就寝，乡人称颂。",
    },
    {
      id: 14,
      question: "「行佣供母」中，江革为了供养母亲做了什么？",
      options: ["做佣人打工赚钱", "沿街乞讨", "种地务农", "经商做生意"],
      correct: 0,
      explanation:
        "江革少年丧父，战乱中背负母亲逃难，后因家贫无牛，自己充当耕牛拉犁，并做佣人赚钱供母，官府征辟皆以母老推辞。",
    },
    {
      id: 15,
      question: "「闻雷泣墓」中，王裒在雷雨时会做什么？",
      options: [
        "跑到母亲墓前陪伴",
        "在家中祭拜母亲",
        "为母亲祈祷",
        "为母亲扫墓",
      ],
      correct: 0,
      explanation:
        "王裒的母亲生前惧雷，去世后每逢雷雨，王裒必奔至墓前跪下安慰说儿在此，母亲不要害怕，数十年从未间断。",
    },
    {
      id: 16,
      question: "「哭竹生笋」中，孟宗为了给母亲治病，在冬天哭出了什么？",
      options: ["竹笋", "泉水", "药材", "粮食"],
      correct: 0,
      explanation:
        "孟宗之母重病想喝竹笋汤，时值严冬笋不生长。孟宗奔入竹林抱竹痛哭，孝心感动上苍，地裂数茎新笋，母亲服后病愈。",
    },
    {
      id: 17,
      question: "「卧冰求鲤」中，王祥为了给继母治病，在冰上做了什么？",
      options: ["卧冰融化取鲤鱼", "凿冰捕鱼", "冰上钓鱼", "破冰取水"],
      correct: 0,
      explanation:
        "王祥继母病重欲食鲜鱼，时值寒冬河水冻结，王祥解衣卧于冰上以体温融冰，冰忽自裂跃出两条鲤鱼，继母食后病愈。",
    },
    {
      id: 18,
      question: "「扼虎救父」中，杨香为了救父亲，徒手打死了什么？",
      options: ["老虎", "狼", "熊", "豹子"],
      correct: 0,
      explanation:
        "杨香年仅十四岁，随父割禾时猛虎扑向父亲，杨香手无寸铁，奋不顾身扑上去用双手死死掐住虎颈，老虎终将父亲放开。",
    },
    {
      id: 19,
      question: "「恣蚊饱血」中，吴猛为了让父母睡好，做了什么？",
      options: ["让蚊子吸自己的血", "用扇子驱蚊", "用蚊帐挡蚊", "用艾草熏蚊"],
      correct: 0,
      explanation:
        "吴猛八岁时家贫无蚊帐，夏夜不驱赶蚊子，让其在自己身上随意叮咬，待蚊子吸饱血后便不再去骚扰父母安睡。",
    },
    {
      id: 20,
      question: "「尝粪忧心」中，庾黔娄为了判断父亲的病情，做了什么？",
      options: ["品尝父亲的粪便", "为父亲把脉", "为父亲煎药", "为父亲祈祷"],
      correct: 0,
      explanation:
        "庾黔娄遵医嘱亲口品尝父亲粪便以判断吉凶，发现粪味甘甜为凶兆后悲痛不已，当夜向北斗星叩首祈祷以身代父受苦。",
    },
  ];

  // ---- Original quiz handlers ----
  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[currentQ].correct) {
      setScore((s) => s + 10);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      alert(`答题结束！得分：${score}`);
    }
  };

  const q = questions[currentQ];

  // ---- Competition mode handlers ----
  useEffect(() => {
    if (compPhase === "playing") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [compPhase]);

  const startNicknamePhase = () => setCompPhase("nickname");

  const confirmNickname = () => {
    const name = nicknameInput.trim();
    if (!name) {
      setNicknameError(true);
      return;
    }
    setNickname(name);
    setNicknameError(false);
    // Randomly pick 10 questions (no repeat)
    const shuffled = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setCompQuestions(shuffled);
    setCompCurrentQ(0);
    setCompSelected(null);
    setCompShowResult(false);
    setCompCorrect(0);
    setElapsed(0);
    setCompPhase("playing");
  };

  const handleCompSelect = (idx: number) => {
    if (compShowResult) return;
    setCompSelected(idx);
    setCompShowResult(true);
    if (idx === compQuestions[compCurrentQ].correct) {
      setCompCorrect((c) => c + 1);
    }
  };

  const handleCompNext = () => {
    if (compCurrentQ < compQuestions.length - 1) {
      setCompCurrentQ((q) => q + 1);
      setCompSelected(null);
      setCompShowResult(false);
    } else {
      // Finish: stop timer, save result
      if (timerRef.current) clearInterval(timerRef.current);
      const finalCorrect =
        compCorrect +
        (compSelected === compQuestions[compCurrentQ].correct ? 1 : 0);
      // Re-derive correct count to avoid stale closure
      // Actually, compCorrect already reflects previous answers; current answer already counted in handleCompSelect
      const entry: LeaderEntry = {
        nickname,
        correct:
          compCorrect +
          (compSelected === compQuestions[compCurrentQ].correct &&
          !compShowResult
            ? 1
            : 0),
        time: elapsed,
      };
      // Since handleCompSelect already incremented compCorrect before this runs:
      const finalEntry: LeaderEntry = {
        nickname,
        correct: compCorrect,
        time: elapsed,
      };
      const prevBoard = loadLeaderboard();
      const inTop = isInTop10(prevBoard, finalEntry);
      const newBoard = inTop ? insertAndTrim(prevBoard, finalEntry) : prevBoard;
      if (inTop) saveLeaderboard(newBoard);
      setLeaderboard(inTop ? newBoard : prevBoard);
      setMyEntry(finalEntry);
      setMyInTop10(inTop);
      setCompPhase("result");
    }
  };

  const handleCompNextWrapped = () => {
    // Need to compute final correct before state updates clear
    if (compCurrentQ < compQuestions.length - 1) {
      setCompCurrentQ((q) => q + 1);
      setCompSelected(null);
      setCompShowResult(false);
    } else {
      finishCompetition();
    }
  };

  const finishCompetition = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalEntry: LeaderEntry = {
      nickname,
      correct: compCorrect,
      time: elapsed,
    };
    const prevBoard = loadLeaderboard();
    const inTop = isInTop10(prevBoard, finalEntry);
    const newBoard = inTop ? insertAndTrim(prevBoard, finalEntry) : prevBoard;
    if (inTop) saveLeaderboard(newBoard);
    setLeaderboard(inTop ? newBoard : prevBoard);
    setMyEntry(finalEntry);
    setMyInTop10(inTop);
    setCompPhase("result");
  };

  const resetCompetition = () => {
    setCompPhase("idle");
    setNicknameInput("");
    setNickname("");
    setCompCurrentQ(0);
    setCompSelected(null);
    setCompShowResult(false);
    setCompCorrect(0);
    setElapsed(0);
    setMyEntry(null);
  };

  const cq = compQuestions[compCurrentQ];
  const medalColors = ["text-yellow-500", "text-slate-400", "text-amber-600"];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header banner */}
      <div className="bg-primary pt-16 pb-32 text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pattern-papercut"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/papercut-pattern.png)`,
          }}
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            非遗知识大闯关
          </h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            挑战你的非遗知识储备，赢取积分兑换麻糖米酒礼盒与手艺人体验课程！
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold">
            <Trophy className="text-yellow-400 w-5 h-5" /> 当前积分: {score}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-20 relative z-20 max-w-3xl space-y-8">
        {/* ---- Original quiz card ---- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-card rounded-3xl shadow-2xl border border-border p-8 md:p-12 mb-[40px]"
          >
            <div className="flex items-center gap-2 text-accent font-bold mb-6 text-sm tracking-wider">
              <HelpCircle className="w-5 h-5" /> 问题 {currentQ + 1} /{" "}
              {questions.length}
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8 leading-relaxed">
              {q.question}
            </h2>

            <div className="space-y-4">
              {q.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isCorrect = showResult && idx === q.correct;
                const isWrong = showResult && isSelected && idx !== q.correct;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showResult}
                    className={clsx(
                      "w-full text-left p-5 rounded-xl border-2 font-medium text-lg transition-all flex justify-between items-center",
                      !showResult &&
                        "border-border hover:border-primary hover:bg-primary/5",
                      isCorrect &&
                        "border-green-500 bg-green-50 text-green-700",
                      isWrong && "border-red-500 bg-red-50 text-red-700",
                      showResult &&
                        !isCorrect &&
                        !isWrong &&
                        "border-border opacity-50",
                    )}
                  >
                    <span>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </span>
                    {isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                    {isWrong && <XCircle className="w-6 h-6 text-red-600" />}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8 p-6 bg-muted/50 rounded-xl border border-border"
              >
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> 知识科普
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {q.explanation}
                </p>
                <button
                  onClick={handleNext}
                  className="mt-6 w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  {currentQ < questions.length - 1 ? "下一题" : "查看成绩榜"}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ---- Competition mode entry card ---- */}
        {compPhase === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-3xl border-2 border-primary/30 p-8 md:p-10 shadow-xl text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 mb-4">
              <Swords className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
              竞赛模式
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md mx-auto">
              随机抽取10道孝文化题目，限时答题，冲榜争夺排行榜前十！成绩永久保存，接受挑战吗？
            </p>
            <button
              onClick={startNicknamePhase}
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95"
            >
              <Swords className="w-5 h-5" /> 进入竞赛模式
            </button>
          </motion.div>
        )}
      </div>
      {/* ---- Nickname modal ---- */}
      <AnimatePresence>
        {compPhase === "nickname" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-card rounded-3xl shadow-2xl border border-border p-8 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 mb-3">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  输入你的昵称
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  昵称将显示在排行榜上
                </p>
              </div>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => {
                  setNicknameInput(e.target.value);
                  setNicknameError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && confirmNickname()}
                placeholder="请输入昵称（最多10字）"
                maxLength={10}
                className={clsx(
                  "w-full border-2 rounded-xl px-4 py-3 text-lg font-medium outline-none transition-all bg-background text-foreground placeholder:text-muted-foreground",
                  nicknameError
                    ? "border-red-400 focus:border-red-500"
                    : "border-border focus:border-primary",
                )}
                autoFocus
              />
              {nicknameError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> 昵称不能为空，请输入后再开始
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCompPhase("idle")}
                  className="flex-1 py-3 rounded-xl border-2 border-border font-bold text-muted-foreground hover:bg-muted/50 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={confirmNickname}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  开始竞赛
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ---- Competition playing overlay ---- */}
      <AnimatePresence>
        {compPhase === "playing" && cq && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-background"
          >
            {/* Competition header */}
            <div className="bg-primary text-primary-foreground pt-8 pb-16 px-4 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url(${import.meta.env.BASE_URL}images/papercut-pattern.png)`,
                }}
              />
              <div className="container mx-auto max-w-2xl relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold">
                    <Swords className="w-5 h-5" />
                    <span>竞赛模式</span>
                    <span className="opacity-70 text-sm font-normal ml-1">
                      · {nickname}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-bold text-lg tabular-nums">
                    <Clock className="w-4 h-4 text-yellow-300" />
                    {formatTime(elapsed)}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm opacity-80 mb-1.5">
                    <span>第 {compCurrentQ + 1} 题 / 共 10 题</span>
                    <span>已答对 {compCorrect} 题</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-yellow-300 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(compCurrentQ / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 max-w-2xl pb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={compCurrentQ}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-card rounded-3xl shadow-2xl border border-border p-8 md:p-10"
                >
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-7 leading-relaxed">
                    {cq.question}
                  </h2>
                  <div className="space-y-3">
                    {cq.options.map((opt, idx) => {
                      const isSelected = compSelected === idx;
                      const isCorrect = compShowResult && idx === cq.correct;
                      const isWrong =
                        compShowResult && isSelected && idx !== cq.correct;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleCompSelect(idx)}
                          disabled={compShowResult}
                          className={clsx(
                            "w-full text-left p-4 rounded-xl border-2 font-medium text-base transition-all flex justify-between items-center",
                            !compShowResult &&
                              "border-border hover:border-primary hover:bg-primary/5",
                            isCorrect &&
                              "border-green-500 bg-green-50 text-green-700",
                            isWrong && "border-red-500 bg-red-50 text-red-700",
                            compShowResult &&
                              !isCorrect &&
                              !isWrong &&
                              "border-border opacity-50",
                          )}
                        >
                          <span>
                            {String.fromCharCode(65 + idx)}. {opt}
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                          )}
                          {isWrong && (
                            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {compShowResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6"
                    >
                      <button
                        onClick={handleCompNextWrapped}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                      >
                        {compCurrentQ < compQuestions.length - 1
                          ? "下一题 →"
                          : "查看结果"}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ---- Competition result overlay ---- */}
      <AnimatePresence>
        {compPhase === "result" && myEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-background"
          >
            <div className="bg-primary text-primary-foreground pt-12 pb-20 px-4 relative overflow-hidden text-center">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url(${import.meta.env.BASE_URL}images/papercut-pattern.png)`,
                }}
              />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
                  <Trophy className="w-10 h-10 text-yellow-300" />
                </div>
                {myInTop10 ? (
                  <>
                    <h2 className="text-3xl font-serif font-bold mb-2">
                      恭喜进入排行榜！
                    </h2>
                    <p className="opacity-80 text-lg">
                      你的成绩已跻身前十，好一位孝文化达人！
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-serif font-bold mb-2">
                      答题完成！
                    </h2>
                    <p className="opacity-80 text-lg">
                      继续努力，下次冲击排行榜前十！
                    </p>
                  </>
                )}
                <div className="mt-6 inline-flex gap-6 bg-white/20 backdrop-blur-md px-8 py-3 rounded-2xl font-bold text-lg">
                  <span>答对 {myEntry.correct} / 10 题</span>
                  <span className="opacity-50">|</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {formatTime(myEntry.time)}
                  </span>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 max-w-2xl pb-12">
              <div className="bg-card rounded-3xl shadow-2xl border border-border p-6 md:p-8 rounded-tl-[24px] rounded-tr-[24px] rounded-br-[24px] rounded-bl-[24px] mt-[55px] mb-[55px]">
                <h3 className="text-xl font-serif font-bold text-foreground mb-5 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-primary" /> 孝文化知识排行榜
                </h3>

                {leaderboard.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    暂无记录，你是第一位挑战者！
                  </p>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((entry, i) => {
                      const isMe =
                        myInTop10 &&
                        entry.nickname === myEntry.nickname &&
                        entry.correct === myEntry.correct &&
                        entry.time === myEntry.time;
                      return (
                        <div
                          key={i}
                          className={clsx(
                            "flex items-center gap-4 px-5 py-3.5 rounded-xl border-2 transition-all",
                            isMe
                              ? "border-primary bg-primary/8 font-bold shadow-md shadow-primary/15"
                              : "border-border bg-muted/30",
                          )}
                        >
                          <span
                            className={clsx(
                              "text-xl font-black w-7 text-center shrink-0",
                              medalColors[i] ?? "text-muted-foreground",
                            )}
                          >
                            {i + 1}
                          </span>
                          <span
                            className={clsx(
                              "flex-1 font-medium truncate",
                              isMe && "text-primary font-bold",
                            )}
                          >
                            {entry.nickname}
                            {isMe && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                你
                              </span>
                            )}
                          </span>
                          <span
                            className={clsx(
                              "font-bold tabular-nums",
                              isMe ? "text-primary" : "text-foreground",
                            )}
                          >
                            {entry.correct} / 10
                          </span>
                          <span className="text-muted-foreground text-sm tabular-nums flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(entry.time)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Show my entry below if not in top 10 */}
                {!myInTop10 && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                      本次成绩（未进入前十）
                    </p>
                    <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl border-2 border-primary/40 bg-primary/5">
                      <span className="text-xl font-black w-7 text-center text-muted-foreground shrink-0">
                        —
                      </span>
                      <span className="flex-1 font-bold text-primary truncate">
                        {myEntry.nickname}
                        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          你
                        </span>
                      </span>
                      <span className="font-bold text-primary tabular-nums">
                        {myEntry.correct} / 10
                      </span>
                      <span className="text-muted-foreground text-sm tabular-nums flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(myEntry.time)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={resetCompetition}
                  className="mt-8 w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-lg"
                >
                  再次挑战
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
