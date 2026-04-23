import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-primary/10 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-lg">
                <span className="text-primary-foreground font-serif font-bold text-xl">孝</span>
              </div>
              <span className="font-serif font-bold text-2xl text-primary tracking-widest">孝感非遗</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              国内首个以“孝文化”为核心串联全品类非遗的数字化平台。致力于孝感非遗的数字化展示、传承与创新体验，让传统文化在数字时代焕发新生。
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-foreground">快速链接</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/museum" className="text-muted-foreground hover:text-primary transition-colors">非遗数字馆</Link></li>
              <li><Link href="/artisans" className="text-muted-foreground hover:text-primary transition-colors">传承人阵地</Link></li>
              <li><Link href="/ai-studio" className="text-muted-foreground hover:text-primary transition-colors">AI文创工坊</Link></li>
              <li><Link href="/market" className="text-muted-foreground hover:text-primary transition-colors">文创市集</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-foreground">联系我们</h4>
            <ul className="flex flex-col gap-3 text-muted-foreground">
              <li>地址：湖北工程学院机器人创新实验室</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} 版权归  湖北工程学院机器人创新实验室  所有
          </p>
        </div>
      </div>
    </footer>
  );
}
