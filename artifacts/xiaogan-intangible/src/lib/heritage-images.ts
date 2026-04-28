const HERITAGE_IMAGE_OVERRIDES: Record<string, string> = {
  "孝感剪纸（民间）":
    "https://ts1.tc.mm.bing.net/th/id/R-C.b7f1958268be8c446eede4230d4bbb0f?rik=Y70F5t%2fdSJJ%2f8w&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20190925%2f69cab7450ae0445e8481dce1795bd544.JPG&ehk=64wTiqE9fpK8i%2fRUvoxX9OWM%2bdeZX9P5uwv5zuc2pJA%3d&risl=&pid=ImgRaw&r=0",
  "孝感麻糖":
    "https://img.alicdn.com/imgextra/i4/2217580359065/O1CN01lBjspL2GppIA7lrEP_!!2217580359065.jpg",
  "云梦鱼面":
    "https://k.sinaimg.cn/n/sinacn20191203ac/500/w1200h900/20191203/0d52-ikhvemx3608527.jpg/w700d1q75cms.jpg",
};

export function resolveHeritageImage(
  name: string,
  imageUrl: string | null | undefined,
): string {
  const override = HERITAGE_IMAGE_OVERRIDES[name];
  if (override) return override;
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${imageUrl.slice(1)}`;
  }
  return `${import.meta.env.BASE_URL}${imageUrl}`;
}
