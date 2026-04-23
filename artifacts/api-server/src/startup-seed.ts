import { db } from "@workspace/db";
import {
  heritageItemsTable,
  artisansTable,
  productsTable,
  activitiesTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";

const HERITAGE_ITEMS = [
  {
    name: "董永传说",
    nameEn: "Legend of Dong Yong",
    level: "national",
    category: "民间文学",
    description:
      "董永传说是孝感最具代表性的非遗项目，讲述了东汉孝子董永卖身葬父，感动天地，与七仙女结缘的动人故事。这一传说深刻体现了中华孝文化的精髓，是孝感孝文化名城的核心IP。董永故里位于孝感市孝南区，保存有完好的董永公园、孝子祠、千年槐荫树等历史遗址。楚剧百日缘、黄梅戏天仙配均源于此传说，影响深远。",
    shortDesc: "孝感孝文化核心IP，天仙配传说发源地，孝子董永的动人故事",
    imageUrl: "/images/heritage/dongyong-legend.png",
    videoUrl: null,
    origin: "孝感市孝南区",
    yearListed: 2006,
    artisanCount: 3,
    tags: ["孝文化", "民间传说", "国家级", "世界影响"],
    featured: true,
    xiaoTheme: true,
  },
  {
    name: "孝感雕花剪纸",
    nameEn: "Xiaogan Paper Cutting",
    level: "national",
    category: "传统技艺",
    description:
      "孝感雕花剪纸是中国剪纸艺术中的精品，以精细镂空、多层叠加著称，代表作槐荫记、百孝图享誉国内外。其工艺分为画稿、剪刻、装裱三大步骤，讲究以刀代笔，每一件作品都是艺术精品。孝感雕花剪纸于2006年被列入第一批国家级非物质文化遗产名录，2009年随中国剪纸入选联合国教科文组织人类非物质文化遗产代表作名录，成为世界级非遗。",
    shortDesc: "精细镂空工艺，世界非遗，百孝图等孝主题作品闻名遐迩",
    imageUrl:
      "https://ts3.tc.mm.bing.net/th/id/OIP-C.3LOhcwq773pAUzvBba3ClgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
    videoUrl: null,
    origin: "孝感全市",
    yearListed: 2008,
    artisanCount: 8,
    tags: ["剪纸", "世界非遗", "国家级", "孝文化"],
    featured: true,
    xiaoTheme: true,
  },
  {
    name: "汉川善书",
    nameEn: "Hanchuan Shanshu",
    level: "national",
    category: "曲艺",
    description:
      "汉川善书是流行于孝感汉川地区的一种独特曲艺形式，演员通过说唱结合的方式，讲述劝善故事、弘扬传统美德，具有浓郁的地方特色。善书演出不用乐器伴奏，仅凭一人或数人的演唱，以其独特的演唱技艺和道德教化功能，深受当地群众喜爱。2011年被列入第三批国家级非物质文化遗产名录。",
    shortDesc: "汉川地区独特曲艺，以善书为名，劝善励德，国家级非遗",
    imageUrl:
      "https://yurenhao.sizhengwang.cn/upload/resources/image/2021/11/30/3788061.png",
    videoUrl: null,
    origin: "孝感市汉川市",
    yearListed: 2011,
    artisanCount: 5,
    tags: ["曲艺", "国家级", "劝善文化"],
    featured: true,
    xiaoTheme: false,
  },
  {
    name: "云梦皮影戏",
    nameEn: "Yunmeng Shadow Puppetry",
    level: "national",
    category: "传统戏剧",
    description:
      "云梦皮影戏历史悠久，以精湛的雕刻工艺和生动的表演技艺著称。皮影造型精美，线条流畅，栩栩如生。代表传承人秦礼刚的经典剧目董永传说、武松打虎享誉全国。云梦皮影戏的皮影制作采用手工雕刻，表演时以灯光投影，配合锣鼓声腔，呈现出独特的艺术魅力，是中国皮影戏的重要流派之一。",
    shortDesc: "国家级非遗，精美皮影造型，秦礼刚大师经典剧目享誉全国",
    imageUrl:
      "https://ts1.tc.mm.bing.net/th/id/OIP-C.jfoV33aCUELrcR1LuF3OYgHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
    videoUrl: null,
    origin: "孝感市云梦县",
    yearListed: 2006,
    artisanCount: 4,
    tags: ["皮影戏", "国家级", "传统戏剧"],
    featured: true,
    xiaoTheme: false,
  },
  {
    name: "三节龙·跳鼓",
    nameEn: "Three-Section Dragon Dance",
    level: "national",
    category: "传统舞蹈",
    description:
      "三节龙·跳鼓是孝感地区独具特色的民间舞蹈形式，将舞龙与跳鼓相结合，动感十足，场面壮观。表演时，舞龙者身着彩服，手持三节短龙，配合激昂的鼓声，翻腾跳跃，展现出勃勃生机。每逢节日庆典，三节龙·跳鼓必不可少，是孝感民间节庆文化的重要组成部分。",
    shortDesc: "舞龙与跳鼓结合，节日必演，孝感民间节庆文化精华",
    imageUrl:
      "https://ts1.tc.mm.bing.net/th/id/R-C.d9f79e7fe18d19a537bb9ae036600881?rik=Oaar2yuEWMeivw&riu=http%3a%2f%2fvip-public.people.com.cn%2fphoto%2f2019%2f12%2f6%2f34a348506e7c4d9fb2184504014fdfc6gTjg_s.jpg&ehk=jG5%2bGXrgnL2U32UZbR0O5Xteas7o3b2KH3uCBKb9E3w%3d&risl=&pid=ImgRaw&r=0",
    videoUrl: null,
    origin: "孝感市",
    yearListed: 2014,
    artisanCount: 2,
    tags: ["舞蹈", "国家级", "民间庆典"],
    featured: true,
    xiaoTheme: false,
  },
  {
    name: "楚剧",
    nameEn: "Chu Opera",
    level: "national",
    category: "传统戏剧",
    description:
      "楚剧是湖北地方戏曲的代表剧种，起源于孝感一带，以其浓郁的楚文化特色和接地气的表演风格深受湖北人民喜爱。楚剧唱腔丰富，表演细腻，剧目丰富，涵盖历史故事、民间传说等多类题材。百日缘、葛麻等经典剧目至今仍广为流传。楚剧是理解孝感及湖北地域文化的重要窗口。",
    shortDesc: "湖北地方戏曲代表，楚文化精髓，百日缘等经典剧目流传至今",
    imageUrl:
      "https://ts1.tc.mm.bing.net/th/id/R-C.8ade704b885c6c13ce47850f6426bef6?rik=aW5ckxEaCvChmg&riu=http%3a%2f%2fnews.cjn.cn%2fbsy%2fwl_20088%2f202403%2fW020240308689513732753.jpg&ehk=OilvjElpgG2%2fCaycroTNEHuoi1MG%2bGz%2fDCruGnjbNtE%3d&risl=&pid=ImgRaw&r=0",
    videoUrl: null,
    origin: "孝感市",
    yearListed: 2006,
    artisanCount: 6,
    tags: ["戏剧", "国家级", "楚文化"],
    featured: true,
    xiaoTheme: true,
  },
  {
    name: "孝感麻糖",
    nameEn: "Xiaogan Sesame Candy",
    level: "provincial",
    category: "传统美食",
    description:
      "孝感麻糖是孝感最著名的传统美食，已有千年历史。以优质芝麻和麦芽糖为主要原料，经过选料、炒制、熬糖、拉丝、成型等十余道工序精心制作而成。孝感麻糖色泽金黄，香甜酥脆，入口化渣，是孝感的地方特产名片，也是走亲访友的佳礼。每年产值超亿元，带动数千农民就业。",
    shortDesc: "千年传统美食，芝麻与麦芽糖精制，孝感特产名片",
    imageUrl:
      "https://img.phb123.com/uploads/allimg/220923/812-2209231P6290-L.jpg",
    videoUrl: null,
    origin: "孝感市区",
    yearListed: 2009,
    artisanCount: 12,
    tags: ["美食", "省级", "传统工艺"],
    featured: true,
    xiaoTheme: false,
  },
  {
    name: "孝感米酒",
    nameEn: "Xiaogan Rice Wine",
    level: "provincial",
    category: "传统美食",
    description:
      "孝感米酒以优质糯米为原料，采用传统酿造工艺，酒体醇厚，甜而不腻，深受孝感市民喜爱。孝感米酒酿造历史悠久，是当地节日、待客的传统饮品。其制作工艺包括泡米、蒸饭、拌曲、发酵、成品等步骤，全程手工操作，保留了原汁原味的传统风味。",
    shortDesc: "糯米酿造，传统工艺，孝感节日待客必备佳品",
    imageUrl:
      "https://ts1.tc.mm.bing.net/th/id/R-C.77fd01d39028f891f8135c20a3862bd3?rik=Cq1XXzAwXKeUOQ&riu=http%3a%2f%2fimg95.699pic.com%2fphoto%2f50111%2f8208.jpg_wh300.jpg!%2ffh%2f300%2fquality%2f90&ehk=0%2fS3bggQ1BNwbheo0IEDpgDSuBpvNYsAl2OjMEba4LU%3d&risl=&pid=ImgRaw&r=0",
    videoUrl: null,
    origin: "孝感市",
    yearListed: 2011,
    artisanCount: 8,
    tags: ["美食", "省级", "酿造"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "云梦鱼面",
    nameEn: "Yunmeng Fish Noodles",
    level: "provincial",
    category: "传统美食",
    description:
      "云梦鱼面是孝感云梦县的传统特色美食，以鲜鱼肉与面粉为原料，采用独特工艺制作而成。鱼面色泽洁白，口感细腻，营养丰富，是云梦人民世代相传的饮食瑰宝。制作鱼面需要将鲜鱼肉去骨去刺，与面粉混合揉制，经擀制、晾晒等工序而成。",
    shortDesc: "鱼肉与面粉合制，云梦特产，营养细腻口感独特",
    imageUrl:
      "https://img.phb123.com/uploads/allimg/220923/812-2209231P9230-L.jpg",
    videoUrl: null,
    origin: "孝感市云梦县",
    yearListed: 2013,
    artisanCount: 5,
    tags: ["美食", "省级", "特产"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "应城膏雕",
    nameEn: "Yingcheng Gypsum Carving",
    level: "provincial",
    category: "传统技艺",
    description:
      "应城膏雕是以应城出产的天然石膏为原料，经过雕刻、打磨、着色等工序制作而成的艺术品。应城是全国重要的石膏产地，膏雕工艺有百年以上历史。膏雕作品造型多样，题材丰富，从人物、动物到山水、花卉，无不惟妙惟肖。",
    shortDesc: "应城天然石膏精雕，百年工艺，造型栩栩如生",
    imageUrl:
      "https://ts1.tc.mm.bing.net/th/id/R-C.433b31291cf7637f55069413e8007d2a?rik=iNiuCkkPevvA1Q&riu=http%3a%2f%2ffile.hubeitoday.com.cn%2fupload%2fimage%2f20190402%2f1554196265412594.jpg&ehk=HZHVMFDZN2UVYcHK2ZZMr5Wzv3oH5kcbnlkrsUoMcmk%3d&risl=&pid=ImgRaw&r=0",
    videoUrl: null,
    origin: "孝感市应城市",
    yearListed: 2010,
    artisanCount: 6,
    tags: ["雕刻", "省级", "传统工艺"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "杨林乌壶",
    nameEn: "Yanglin Black Pottery",
    level: "provincial",
    category: "传统技艺",
    description:
      "杨林乌壶是孝感大悟县杨林镇的传统陶瓷工艺品，以当地特有的黑色陶土为原料，经手工成型、高温烧制而成。乌壶色泽深沉，造型古朴，具有极高的艺术价值和实用价值。杨林乌壶的制作工艺独特，烧制温度和时间的把握需要丰富经验。",
    shortDesc: "大悟杨林传统黑陶，古朴造型，传统制陶工艺精髓",
    imageUrl:
      "https://img.pconline.com.cn/images/upload/upc/tx/photoblog/2004/27/c2/205183942_1587961428790_mthumb.jpg",
    videoUrl: null,
    origin: "孝感市大悟县杨林镇",
    yearListed: 2012,
    artisanCount: 3,
    tags: ["陶瓷", "省级", "传统工艺"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "肖港抬故事",
    nameEn: "Xiaogang Carrying Parade",
    level: "provincial",
    category: "民俗",
    description:
      "肖港抬故事是孝感传统民俗活动，每逢节庆，当地居民将历史故事、神话传说以抬阁形式展演，由儿童扮演故事人物，被大人抬着游街，场面宏大壮观，充满浓郁的民间节日气息。",
    shortDesc: "传统节庆民俗，儿童扮演故事人物抬阁游街，场面壮观热闹",
    imageUrl: "/images/heritage/xiaogang-taigushi.png",
    videoUrl: null,
    origin: "孝感市孝昌县肖港镇",
    yearListed: 2015,
    artisanCount: 2,
    tags: ["民俗", "省级", "节庆活动"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "邹岗旱船",
    nameEn: "Zougang Dry Boat Dance",
    level: "municipal",
    category: "民俗",
    description:
      "邹岗旱船是孝感孝昌县邹岗镇的传统民俗表演，表演者套在彩船形道具中模拟行船动作，配合锣鼓音乐载歌载舞，场面热闹喜庆，是当地春节、元宵节期间的必备民俗活动。旱船制作精美，船身绘有吉祥图案，表演时充满喜庆气氛。",
    shortDesc: "彩船模拟行船，锣鼓伴奏载歌载舞，节庆必备民俗活动",
    imageUrl:
      "https://n.sinaimg.cn/sinacn10121/230/w2048h1382/20190730/082e-iaqfzyv0137066.jpg",
    videoUrl: null,
    origin: "孝感市孝昌县邹岗镇",
    yearListed: 2018,
    artisanCount: 3,
    tags: ["民俗", "市级", "节庆"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "杨店高龙",
    nameEn: "Yangdian Dragon Lantern",
    level: "municipal",
    category: "民俗",
    description:
      "杨店高龙是孝感孝南区杨店镇的传统民俗表演，高龙用竹篾扎制，外糊彩纸，内燃蜡烛，夜晚舞动时光彩夺目。每逢元宵节前后，数十条高龙同时上街巡游，场面蔚为壮观，是孝感市保存最完整的高龙民俗之一。",
    shortDesc: "竹篾扎制彩龙，内燃蜡烛夜晚光彩夺目，元宵节壮观巡游",
    imageUrl:
      "https://ts1.tc.mm.bing.net/th/id/R-C.5e8e4b2f381ac1adfa70dd59d0933c0c?rik=tImK34vU5C0npg&riu=http%3a%2f%2fnews.cjn.cn%2fhbpd_19912%2fwl_19920%2f202211%2fW020221118624097525915.png&ehk=agsa7k5QOAL%2fWb4WAWrfycu%2fw7B3UY90mJS9tE3PImc%3d&risl=&pid=ImgRaw&r=0",
    videoUrl: null,
    origin: "孝感市孝南区杨店镇",
    yearListed: 2016,
    artisanCount: 4,
    tags: ["民俗", "市级", "元宵节"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "安陆木雕",
    nameEn: "Anlu Wood Carving",
    level: "municipal",
    category: "传统技艺",
    description:
      "安陆木雕是孝感安陆市的传统木雕艺术，采用本地优质木材，以圆雕、浮雕、透雕等多种技法，雕刻人物、山水、花鸟等题材，作品精美细腻，具有浓郁的地方风格。安陆木雕广泛应用于建筑装饰、家具制作和艺术摆件，是孝感传统技艺的重要代表。",
    shortDesc: "圆雕浮雕透雕多技法，题材丰富，安陆传统建筑装饰精髓",
    imageUrl:
      "https://k.sinaimg.cn/n/sinakd20100/161/w1024h737/20210207/ea07-kirmaiu6088263.jpg/w700d1q75cms.jpg",
    videoUrl: null,
    origin: "孝感市安陆市",
    yearListed: 2017,
    artisanCount: 5,
    tags: ["雕刻", "市级", "传统工艺"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "汉川腊八豆",
    nameEn: "Hanchuan Laba Bean",
    level: "municipal",
    category: "传统美食",
    description:
      "汉川腊八豆是孝感汉川市的传统腌制食品，以黄豆为主料，经过蒸煮、发酵、腌制等工序制成，豆香浓郁，咸鲜可口，是当地居民世代相传的传统美食。腊八豆制作时间一般在腊月，取腊八节之意，寓意新年美好。",
    shortDesc: "黄豆发酵腌制，豆香浓郁咸鲜可口，腊月传统美食文化",
    imageUrl: "https://imgs.aixifan.com/o_1c4h1pt8q1ts7b1nbmv1m8i2ke23.jpg",
    videoUrl: null,
    origin: "孝感市汉川市",
    yearListed: 2019,
    artisanCount: 6,
    tags: ["美食", "市级", "腌制"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "黄滩酱油酿造技艺",
    nameEn: "Huangtan Soy Sauce Brewing",
    level: "municipal",
    category: "传统美食",
    description:
      "黄滩酱油酿造技艺是孝感云梦县黄滩镇的传统酿造工艺，历史悠久，采用当地优质黄豆、小麦为原料，经过长达数月的自然发酵酿造而成，色泽红润，香气醇厚，是云梦乃至孝感地区的传统调味品代表。",
    shortDesc: "数月自然发酵，色泽红润香气醇厚，云梦传统酱油酿造精髓",
    imageUrl:
      "https://boot-img.xuexi.cn/image/1005/process/c8e53b501aea43ec82323bc1ffee00ee.jpg",
    videoUrl: null,
    origin: "孝感市云梦县黄滩镇",
    yearListed: 2020,
    artisanCount: 4,
    tags: ["美食", "市级", "酿造"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "大悟山歌",
    nameEn: "Dawu Folk Songs",
    level: "municipal",
    category: "传统音乐",
    description:
      "大悟山歌是孝感大悟县的传统民间音乐，歌词多反映山区生活、劳动场景和爱情故事，曲调高亢悠扬，具有浓郁的山区民间音乐风格。大悟山歌在当地农耕劳作时广为传唱，是大悟山区人民精神生活的重要组成部分，现已被列为孝感市级非物质文化遗产。",
    shortDesc: "高亢悠扬山区民歌，反映劳动生活与爱情，大悟农耕文化精华",
    imageUrl:
      "https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c001/oUcYXAe79CAJKEInD1FfACgI601AG5Eh9ADjAC~tplv-dy-cropcenter:323:430.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_SEARCH&sc=cover&se=true&sh=323_430&x-expires=2089965600&x-signature=POgvwBvYYInn2m3mn7ruSfTac9o%3D",
    videoUrl: null,
    origin: "孝感市大悟县",
    yearListed: 2016,
    artisanCount: 2,
    tags: ["音乐", "市级", "民间音乐"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "应城皮影戏",
    nameEn: "Yingcheng Shadow Puppetry",
    level: "municipal",
    category: "传统戏剧",
    description:
      "应城皮影戏是孝感应城市的传统民间戏剧，与云梦皮影戏同属楚皮影体系，表演风格具有应城本地特色。应城皮影戏的皮影制作精美，表演内容多取材于民间故事和历史传说，是应城市重要的非物质文化遗产，深受当地群众喜爱。",
    shortDesc: "楚皮影体系应城流派，民间故事为题材，应城传统民间戏剧",
    imageUrl:
      "https://pic.nfapp.southcn.com/nfplus/ossfs/pic/xy/201903/23/407c46f0-9eda-49ad-896f-48aefb5df13c.jpg",
    videoUrl: null,
    origin: "孝感市应城市",
    yearListed: 2018,
    artisanCount: 3,
    tags: ["戏剧", "市级", "皮影"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "孝感剪纸（民间）",
    nameEn: "Xiaogan Folk Paper Cutting",
    level: "municipal",
    category: "传统技艺",
    description:
      "孝感民间剪纸是在国家级孝感雕花剪纸之外，广泛流传于孝感城乡的民间剪纸艺术。与精细的雕花剪纸不同，民间剪纸更加简洁生动，图案多为喜庆吉祥题材，在婚庆、节日中广泛使用，是孝感普通民众日常生活中的传统艺术表达。",
    shortDesc: "民间喜庆剪纸艺术，婚庆节日广泛应用，生动简洁贴近生活",
    imageUrl:
      "https://ts1.tc.mm.bing.net/th/id/R-C.b7f1958268be8c446eede4230d4bbb0f?rik=Y70F5t%2fdSJJ%2f8w&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20190925%2f69cab7450ae0445e8481dce1795bd544.JPG&ehk=64wTiqE9fpK8i%2fRUvoxX9OWM%2bdeZX9P5uwv5zuc2pJA%3d&risl=&pid=ImgRaw&r=0",
    videoUrl: null,
    origin: "孝感市各地",
    yearListed: 2015,
    artisanCount: 8,
    tags: ["剪纸", "市级", "民间艺术"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "马口窑陶瓷烧制技艺",
    nameEn: "Makou Kiln Ceramics",
    level: "municipal",
    category: "传统技艺",
    description:
      "马口窑陶瓷烧制技艺是孝感汉川市马口镇的传统陶瓷工艺，马口窑以生产彩绘陶瓷著称，器型多样，彩绘图案活泼生动，具有浓厚的民间艺术特色。马口窑陶瓷曾是长江流域重要的民间日用陶瓷产地，产品远销各地，现已成为收藏家追捧的文化遗产珍品。",
    shortDesc: "马口镇传统彩绘陶瓷，器型多样图案生动，长江流域民间陶瓷珍品",
    imageUrl: "https://www.cssn.cn/skgz/bwyc/202305/W020230524523444416698.jpg",
    videoUrl: null,
    origin: "孝感市汉川市马口镇",
    yearListed: 2017,
    artisanCount: 5,
    tags: ["陶瓷", "市级", "传统工艺"],
    featured: false,
    xiaoTheme: false,
  },
  {
    name: "云梦皮影（制作技艺）",
    nameEn: "Yunmeng Shadow Puppet Making",
    level: "municipal",
    category: "传统技艺",
    description:
      "云梦皮影制作技艺是云梦皮影戏的核心组成部分，单独列为孝感市级非遗加以保护。皮影制作以牛皮为原料，经过泡制、刮制、雕刻、上色、装订等十余道工序，制作出精美的皮影造型。这一技艺需要数年乃至数十年的专业训练，是高度精细化的传统手工艺。",
    shortDesc: "牛皮十余道工序精制，造型精美雕刻细腻，云梦皮影核心技艺",
    imageUrl:
      "https://ts1.tc.mm.bing.net/th/id/R-C.42c975291e1eeb5b9d591bb647c77771?rik=y6AKuQb%2bRKa6MA&riu=http%3a%2f%2fhbrbapp.hubeidaily.net%2f640X800_pub_CB20220514161501845061.jpg_a0725ef247d941349a4f04eb9986ac20.jpg&ehk=CaArJXfurQtbqEP%2bULkm%2fufkMAfzdyRKfrRPMC2p9IA%3d&risl=&pid=ImgRaw&r=0",
    videoUrl: null,
    origin: "孝感市云梦县",
    yearListed: 2016,
    artisanCount: 4,
    tags: ["技艺", "市级", "皮影制作"],
    featured: false,
    xiaoTheme: false,
  },
] as const;

const ARTISANS = [
  {
    name: "管丽芳",
    level: "国家级传承人",
    heritageItem: "孝感雕花剪纸",
    heritageItemId: 2,
    bio: "管丽芳是孝感雕花剪纸国家级代表性传承人，从事剪纸艺术40余年，作品槐荫记、百孝图享誉国内外，曾多次在国际非遗展中展出，获奖无数。她将雕花剪纸的精髓与孝文化深度融合，形成了独特的艺术风格。管老师长期在孝感市开展非遗进校园活动，致力于培养新一代剪纸传承人。",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    yearsOfPractice: 42,
    awards: [
      "湖北省工艺美术大师",
      "中国民间文艺最高奖山花奖",
      "联合国教科文组织非遗传承人认证",
    ],
  },
  {
    name: "秦礼刚",
    level: "国家级传承人",
    heritageItem: "云梦皮影戏",
    heritageItemId: 4,
    bio: "秦礼刚是云梦皮影戏国家级代表性传承人，出生于皮影世家，幼年随父学艺，精通皮影制作与表演。经典剧目董永传说、武松打虎影响广泛，曾应邀赴欧洲多国演出，将云梦皮影带向世界。秦老师每年在云梦举办皮影培训班，免费教授社区居民皮影制作技艺。",
    avatarUrl:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400",
    yearsOfPractice: 38,
    awards: [
      "湖北省民间艺术大师",
      "国家级非遗代表性传承人",
      "全国文化遗产年度人物",
    ],
  },
  {
    name: "徐忠德",
    level: "国家级传承人",
    heritageItem: "汉川善书",
    heritageItemId: 3,
    bio: "徐忠德是汉川善书国家级代表性传承人，从事善书演唱50余年，嗓音洪亮，表演生动，是汉川善书最具代表性的演唱艺术家。他整理、抢救了大量濒临失传的善书曲目，并创作了多部现代善书作品，将传统善书与现代主题结合，焕发新的生命力。",
    avatarUrl:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400",
    yearsOfPractice: 52,
    awards: ["汉川市文化名人", "湖北省曲艺家协会会员", "全国优秀民间艺人"],
  },
  {
    name: "何宣川",
    level: "省级传承人",
    heritageItem: "孝感麻糖",
    heritageItemId: 7,
    bio: "余达雄家族制作孝感麻糖已传承四代，他将传统工艺与现代食品安全标准相结合，在保持传统风味的同时，开发出多种口味的麻糖新品，深受年轻消费者喜爱。余师傅积极参与非遗进社区活动，让更多人了解麻糖的制作工艺和文化内涵。",
    avatarUrl:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400",
    yearsOfPractice: 30,
    awards: ["孝感市非遗传承人", "湖北省食品工匠", "孝感市劳动模范"],
  },
  {
    name: "李志明",
    level: "省级传承人",
    heritageItem: "应城膏雕",
    heritageItemId: 10,
    bio: "李志明是应城膏雕省级代表性传承人，从事膏雕艺术30余年，作品题材涵盖人物、山水、动物等，造型精美，工艺精湛。他创立了应城膏雕工作室，定期举办膏雕体验活动，吸引大量游客参与体验，推动了应城膏雕的活态传承。",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    yearsOfPractice: 32,
    awards: ["应城市工艺美术大师", "湖北省优秀非遗传承人", "孝感市文化贡献奖"],
  },
  {
    name: "张玉兰",
    level: "省级传承人",
    heritageItem: "孝感米酒",
    heritageItemId: 8,
    bio: "张玉兰是孝感�����酒省级代表性传承人，传承祖传酿酒技艺，坚持使用本地优质糯米和传统酒曲，酿造出醇香甘甜的孝感米酒。她创立了孝感米酒品牌，在保护传统工艺的同时，积极开拓线上销售渠道，让更多人品尝到正宗的孝感米酒。",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    yearsOfPractice: 25,
    awards: ["孝感市优秀传承人", "湖北省食品行业技术能手"],
  },
] as const;

const PRODUCTS = [
  {
    name: "百孝图雕花剪纸",
    category: "artisan_original",
    description:
      "管丽芳大师亲手制作，以百个孝字为创意，融合孝文化主题花纹，精心雕刻而成，附精美木质镜框，适合收藏或馈赠",
    price: 280,
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    artisanName: "管丽芳",
    heritageItem: "孝感雕花剪纸",
    stock: 15,
    rating: 4.9,
    reviewCount: 47,
  },
  {
    name: "皮影钥匙扣董永七仙女套装",
    category: "collab",
    description:
      "以云梦皮影戏的造型艺术为灵感，将董永与七仙女造型微缩为精美钥匙扣，传统皮影工艺与现代实用功能完美结合",
    price: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600",
    artisanName: "秦礼刚工作室",
    heritageItem: "云梦皮影戏",
    stock: 200,
    rating: 4.8,
    reviewCount: 128,
  },
  {
    name: "孝感麻糖礼盒传承人版",
    category: "artisan_original",
    description:
      "余达雄手作孝感麻糖精选礼盒，选用当年新产芝麻与传统麦芽糖，按祖传工艺制作，礼盒印有非遗传承标志，是馈赠佳礼",
    price: 168,
    imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=600",
    artisanName: "余达雄",
    heritageItem: "孝感麻糖",
    stock: 80,
    rating: 5,
    reviewCount: 256,
  },
  {
    name: "雕花剪纸书签套装6枚",
    category: "collab",
    description:
      "精选孝感雕花剪纸经典图案，制作成精美书签套装，图案涵盖槐荫树、董永故事等孝文化主题，竹浆书签纸，防水耐用",
    price: 35,
    imageUrl: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=600",
    artisanName: "孝感非遗文创",
    heritageItem: "孝感雕花剪纸",
    stock: 500,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    name: "皮影装饰挂件武松打虎",
    category: "artisan_original",
    description:
      "云梦皮影戏国家级传承人秦礼刚亲手制作，取材于经典剧目武松打虎，皮影造型精美，可作为家居装饰，附有传承人亲笔签名证书",
    price: 320,
    imageUrl:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600",
    artisanName: "秦礼刚",
    heritageItem: "云梦皮影戏",
    stock: 5,
    rating: 5,
    reviewCount: 18,
  },
  {
    name: "雕花剪纸文化台历2026",
    category: "collab",
    description:
      "12幅孝感雕花剪纸艺术作品，每月一幅，涵盖董永传说、雕花剪纸经典题材，配有非遗文化小知识，适合办公桌摆放",
    price: 98,
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    artisanName: "孝感非遗文创",
    heritageItem: "孝感雕花剪纸",
    stock: 120,
    rating: 4.6,
    reviewCount: 34,
  },
  {
    name: "孝文化主题马口窑陶瓷茶杯",
    category: "student",
    description:
      "湖北工程学院艺术设计专业学生设计，以孝感马口窑传统工艺制作，杯身印有孝文化图案，既是实用茶杯，也是独特的非遗文创作品",
    price: 128,
    imageUrl:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600",
    artisanName: "湖北工程学院非遗文创社",
    heritageItem: "马口窑陶瓷",
    stock: 60,
    rating: 4.5,
    reviewCount: 22,
  },
  {
    name: "应城膏雕小摆件莲花鱼",
    category: "artisan_original",
    description:
      "李志明大师亲手制作的应城膏雕摆件，取材于吉祥题材莲年有余，寓意美好，雕工精细，附证书及包装",
    price: 188,
    imageUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600",
    artisanName: "李志明",
    heritageItem: "应城膏雕",
    stock: 30,
    rating: 4.9,
    reviewCount: 15,
  },
  {
    name: "孝感米酒体验礼盒",
    category: "artisan_original",
    description:
      "张玉兰传承人出品，包含500ml传统孝感米酒一瓶及酿造工艺图文手册，让您在品味的同时了解千年酿酒文化",
    price: 88,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    artisanName: "张玉兰",
    heritageItem: "孝感米酒",
    stock: 100,
    rating: 4.8,
    reviewCount: 67,
  },
  {
    name: "非遗剪纸风格帆布袋",
    category: "student",
    description:
      "湖北职业技术学院学生设计，以雕花剪纸镂空图案为主题，环保帆布材质，侧面印有孝感非遗平台标志，实用又文艺",
    price: 58,
    imageUrl:
      "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=600",
    artisanName: "湖北职业技术学院文创工作室",
    heritageItem: "孝感雕花剪纸",
    stock: 200,
    rating: 4.4,
    reviewCount: 45,
  },
] as const;

const ACTIVITIES = [
  {
    title: "2026年孝感非遗年货节",
    description:
      "孝感市文旅局主办，汇聚全市30余家非遗传承人和文创品牌，现场展示与销售麻糖、剪纸、皮影等非遗产品，同期举办非遗表演、传承人见面会、体验工坊等精彩活动。",
    type: "展览销售",
    location: "孝感市文化中心广场",
    startDate: "2026-01-20",
    endDate: "2026-02-05",
    imageUrl:
      "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800",
    status: "upcoming",
    registrationUrl: null,
    maxParticipants: 5000,
    currentParticipants: 1280,
  },
  {
    title: "孝感雕花剪纸体验营寒假专场",
    description:
      "由管丽芳大师亲自指导，面向8-18岁青少年开展为期三天的雕花剪纸沉浸式体验营，从基础到进阶，让孩子们在动手中感受非遗魅力，带走自己的作品。",
    type: "体验活动",
    location: "孝感市非遗传习所",
    startDate: "2026-01-15",
    endDate: "2026-01-17",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    status: "upcoming",
    registrationUrl: null,
    maxParticipants: 30,
    currentParticipants: 22,
  },
  {
    title: "云梦皮影戏经典剧目专场演出",
    description:
      "国家级传承人秦礼刚携弟子献演经典剧目董永传说全本，约60分钟，演出结束后开放皮影制作体验，观众可与传承人面对面交流，了解皮影戏的台前幕后。",
    type: "演出",
    location: "孝感市云梦县文化馆剧场",
    startDate: "2026-01-25",
    endDate: "2026-01-25",
    imageUrl:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800",
    status: "upcoming",
    registrationUrl: null,
    maxParticipants: 200,
    currentParticipants: 156,
  },
  {
    title: "非遗进校园孝感雕花剪纸走进湖北工程学院",
    description:
      "管丽芳大师带领团队走进湖北工程学院，为艺术设计专业学生开展专题讲座和现场演示，探讨传统非遗与现代设计的融合创新，并与学生共同创作非遗文创作品。",
    type: "进校园",
    location: "湖北工程学院",
    startDate: "2026-03-15",
    endDate: "2026-03-15",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    status: "upcoming",
    registrationUrl: null,
    maxParticipants: 150,
    currentParticipants: 0,
  },
  {
    title: "2025孝文化旅游节非遗展演",
    description:
      "2025孝文化旅游节期间举办的非遗专题展演，包括楚剧选段、善书表演、三节龙跳鼓、皮影戏表演等多个精彩节目，共吸引近万名市民和游客观看。",
    type: "展演",
    location: "孝感市董永公园",
    startDate: "2025-09-28",
    endDate: "2025-10-05",
    imageUrl:
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800",
    status: "past",
    registrationUrl: null,
    maxParticipants: 10000,
    currentParticipants: 9800,
  },
  {
    title: "孝感非遗数字化平台启动仪式",
    description:
      "孝感非遗文化数字化平台正式上线启动仪式，孝感市文旅局领导、各级非遗传承人代表、本地高校代表等出席，标志着孝感非遗正式进入数字化传播新时代。",
    type: "发布会",
    location: "孝感市群众艺术馆",
    startDate: "2025-12-20",
    endDate: "2025-12-20",
    imageUrl:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800",
    status: "past",
    registrationUrl: null,
    maxParticipants: 300,
    currentParticipants: 285,
  },
] as const;

// 修正历史数据中失效/境外不可访问的图片地址，每次启动都执行（幂等）
async function fixupLegacyImageUrls() {
  const fixups: Array<{ id: number; url: string }> = [
    { id: 1, url: "/images/heritage/dongyong-legend.png" },
    { id: 12, url: "/images/heritage/xiaogang-taigushi.png" },
  ];
  for (const { id, url } of fixups) {
    try {
      const result = await db.execute(
        sql`UPDATE ${heritageItemsTable} SET image_url = ${url} WHERE id = ${id} AND image_url <> ${url}`,
      );
      const affected = (result as any)?.rowCount ?? 0;
      if (affected > 0) {
        console.log(
          `[seed] 修正 heritage_items id=${id} 图片地址 -> ${url}`,
        );
      }
    } catch (err) {
      console.warn(`[seed] 修正 heritage_items id=${id} 图片失败:`, err);
    }
  }
}

export async function autoSeedIfEmpty() {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(heritageItemsTable);
    if (Number(count) > 0) {
      console.log(
        `[seed] Database already has ${count} heritage items, skipping seed.`,
      );
      await fixupLegacyImageUrls();
      return;
    }

    console.log("[seed] Database is empty. Auto-seeding production data...");

    await db.insert(heritageItemsTable).values(
      (HERITAGE_ITEMS as any[]).map((d: any) => ({
        name: d.name,
        nameEn: d.nameEn,
        level: d.level,
        category: d.category,
        description: d.description,
        shortDesc: d.shortDesc,
        imageUrl: d.imageUrl,
        videoUrl: d.videoUrl || null,
        origin: d.origin,
        yearListed: d.yearListed,
        artisanCount: d.artisanCount,
        tags: d.tags,
        featured: d.featured,
        xiaoTheme: d.xiaoTheme,
      })),
    );
    console.log(
      `[seed] Inserted ${(HERITAGE_ITEMS as any[]).length} heritage items.`,
    );

    await db.insert(artisansTable).values(
      (ARTISANS as any[]).map((a: any) => ({
        name: a.name,
        level: a.level,
        heritageItem: a.heritageItem,
        heritageItemId: a.heritageItemId,
        bio: a.bio,
        avatarUrl: a.avatarUrl,
        yearsOfPractice: a.yearsOfPractice,
        awards: a.awards,
      })),
    );
    console.log(`[seed] Inserted ${(ARTISANS as any[]).length} artisans.`);

    await db.insert(productsTable).values(
      (PRODUCTS as any[]).map((p: any) => ({
        name: p.name,
        category: p.category,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        artisanName: p.artisanName,
        heritageItem: p.heritageItem,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
      })),
    );
    console.log(`[seed] Inserted ${(PRODUCTS as any[]).length} products.`);

    await db.insert(activitiesTable).values(
      (ACTIVITIES as any[]).map((a: any) => ({
        title: a.title,
        description: a.description,
        type: a.type,
        location: a.location,
        startDate: a.startDate ? new Date(a.startDate) : new Date(),
        endDate: a.endDate ? new Date(a.endDate) : new Date(),
        imageUrl: a.imageUrl,
        status: a.status,
        registrationUrl: a.registrationUrl || null,
        maxParticipants: a.maxParticipants,
        currentParticipants: a.currentParticipants,
      })),
    );
    console.log(`[seed] Inserted ${(ACTIVITIES as any[]).length} activities.`);
    console.log("[seed] Auto-seed complete!");
  } catch (err) {
    console.error("[seed] Auto-seed failed:", err);
  }
}
