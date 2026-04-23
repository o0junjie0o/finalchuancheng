import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";

type Activity = {
  id: number;
  title: string;
  img: string;
  date: string;
  location: string;
  totalQuota: number;
  registered: number;
};

type ActivityStatus = "ongoing" | "upcoming" | "past";

// 基于活动日期字符串自动计算状态
// 支持格式: "2026-04-28 09:00–12:00" 兼容多种连字符: – — - ~ 至
function getActivityStatus(dateStr: string): ActivityStatus {
  const match = dateStr.match(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})\s*[–—\-~至]\s*(\d{1,2}):(\d{2})/,
  );
  if (!match) {
    // 解析失败时按"已结束"处理，避免误开放过期/无效活动报名
    if (typeof console !== "undefined") {
      console.warn(`[Activities] 无法解析活动时间: "${dateStr}"`);
    }
    return "past";
  }
  const [, day, sH, sM, eH, eM] = match;
  const start = new Date(
    `${day}T${sH.padStart(2, "0")}:${sM.padStart(2, "0")}:00`,
  ).getTime();
  const end = new Date(
    `${day}T${eH.padStart(2, "0")}:${eM.padStart(2, "0")}:00`,
  ).getTime();
  const now = Date.now();
  if (now > end) return "past";
  if (now >= start) return "ongoing";
  return "upcoming";
}

const activities: Activity[] = [
  {
    id: 1,
    title: "孝感雕花剪纸体验工坊",
    img: `${import.meta.env.BASE_URL}images/activities/a1-papercut-workshop.png`,
    date: "2026-04-28 09:00–12:00",
    location: "孝感市非遗传习所（孝南区槐荫大道88号）",
    totalQuota: 100,
    registered: 56,
  },
  {
    id: 2,
    title: "云梦皮影戏专场演出",
    img: `${import.meta.env.BASE_URL}images/activities/a2-shadow-show.png`,
    date: "2026-04-27 14:00–16:00",
    location: "湖北工程学院",
    totalQuota: 80,
    registered: 64,
  },
  {
    id: 3,
    title: "汉川善书进校园公益活动",
    img: `${import.meta.env.BASE_URL}images/activities/a3-shanshu-campus.png`,
    date: "2026-04-29 14:00–16:30",
    location: "湖北工程学院湛林体育馆",
    totalQuota: 150,
    registered: 104,
  },
  {
    id: 4,
    title: "孝感麻糖手工制作体验",
    img: `${import.meta.env.BASE_URL}images/activities/a4-masugar-workshop.png`,
    date: "2026-04-30 10:00–12:00",
    location: "孝感市非遗美食坊（孝南区中山路56号）",
    totalQuota: 50,
    registered: 20,
  },
  {
    id: 5,
    title: "董永传说文化节开幕式",
    img: `${import.meta.env.BASE_URL}images/activities/a5-dongyong-festival.png`,
    date: "2026-04-01 13:00–17:00",
    location: "孝感市董永公园主广场",
    totalQuota: 80,
    registered: 70,
  },
  {
    id: 6,
    title: "应城膏雕艺术精品展",
    img: `${import.meta.env.BASE_URL}images/activities/a6-plaster-exhibition.png`,
    date: "2026-05-18 09:00–17:00",
    location: "孝感市博物馆（孝南区文化路9号）",
    totalQuota: 200,
    registered: 78,
  },
  {
    id: 7,
    title: "楚剧经典剧目《百日缘》全本展演",
    img: `${import.meta.env.BASE_URL}images/activities/a7-chuopera.png`,
    date: "2026-06-28 19:00–21:30",
    location: "孝感大剧院（孝南区交通大道188号）",
    totalQuota: 600,
    registered: 312,
  },
  {
    id: 8,
    title: "云梦皮影制作技艺暑期工作坊",
    img: `${import.meta.env.BASE_URL}images/activities/a8-shadow-craft.png`,
    date: "2026-08-08 09:00–11:30",
    location: "云梦县秦礼刚皮影传习所",
    totalQuota: 40,
    registered: 12,
  },
  {
    id: 9,
    title: "杨店高龙文化巡演",
    img: `${import.meta.env.BASE_URL}images/activities/a9-gaolong-dragon.png`,
    date: "2026-10-17 10:00–12:00",
    location: "孝昌县杨店镇老街",
    totalQuota: 300,
    registered: 0,
  },
  {
    id: 10,
    title: "2026孝感非遗年度盛典",
    img: `${import.meta.env.BASE_URL}images/activities/a10-yearend-gala.png`,
    date: "2026-12-12 18:30–21:30",
    location: "湖北工程学院体育馆",
    totalQuota: 1000,
    registered: 0,
  },
];

