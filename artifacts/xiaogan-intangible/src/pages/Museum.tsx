import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useListHeritageItems } from "@workspace/api-client-react";
import { Search, Utensils, Scissors, Users, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

const levelColors: Record<string, string> = {
  national: "bg-primary text-white",
  provincial: "bg-[#8B4513] text-white",
  municipal: "bg-[#2F4F4F] text-white",
};

const levelLabels: Record<string, string> = {
  national: "国家级",
  provincial: "省级",
  municipal: "市级",
};

export default function Museum() {
  const [activeLevel, setActiveLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useListHeritageItems({ limit: 100 });

  const categories = [
    {
      id: "taste",
      name: "舌尖上的孝感",
      icon: <Utensils className="w-5 h-5" />,
      desc: "麻糖、米酒、云梦鱼面等美食非遗",
    },
    {
      id: "craft",
      name: "指尖上的孝感",
      icon: <Scissors className="w-5 h-5" />,
      desc: "雕花剪纸、应城膏雕、安陆木雕",
    },
    {
      id: "folk",
      name: "民俗里的孝感",
      icon: <Users className="w-5 h-5" />,
      desc: "董永传说、皮影戏、高龙旱船",
    },
  ];

  const allItems = data?.items || [];

  const filteredItems = useMemo(() => {
    let result = allItems;
    if (activeLevel !== "all") {
      result = result.filter((i) => i.level === activeLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          (i.shortDesc && i.shortDesc.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allItems, activeLevel, searchQuery]);

  const tabs = [
    { id: "all", label: "全部非遗", count: allItems.length },
    {
      id: "national",
      label: "国家级",
      count: allItems.filter((i) => i.level === "national").length,
    },
    {
      id: "provincial",
      label: "省级",
      count: allItems.filter((i) => i.level === "provincial").length,
    },
    {
      id: "municipal",
      label: "市级",
      count: allItems.filter((i) => i.level === "municipal").length,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border py-16">
        <div className="container mx-auto px-4">
          <SectionHeading title="孝感非遗数字馆" subtitle="Digital Museum" />

          {/* Three Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-background border border-border p-6 rounded-2xl hover:border-primary hover:shadow-lg transition-all text-center group cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-serif font-bold text-xl mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex bg-card p-1 rounded-xl shadow-sm border border-border flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLevel(tab.id)}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
                  activeLevel === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={clsx(
                      "text-xs px-1.5 py-0.5 rounded-full font-bold",
                      activeLevel === tab.id
                        ? "bg-white/20"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索非遗项目..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            共找到{" "}
            <span className="text-primary font-semibold">
              {filteredItems.length}
            </span>{" "}
            项非遗
            {searchQuery && <span>（搜索："{searchQuery}"）</span>}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">暂无相关非遗项目</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveLevel("all");
              }}
              className="mt-4 text-primary hover:underline text-sm"
            >
              清除筛选条件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={
                      item.name === "孝感剪纸（民间）"
                        ? "https://ts1.tc.mm.bing.net/th/id/R-C.b7f1958268be8c446eede4230d4bbb0f?rik=Y70F5t%2fdSJJ%2f8w&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20190925%2f69cab7450ae0445e8481dce1795bd544.JPG&ehk=64wTiqE9fpK8i%2fRUvoxX9OWM%2bdeZX9P5uwv5zuc2pJA%3d&risl=&pid=ImgRaw&r=0"
                        : item.imageUrl?.startsWith("/")
                          ? `${import.meta.env.BASE_URL}${item.imageUrl.slice(1)}`
                          : item.imageUrl
                    }
                    alt={`${item.name} - 孝感${item.category}非遗项目`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={clsx(
                        "px-2.5 py-1 text-xs font-bold rounded-md shadow-sm",
                        levelColors[item.level] || "bg-gray-500 text-white",
                      )}
                    >
                      {levelLabels[item.level] || item.level}
                    </span>
                    {item.xiaoTheme && (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-md shadow-sm bg-amber-500 text-white">
                        孝文化
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <div className="text-xs text-primary font-bold mb-1.5">
                    {item.category}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {item.shortDesc}
                  </p>
                  <Link
                    href={`/museum/${item.id}`}
                    className="w-full py-2.5 bg-background border border-border hover:bg-primary hover:text-white hover:border-primary rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 group/btn"
                  >
                    查看详情
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
