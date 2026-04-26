import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  Wand2, Sparkles, Image as ImageIcon, Copy, Check, Bot,
  Download, ZoomIn, X, AlertCircle, Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────
interface TextResult {
  generatedText: string;
  style: string;
  scene: string;
  prompt: string;
  generatedAt: string;
  model?: string;
}

interface ImageResult {
  imageUrl: string | null;
  imageBase64: string | null;
  generatedAt: string;
  model?: string;
}

type GenStep = "idle" | "text" | "image" | "done";

// ─── Helpers ──────────────────────────────────────────────────────────────
const SECTION_COLORS: Record<string, string> = {
  "设计主题": "text-primary",
  "创意概念": "text-[#8B4513]",
  "视觉构成": "text-[#2F4F4F]",
  "非遗元素": "text-primary",
  "文化寓意": "text-[#8B4513]",
  "设计诗句": "text-foreground",
};

function parseText(text: string) {
  const sections: { title: string; content: string }[] = [];
  const regex = /【(.+?)】([\s\S]*?)(?=【|$)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    sections.push({ title: m[1].trim(), content: m[2].trim() });
  }
  return sections;
}

function imgSrc(r: ImageResult | null) {
  if (!r) return null;
  if (r.imageUrl) return r.imageUrl;
  if (r.imageBase64) return `data:image/png;base64,${r.imageBase64}`;
  return null;
}

const STEP_LABELS: Record<GenStep, string> = {
  idle:  "",
  text:  "第一步：豆包正在生成设计文案…",
  image: "第二步：豆包正在绘制创意图片…",
  done:  "",
};

