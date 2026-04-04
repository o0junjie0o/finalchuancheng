import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";

type Activity = {
  id: number;
  title: string;
  img: string;
  status: "ongoing" | "upcoming" | "past";
  date: string;
  location: string;
  totalQuota: number;
  registered: number;
};

const activities: Activity[] = [
  {
    id: 1,
    title: "孝感雕花剪纸体验工坊",
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    status: "upcoming",
    date: "2026-04-20 09:00–12:00",
    location: "孝感市非遗传习所（孝南区槐荫大道88号）",
    totalQuota: 30,
    registered: 18,
  },
  {
    id: 2,
    title: "云梦皮影戏专场演出",
    img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800",
    status: "ongoing",
    date: "2026-04-05 19:00–21:00",
    location: "云梦县文化馆大剧场",
    totalQuota: 200,
    registered: 186,
  },
  {
    id: 3,
    title: "汉川善书进校园公益活动",
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    status: "upcoming",
    date: "2026-05-10 14:00–16:30",
    location: "孝感市实验小学报告厅",
    totalQuota: 150,
    registered: 72,
  },
  {
    id: 4,
    title: "孝感麻糖手工制作体验",
    img: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800",
    status: "upcoming",
    date: "2026-04-27 10:00–12:00",
    location: "孝感市非遗美食坊（孝南区中山路56号）",
    totalQuota: 20,
    registered: 20,
  },
  {
    id: 5,
    title: "董永传说文化节开幕式",
    img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800",
    status: "past",
    date: "2026-03-15 10:00–17:00",
    location: "孝感市董永公园主广场",
    totalQuota: 500,
    registered: 500,
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
    const signUpList = JSON.parse(localStorage.getItem("activitySignUps") || "[]");
    const isRepeat = signUpList.some(
      (item: any) => 
        item.activityId === currentActivity.id && 
        item.phone === formData.phone
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
    setActivityList(prev =>
      prev.map(act =>
        act.id === currentActivity.id
          ? { ...act, registered: act.registered + 1 }
          : act
      )
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
            // 判断按钮是否可用
            const canSignUp = remainingQuota > 0 && ["ongoing", "upcoming"].includes(act.status);

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
                          act.status === "ongoing"
                            ? "bg-red-100 text-red-600"
                            : act.status === "upcoming"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {act.status === "ongoing"
                          ? "进行中"
                          : act.status === "upcoming"
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
                        名额限制：{act.totalQuota}人（已报{act.registered}人，剩余{remainingQuota}人）
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
              <h3 className="text-xl font-bold mb-4">报名 {currentActivity.title}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    placeholder="请输入您的姓名"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                  <input
                    type="tel"
                    placeholder="请输入11位手机号"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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