export default function Activities() {
  const [activityList, setActivityList] = useState<Activity[]>(activities);
  // 报名弹窗状态
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // 打开报名弹窗
  const handleOpenSignUp = (activity: Activity) => {
    setCurrentActivity(activity);
    setShowModal(true);
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentActivity(null);
    setFormData({ name: "", phone: "" });
  };

  // 提交报名
  const handleSubmitSignUp = () => {
    if (!currentActivity) return;

    // 前端校验
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("请填写姓名和手机号");
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      alert("请输入正确的11位手机号");
      return;
    }

    // 本地存储防重复报名
    const signUpList = JSON.parse(
      localStorage.getItem("activitySignUps") || "[]",
    );
    const isRepeat = signUpList.some(
      (item: any) =>
        item.activityId === currentActivity.id && item.phone === formData.phone,
    );
    if (isRepeat) {
      alert("您已报名过该活动，请勿重复报名");
      return;
    }

    // 新增报名记录
    const newSignUp = {
      activityId: currentActivity.id,
      name: formData.name,
      phone: formData.phone,
      signUpTime: new Date().toISOString(),
    };
    signUpList.push(newSignUp);
    localStorage.setItem("activitySignUps", JSON.stringify(signUpList));

    // 更新已报名人数
    setActivityList((prev) =>
      prev.map((act) =>
        act.id === currentActivity.id
          ? { ...act, registered: act.registered + 1 }
          : act,
      ),
    );

    alert(`✅ 报名成功！您已成功报名【${currentActivity.title}】`);
    handleCloseModal();
  };

  // 👇 活动列表渲染（替换你当前的map循环部分）
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-16">
        {/* 活动列表 */}
        <div className="flex flex-col gap-6">
          {activityList.map((act) => {
            // 计算剩余名额
            const remainingQuota = act.totalQuota - act.registered;
            // 根据当前时间动态计算活动状态
            const status = getActivityStatus(act.date);
            // 判断按钮是否可用
            const canSignUp =
              remainingQuota > 0 && (status === "ongoing" || status === "upcoming");

            return (
              <div
                key={act.id}
                className="flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 活动图片 */}
                <div className="md:w-1/3 xl:w-1/4">
                  <img
                    src={act.img}
                    alt={act.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>

                {/* 活动信息 */}
                <div className="p-6 md:w-2/3 xl:w-3/4 flex flex-col justify-between">
                  <div>
                    {/* 状态标签 */}
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                          status === "ongoing"
                            ? "bg-red-100 text-red-600"
                            : status === "upcoming"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {status === "ongoing"
                          ? "进行中"
                          : status === "upcoming"
                            ? "即将开始"
                            : "已结束"}
                      </span>
                    </div>

                    {/* 活动标题 */}
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                      {act.title}
                    </h3>

                    {/* 活动详情 */}
                    <div className="space-y-2 text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary/60" />
                        {act.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary/60" />
                        {act.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary/60" />
                        名额限制：{act.totalQuota}人（已报{act.registered}
                        人，剩余{remainingQuota}人）
                      </div>
                    </div>
                  </div>

                  {/* 报名按钮（改造你当前的静态按钮） */}
                  <div className="mt-6 flex justify-end">
                    <button
                      className={`px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm ${
                        canSignUp
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!canSignUp}
                      onClick={() => handleOpenSignUp(act)}
                    >
                      {canSignUp
                        ? "立即报名"
                        : remainingQuota <= 0
                          ? "名额已满"
                          : "活动已结束"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 报名弹窗（完整页面设计） */}
        {showModal && currentActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-bold mb-4">
                报名 {currentActivity.title}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    placeholder="请输入您的姓名"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    手机号
                  </label>
                  <input
                    type="tel"
                    placeholder="请输入11位手机号"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  onClick={handleCloseModal}
                >
                  取消
                </button>
                <button
                  className="flex-1 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                  onClick={handleSubmitSignUp}
                >
                  确认报名
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
