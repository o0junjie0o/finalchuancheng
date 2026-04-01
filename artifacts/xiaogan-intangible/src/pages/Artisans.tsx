import { motion } from "framer-motion";
import { Link } from "wouter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Award, Calendar, ChevronRight } from "lucide-react";

export default function Artisans() {
  // Mock data representing artisans
  const artisans = [
    {
      id: 1,
      name: "管丽芳",
      level: "国家级",
      item: "孝感雕花剪纸",
      years: 50,
      avatar:
        "https://ts1.tc.mm.bing.net/th/id/R-C.abfd04315437b9a9cf7dbb8734f84a1a?rik=yPapn7WMp%2fsiVA&riu=http%3a%2f%2fhbrbapp.hubeidaily.net%2f0158121e-fb70-4448-bbb8-6c14492a7cac&ehk=Jz%2bQ3xSfDQvflP%2f%2b1Gs1inqp9EplELQXJiGT8y2YR8M%3d&risl=&pid=ImgRaw&r=0",
      services: ["剪纸体验课", "私人定制"],
    },
    {
      id: 2,
      name: "秦礼刚",
      level: "国家级",
      item: "云梦皮影戏",
      years: 48,
      avatar:
        "https://pic.baike.soso.com/ugc/baikepic2/15422/20220506120818-1761484793_jpeg_600_338_42950.jpg/0",
      services: ["皮影表演预约", "皮影制作工坊"],
    },
    {
      id: 3,
      name: "何宣川",
      level: "省级",
      item: "孝感麻糖",
      years: 30,
      avatar:
        "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015/osbMtC7oBSnD9NQDvFeVfIKeBqMDQACZRwCE8A~tplv-dy-cropcenter:323:430.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_PUBLISH&sc=cover&se=true&sh=323_430&x-expires=2089778400&x-signature=q9IgZ0A6YzDnPJvbpQl22WVudRM%3D",
      services: ["手工麻糖礼盒定制"],
    },
    {
      id: 4,
      name: "伍柏林",
      level: "省级",
      item: "应城膏雕",
      years: "40",
      avatar:
        "https://p3-sdbk2-media.byteimg.com/tos-cn-i-xv4ileqgde/a9dce9a00c9f4d2ab12b75af21f3a75d~tplv-xv4ileqgde-cspdq:256:256:q30.image",
      services: ["石膏摆件定制"],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="大匠风范 · 薪火相传"
            subtitle="Inheritors of Heritage"
          >
            每一位传承人都是一本活着的历史书。在这里，您可以直接与手艺人对话，预约线下体验课程，或定制专属的非遗艺术品。
          </SectionHeading>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {artisans.map((artisan, i) => (
            <motion.div
              key={artisan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col sm:flex-row bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all"
            >
              <div className="sm:w-2/5 aspect-square sm:aspect-auto relative overflow-hidden">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                <div className="absolute bottom-4 left-4 sm:hidden text-white">
                  <h3 className="text-2xl font-serif font-bold">
                    {artisan.name}
                  </h3>
                  <p className="text-sm opacity-90">{artisan.item}</p>
                </div>
              </div>

              <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="hidden sm:block mb-1">
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      {artisan.name}
                    </h3>
                    <p className="text-primary font-medium">{artisan.item}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md">
                      <Award className="w-3.5 h-3.5" /> {artisan.level}传承人
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted text-muted-foreground text-xs font-bold rounded-md">
                      <Calendar className="w-3.5 h-3.5" /> 从艺 {artisan.years}{" "}
                      年
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">
                      可预约服务
                    </div>
                    <ul className="space-y-2">
                      {artisan.services.map((svc, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                          {svc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={`/artisans/${artisan.id}`}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-background border-2 border-primary/20 hover:border-primary text-primary font-bold rounded-xl transition-colors group"
                >
                  进入专属主页
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