// ─── Image Zoom Modal ──────────────────────────────────────────────────────
function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.85 }}
        className="relative max-w-3xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1 text-sm"
        >
          <X className="w-4 h-4" /> 关闭 (Esc)
        </button>
        <img src={src} alt="AI 生成图片" className="w-full rounded-2xl shadow-2xl" />
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function AiStudio() {
  const { toast } = useToast();

  const [step, setStep]               = useState<GenStep>("idle");
  const [textResult, setTextResult]   = useState<TextResult | null>(null);
  const [imageResult, setImageResult] = useState<ImageResult | null>(null);
  const [imageError, setImageError]   = useState<string | null>(null);
  const [copied, setCopied]           = useState(false);
  const [zoomOpen, setZoomOpen]       = useState(false);

  const [form, setForm] = useState({ style: "papercut", scene: "poster", prompt: "" });

  const styles = [
    { id: "papercut",        name: "雕花剪纸" },
    { id: "shadow_puppet",   name: "云梦皮影" },
    { id: "xiao_culture",    name: "孝文化工笔" },
    { id: "plaster_carving", name: "应城膏雕" },
  ];

  const scenes = [
    { id: "poster",       name: "海报" },
    { id: "phone_case",   name: "手机壳" },
    { id: "bookmark",     name: "书签" },
    { id: "avatar",       name: "社交头像" },
    { id: "greeting_card",name: "贺卡" },
  ];

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleGenerate = useCallback(async () => {
    if (!form.prompt.trim()) {
      toast({ title: "请输入创意描述", variant: "destructive" });
      return;
    }

    setStep("text");
    setTextResult(null);
    setImageResult(null);
    setImageError(null);

    // ── Step 1: text generation ──────────────────────────────────────────
    let textData: TextResult;
    try {
      const res = await fetch(`${baseUrl}/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "文案生成失败，请重试");
      textData = json as TextResult;
      setTextResult(textData);
    } catch (err) {
      setStep("idle");
      toast({
        title: "文案生成失败",
        description: err instanceof Error ? err.message : "网络异常，请稍后重试",
        variant: "destructive",
      });
      return;
    }

    // ── Step 2: image generation ─────────────────────────────────────────
    setStep("image");
    try {
      const res = await fetch(`${baseUrl}/api/ai/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: form.style,
          scene: form.scene,
          prompt: form.prompt,
          designText: textData.generatedText,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "图片生成失败");
      setImageResult(json as ImageResult);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "图片生成失败，请重试");
    }

    setStep("done");
    toast({ title: "✨ 创作完成！", description: "文案与图片已全部生成。" });
  }, [form, baseUrl, toast]);

  const handleCopy = () => {
    if (!textResult?.generatedText) return;
    navigator.clipboard.writeText(textResult.generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "已复制到剪贴板" });
  };

  const handleDownloadText = () => {
    if (!textResult) return;
    const blob = new Blob([textResult.generatedText], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "文创设计方案.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadImage = () => {
    const src = imgSrc(imageResult);
    if (!src) return;
    const a = document.createElement("a");
    a.href = src; a.download = "豆包生成图片.png"; a.click();
  };

  const isGenerating = step === "text" || step === "image";
  const sections     = textResult ? parseText(textResult.generatedText) : [];
  const generatedImg = imgSrc(imageResult);

  const styleLabel = (id: string) => styles.find(s => s.id === id)?.name || id;
  const sceneLabel = (id: string) => scenes.find(s => s.id === id)?.name || id;

  return (
    <>
      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomOpen && generatedImg && (
          <ImageModal src={generatedImg} onClose={() => setZoomOpen(false)} />
        )}
      </AnimatePresence>
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-16">
          <SectionHeading title="AI 灵感工坊" subtitle="AI Creator Studio">
            融合孝感非遗专属知识，由豆包大模型驱动，文生文 + 文生图一键生成独一无二的数字化文创设计方案。
          </SectionHeading>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">

            {/* ── Left: Controls ─────────────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-7 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-lg self-start">

              <div>
                <label className="block text-sm font-bold mb-3">1. 选择非遗风格</label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setForm(f => ({ ...f, style: s.id }))}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.style === s.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40 text-muted-foreground"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3">2. 选择应用场景</label>
                <div className="flex flex-wrap gap-2">
                  {scenes.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setForm(f => ({ ...f, scene: s.id }))}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        form.scene === s.id
                          ? "border-accent bg-accent text-accent-foreground shadow-md"
                          : "border-border bg-background hover:bg-muted text-foreground"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3">3. 描述你的创意画面</label>
                <textarea
                  rows={5}
                  placeholder="例如：一位慈祥的母亲和孩子在槐荫树下，温馨的氛围，体现孝文化的精髓…"
                  className="w-full p-4 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none text-sm"
                  value={form.prompt}
                  onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
                  disabled={isGenerating}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-primary to-[#a00020] text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> 生成中，请稍候…</>
                ) : (
                  <><Wand2 className="w-5 h-5" /> 一键生成文案 + 图片</>
                )}
              </button>

              {/* Step progress bar */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2">
                      {(["text", "image"] as const).map((s, i) => (
                        <div key={s} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                            step === s ? "bg-primary text-white animate-pulse"
                            : step === "image" && s === "text" ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                          }`}>
                            {step === "image" && s === "text" ? "✓" : i + 1}
                          </div>
                          <div className="flex-1">
                            <div className={`h-1.5 rounded-full transition-all duration-700 ${
                              step === s ? "bg-primary animate-pulse w-full"
                              : step === "image" && s === "text" ? "bg-green-500 w-full"
                              : "bg-muted w-0"
                            }`} />
                          </div>
                          <span className="text-xs text-muted-foreground w-16 shrink-0">
                            {s === "text" ? "生成文案" : "生成图片"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 text-center animate-pulse">
                      {STEP_LABELS[step]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Bot className="w-3.5 h-3.5 shrink-0" />
                <span>为避免滥用单个IP做了限额处理，如生成失败，请您刷新网页或更换设备后重试</span>
              </div>
            </div>

            {/* ── Right: Results ──────────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-4">

              {/* Empty state */}
              {step === "idle" && !textResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-muted/30 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center p-12 min-h-[500px] text-center"
                >
                  <div className="w-20 h-20 mx-auto bg-card rounded-2xl flex items-center justify-center border border-border mb-4 shadow-sm">
                    <ImageIcon className="w-8 h-8 text-primary/40" />
                  </div>
                  <p className="font-medium text-lg">作品展示区</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                    选择非遗风格和场景，输入创意描述，豆包将为你生成专属设计文案和 AI 创意图片
                  </p>
                </motion.div>
              )}

              {/* Loading state (before first text arrives) */}
              {step === "text" && !textResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-3xl border border-border p-12 flex flex-col items-center justify-center min-h-[300px]"
                >
                  <div className="relative w-20 h-20 mb-5">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse w-7 h-7" />
                  </div>
                  <p className="font-serif font-bold text-lg">豆包正在生成设计文案</p>
                  <p className="text-sm text-muted-foreground mt-1">融合孝感非遗知识，构建专属创意方案…</p>
                </motion.div>
              )}

              {/* ── AI-Generated Image ─────────────────────────── */}
              <AnimatePresence>
                {(textResult || isGenerating) && (
                  <motion.div
                    key="img-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden"
                  >
                    {/* Image area */}
                    {step === "image" && !generatedImg ? (
                      <div className="aspect-square bg-muted/40 flex flex-col items-center justify-center gap-3 min-h-[280px]">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                          <ImageIcon className="absolute inset-0 m-auto text-primary/60 w-6 h-6" />
                        </div>
                        <p className="text-sm text-muted-foreground">豆包正在绘制创意图片…</p>
                      </div>
                    ) : generatedImg ? (
                      <div
                        className="relative group cursor-zoom-in"
                        onClick={() => setZoomOpen(true)}
                      >
                        <img
                          src={generatedImg}
                          alt="豆包生成图片"
                          className="w-full object-cover max-h-[480px] transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium">
                            <ZoomIn className="w-4 h-4" /> 点击放大
                          </div>
                        </div>
                      </div>
                    ) : imageError ? (
                      <div className="p-6 flex items-center gap-3 text-sm text-destructive bg-destructive/5">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{imageError}</span>
                      </div>
                    ) : null}

                    {/* Image toolbar */}
                    {(generatedImg || imageError) && (
                      <div className="px-4 py-2.5 flex items-center justify-between border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>
                            {generatedImg
                              ? `豆包文生图 · ${styleLabel(form.style)} · ${sceneLabel(form.scene)}`
                              : "图片生成失败"}
                          </span>
                        </div>
                        {generatedImg && (
                          <button
                            onClick={handleDownloadImage}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> 下载图片
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Generated Text Plan ───────────────────────── */}
              <AnimatePresence>
                {textResult && (
                  <motion.div
                    key="text-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm">豆包生成的设计方案</span>
                        {textResult.model && (
                          <span className="text-xs text-muted-foreground">· {textResult.model}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? "已复制" : "复制文案"}
                        </button>
                        <button
                          onClick={handleDownloadText}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> 下载
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-5">
                      {sections.length > 0 ? sections.map((sec, i) => (
                        <div key={i}>
                          <h4 className={`text-sm font-bold mb-1.5 ${SECTION_COLORS[sec.title] || "text-primary"}`}>
                            【{sec.title}】
                          </h4>
                          {sec.title === "设计诗句" ? (
                            <div className="bg-muted/50 rounded-xl p-4 font-serif text-base leading-loose text-center whitespace-pre-line text-foreground/90 border border-border/50">
                              {sec.content}
                            </div>
                          ) : sec.title === "非遗元素" ? (
                            <ul className="space-y-1.5">
                              {sec.content.split("\n").filter(l => l.trim()).map((line, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                  {line.replace(/^[-•·\d.、]\s*/, "")}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                              {sec.content}
                            </p>
                          )}
                        </div>
                      )) : (
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                          {textResult.generatedText}
                        </p>
                      )}
                    </div>

                    <div className="px-5 py-2.5 border-t border-border bg-muted/30 text-xs text-muted-foreground">
                      生成时间：{new Date(textResult.generatedAt).toLocaleTimeString("zh-CN")}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
