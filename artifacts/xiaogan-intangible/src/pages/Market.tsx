import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Market() {
  const { toast } = useToast();

  const base = import.meta.env.BASE_URL;
  const products = [
    { id: 1, name: "百孝图 雕花剪纸长卷", price: 280, author: "管丽芳工作室", image: `${base}images/products/p1-papercut-100xiao.png`, rating: 5.0 },
    { id: 2, name: "云梦皮影 装饰挂件", price: 68, author: "秦礼刚传习所", image: `${base}images/products/p5-shadow-wusong.png`, rating: 4.8 },
    { id: 3, name: "孝感麻糖 孝心礼盒装", price: 128, author: "孝感市非遗工坊", image: `${base}images/products/p3-masugar-giftbox.png`, rating: 4.9 },
    { id: 4, name: "应城膏雕 平安如意摆件", price: 450, author: "李志明", image: `${base}images/products/m4-plaster-ruyi.png`, rating: 5.0 },
    { id: 5, name: "大学生设计 剪纸风书签", price: 35, author: "湖北工程学院团队", image: `${base}images/products/p4-papercut-bookmarks.png`, rating: 4.7 },
    { id: 6, name: "汉川善书 经典唱段珍藏U盘", price: 88, author: "汉川文化局", image: `${base}images/products/m6-shanshu-usb.png`, rating: 4.9 },
  ];

  const handleAddToCart = (name: string) => {
    toast({
      title: "已加入购物车",
      description: `【${name}】已成功加入，您可以继续选购。`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-16">
        <SectionHeading title="非遗文创市集" subtitle="Creative Market" align="left">
          带走一份属于孝感的记忆。这里汇聚了国家级传承人的原件手作、高校学子的创新设计以及品牌联名的非遗美食礼盒。
        </SectionHeading>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {["全部商品", "大师原件", "青年文创", "非遗美食"].map(t => (
            <button key={t} className="px-5 py-2 whitespace-nowrap bg-card border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
              <div className="aspect-square overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground mb-1">{p.author}</div>
                <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-1">{p.name}</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-primary font-bold text-xl">¥{p.price}</div>
                  <div className="flex items-center text-xs text-yellow-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" /> {p.rating}
                  </div>
                </div>

                <button 
                  onClick={() => handleAddToCart(p.name)}
                  className="w-full py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> 加入购物车
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
