import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./components/ui/button";
import TextPressure from "./components/TextPressure";
import ShaderCardBackground from "./components/ShaderCardBackground";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const navItems = [
  ["赛事介绍", "about"],
  ["赛道评审", "tracks"],
  ["奖项设置", "awards"],
  ["参赛指南", "guide"],
  ["资料下载", "download"],
  ["作品展示", "gallery"],
];

const schedule = [
  ["01", "作品征集", "6月17日 - 7月31日", "MVLAND活动页面提交"],
  ["02", "初筛阶段", "8月1日 - 8月9日", "入围作品筛选"],
  ["03", "评审阶段", "8月10日 - 8月19日", "专业评委打分"],
  ["04", "结果公示", "8月24日", "双平台同步公布"],
];

const tracks = [
  {
    title: "授权音乐赛道",
    desc: "使用INDE COMPANY提供的IP或艺人形象及正版嘻哈音乐曲库，创作60秒以上AIMV。",
    requirements: [
      "必须使用赛事资料包中提供的IP形象和授权音乐曲库中的歌曲进行MV创作",
      "使用MVLAND平台完成MV制作",
      "视频时长：60秒以上",
      "需体现对音乐内容的视觉理解和创意表达",
      "需提交不少于200字的创作说明",
    ],
    weights: ["情绪传达 30%", "创意与构思 30%", "AI运用技巧 20%", "视觉表现力 20%"],
    note: "获奖作品有机会获得INDE COMPANY及艺人官方合作。",
  },
  {
    title: "原创音乐赛道",
    desc: "使用参赛者自己创作或AI演绎的原创嘻哈歌曲，完成从音乐到视觉的全链路原创。",
    requirements: [
      "须为原创或AI作曲，MV的词/曲/演唱须避免版权争议",
      "注明音乐创作信息",
      "使用MVLAND平台完成制作",
      "视频时长：60秒以上",
      "需提交不少于200字说明",
    ],
    weights: ["情绪传达 30%", "创意与构思 30%", "AI运用技巧 20%", "视觉表现力 20%"],
    note: "获奖作品有机会获得INDE COMPANY及艺人官方合作。",
  },
  {
    title: "Hook赛道",
    desc: "围绕歌曲中最具辨识度、强化记忆的片段，创作30秒左右高光Hook。",
    requirements: [
      "使用提供IP形象和授权音乐曲库进行创作",
      "使用MVLAND平台完成制作",
      "视频时长：30秒左右",
      "体现视觉理解和创意表达",
      "需提交不少于200字说明",
    ],
    weights: ["画面感染力 30%", "创意与传播性 30%", "AI运用技巧 20%", "视觉冲击力 20%"],
    note: "同一歌曲的Hook部分和完整MV可分别投稿不同赛道。",
  },
  {
    title: "平面赛道",
    desc: "不制作视频，而是为“想象中的MV”设计一款12英寸黑胶唱片封面。",
    requirements: [
      "围绕“嘻哈狂欢派对”主题或者为自己的AIMV设计黑胶封面",
      "可使用AI辅助（需注明）或纯手工",
      "格式：JPG/PNG，≥300dpi，边长≥3000px",
      "需提交200字以内设计说明",
    ],
    weights: ["创意与原创性 35%", "视觉冲击力 30%", "主题契合度 20%", "商业潜力 15%"],
    note: "优秀作品将有机会与MVLAND及INDE COMPANY进行联名合作。",
  },
];

const awards = [
  {
    title: "授权音乐赛道",
    pool: "¥105,000 + 460,000积分",
    rows: [
      ["金奖 × 1名", "¥50,000", "10万积分 + 艺人虚拟形象独家合作权1次 + 艺人签名周边"],
      ["银奖 × 2名", "¥20,000", "6万积分 + 艺人签名周边"],
      ["铜奖 × 3名", "¥5,000", "2万积分"],
      ["佳作奖 × 10名", "8,000积分", ""],
      ["入围奖 × 20名", "5,000积分", ""],
    ],
  },
  {
    title: "原创音乐赛道",
    pool: "¥105,000 + 460,000积分",
    rows: [
      ["金奖 × 1名", "¥50,000", "10万积分 + 艺人虚拟形象独家合作权1次 + 艺人签名周边"],
      ["银奖 × 2名", "¥20,000", "6万积分 + 艺人签名周边"],
      ["铜奖 × 3名", "¥5,000", "2万积分"],
      ["佳作奖 × 10名", "8,000积分", ""],
      ["入围奖 × 20名", "5,000积分", ""],
    ],
  },
  {
    title: "Hook赛道",
    pool: "¥50,000 + 70,000积分",
    rows: [
      ["金奖 × 1名", "¥10,000", "20,000积分"],
      ["佳作奖 × 10名", "¥4,000", "5,000积分"],
    ],
  },
  {
    title: "平面赛道（黑胶封面）",
    pool: "¥40,000 + 70,000积分",
    rows: [
      ["金奖 × 1名", "¥10,000", "20,000积分"],
      ["佳作奖 × 10名", "¥3,000", "5,000积分"],
    ],
  },
];

const guideCards = [
  {
    title: "参赛须知",
    items: [
      "报名入口：MVLAND专题活动页和站酷赛事页面同时上传，带话题发布社媒",
      "作品提交：视频赛道上传MP4/MOV+创作说明+封面；平面赛道上传设计图+说明",
      "创作工具：建议使用MVLAND完成创作，AI生成占比80%以上",
      "作品原创：参赛作品须未被商用，不得抄袭盗用，版权纠纷自负",
      "使用模版：请下载并使用赛事资料中的赛事模版进行作品创作",
    ],
  },
  {
    title: "作品版权与权益",
    items: [
      "赛道一授权曲库在非商用场景下无需额外授权，音乐版权归属INDE",
      "主办方享有全部参赛作品宣传展示权利，应署名作者姓名",
      "金银铜奖作品完整著作权归主办方所有，作者保留永久署名权",
      "佳作奖著作权归原作者，主办方享有1年独家宣传使用权",
      "主办方享有获奖作品再设计、复制、发行、展览等全部权益",
    ],
  },
  {
    title: "获奖通知与发放",
    items: [
      "通知方式：结果公示后14个工作日内，通过邮件发送至站酷绑定邮箱",
      "配合工作：及时完成作品收集、著作权协议签署、积分发放",
      "弃奖处理：限定时间内未回应视为放弃奖项，由其他获奖者取代",
      "发放时间：奖励发放依著作权协议签署时间而定，请耐心等待",
      "重要提醒：请确保绑定真实有效的邮箱地址",
    ],
  },
];

const aboutCopy = [
  "嘻哈的起点，是一群年轻人在被遗忘的废墟里创造意义。Z世代的《嘻哈精神新约》里，嘻哈不再只是反叛权威，而是对抗虚假；不再只强调强者姿态，而是允许真实情绪存在。",
  "这个夏天，MVLAND联合INDE COMPANY与站酷，打造国内首个聚焦嘻哈文化的AIMV共创大赛。可以是街头炸裂的宣言，也可以是内心柔软的告解。",
  "本次大赛由INDE COMPANY提供正版音乐版权及嘻哈艺人形象授权，MVLAND提供奖金、技术平台与算力支持，站酷提供专业社区传播与赛事运营。",
];

const aboutImages = Array.from({ length: 6 }, (_, index) => `/about-stack/${index + 1}.png`);
const aboutTitlePhrases = ["表达，就是救赎", "用AIMV，让真实发生"];
const orbitalImages = Array.from({ length: 12 }, (_, index) => `/orbital-medias/${String(index + 1).padStart(2, "0")}.png`);

const galleryItems = [
  ["夏日狂欢", "授权音乐赛道", "16 / 9", "/about-stack/1.png"],
  ["霓虹都市", "原创音乐赛道", "3 / 4", "/about-stack/2.png"],
  ["嘻哈节拍", "Hook赛道", "1 / 1", "/about-stack/3.png"],
  ["午夜街头", "平面赛道", "4 / 3", "/about-stack/4.png"],
  ["复古派对", "授权音乐赛道", "9 / 16", "/about-stack/5.png"],
  ["赛博说唱", "原创音乐赛道", "16 / 9", "/about-stack/6.png"],
  ["地下舞台", "Hook赛道", "4 / 3", "/about-stack/1.png"],
  ["黑胶封面", "平面赛道", "3 / 4", "/about-stack/2.png"],
  ["街头宣言", "授权音乐赛道", "9 / 16", "/about-stack/3.png"],
  ["低频告解", "原创音乐赛道", "1 / 1", "/about-stack/4.png"],
  ["节拍切片", "Hook赛道", "16 / 9", "/about-stack/5.png"],
  ["唱片幻想", "平面赛道", "4 / 3", "/about-stack/6.png"],
  ["夏夜对峙", "授权音乐赛道", "3 / 4", "/about-stack/1.png"],
  ["霓虹采样", "原创音乐赛道", "9 / 16", "/about-stack/2.png"],
  ["副歌爆点", "Hook赛道", "1 / 1", "/about-stack/3.png"],
  ["封面练习", "平面赛道", "4 / 3", "/about-stack/4.png"],
];

function PressureTitle({ text }: { text: string }) {
  return (
    <span className="pressure-title" aria-label={text}>
      {text.split("").map((char, index) => (
        <span className="pressure-char-wrap" aria-hidden="true" key={`${char}-${index}`}>
          <span className="pressure-char">{char === " " ? "\u00a0" : char}</span>
        </span>
      ))}
    </span>
  );
}

function PixelIntro({ pixels }: { pixels: number[] }) {
  return (
    <div className="intro fixed inset-0 z-[100]">
      <div className="intro-pixels absolute inset-0" aria-hidden="true">
        {pixels.map((index) => (
          <span key={index} className="intro-pixel" />
        ))}
      </div>
      <div className="intro-logo absolute inset-0 flex items-center justify-center">
        <div className="intro-lockup relative flex items-center justify-center gap-4 text-center">
          <span className="intro-word brand-core">MVLAND</span>
          <span className="intro-x intro-x-inde">X</span>
          <span className="intro-word partner-mark partner-inde">INDE</span>
          <span className="intro-x intro-x-zcool">X</span>
          <span className="intro-word partner-mark partner-zcool">站酷</span>
        </div>
      </div>
    </div>
  );
}

function RevealLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="scroll-line block overflow-hidden">
      <span className="line-inner block">{children}</span>
    </span>
  );
}

function RollingWords({ text, className = "" }: { text: string; className?: string }) {
  const tokens = text.match(/[\u3400-\u9fff]|[^\s\u3400-\u9fff]+|\s+/g) ?? [text];

  return (
    <span className={`rolling-text ${className}`} aria-label={text}>
      {tokens.map((part, index) => {
        if (/^\s+$/.test(part)) {
          return <span key={`space-${index}`}> </span>;
        }
        return (
          <span className="hero-word" aria-hidden="true" key={`${part}-${index}`}>
            <span className="word-hidden">{part}</span>
            <span className="word-visible">{part}</span>
          </span>
        );
      })}
    </span>
  );
}

function SentenceRevealParagraph({ text }: { text: string }) {
  const sentences = text.match(/[^。！？]+[。！？]?/g) ?? [text];

  return (
    <p className="about-body-paragraph">
      {sentences.map((sentence) => (
        <span className="about-copy-line" key={sentence}>
          <span className="about-copy-line-inner">{sentence}</span>
        </span>
      ))}
    </p>
  );
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pixels = useMemo(() => Array.from({ length: 320 }, (_, index) => index), []);
  const [galleryLevel, setGalleryLevel] = useState(1);
  const canExpandGallery = galleryLevel < 3;

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set(".intro", { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(".page-shell", { autoAlpha: 1, clearProps: "transform" });
        gsap.set(".site-nav", { yPercent: 0, autoAlpha: 1 });
        gsap.set([".hero-title-shell", ".hero-kicker", ".hero-copy", ".hero-actions"], { y: 0, autoAlpha: 1 });
        return;
      }

      gsap.set(".page-shell", { autoAlpha: 0 });
      gsap.set(".site-nav", { yPercent: 0, autoAlpha: 1 });
      gsap.set(".intro", { backgroundColor: "#1C1C1C" });
      gsap.set(".intro-pixel", { visibility: "hidden" });
      gsap.set(".intro-logo", { autoAlpha: 1 });
      gsap.set(".intro-word, .intro-x", { color: "#e7e9ec" });
      gsap.set([".brand-core", ".intro-x-inde", ".partner-inde", ".intro-x-zcool", ".partner-zcool"], { x: 92, opacity: 1, visibility: "hidden" });
      gsap.set(".intro-lockup", { scale: 1, transformOrigin: "50% 50%" });
      gsap.set([".hero-title-shell", ".hero-kicker", ".hero-copy", ".hero-actions"], { y: 28, autoAlpha: 0 });
      gsap.set(".hero-word .word-hidden", { yPercent: 0 });
      gsap.set(".hero-word .word-visible", { yPercent: 100 });
      gsap.set(".reveal-card", { y: 32, autoAlpha: 0 });
      gsap.set(".line-inner", { yPercent: 110, autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.addLabel("logo")
        .set(".brand-core", { visibility: "visible" }, "logo")
        .to(".brand-core", { x: 0, duration: 0.46 }, "logo")
        .set([".intro-x-inde", ".partner-inde"], { visibility: "visible" }, "-=0.05")
        .to([".intro-x-inde", ".partner-inde"], { x: 0, duration: 0.46, stagger: 0.05 })
        .set([".intro-x-zcool", ".partner-zcool"], { visibility: "visible" }, "-=0.22")
        .to([".intro-x-zcool", ".partner-zcool"], { x: 0, duration: 0.46, stagger: 0.05 }, "<")
        .addLabel("smartMark", "+=1.25")
        .to(".intro-lockup", { scale: 0.64, duration: 0.72, ease: "expo.inOut" }, "smartMark")
        .to(".intro-word, .intro-x", { color: "#ff5cd6", duration: 0.72, ease: "power2.inOut" }, "smartMark")
        .addLabel("pixelFill", "+=0.2")
        .to(".intro-pixel", {
          visibility: "visible",
          duration: 0,
          stagger: { each: 0.006, from: "random" },
        }, "pixelFill")
        .set(".page-shell", { autoAlpha: 1, clearProps: "transform" }, "pixelFill+=1.4")
        .to(".intro", { autoAlpha: 0, pointerEvents: "none", duration: 0.48, ease: "power2.out" }, "pixelFill+=1.64")
        .to(".hero-title-shell", { y: 0, autoAlpha: 1, duration: 0.82 }, "-=0.08")
        .to([".hero-kicker", ".hero-copy", ".hero-actions"], { y: 0, autoAlpha: 1, duration: 0.76, stagger: 0.14 }, "-=0.45")
        .to(".hero-word .word-hidden, .hero-word .word-visible", { yPercent: "-=100", duration: 1.05, stagger: 0.008, ease: "expo.inOut" }, "-=0.65");

      const showHeader = () => {
        gsap.to(".site-nav", {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.34,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const hideHeader = () => {
        gsap.to(".site-nav", {
          yPercent: -120,
          autoAlpha: 0,
          duration: 0.28,
          ease: "power3.in",
          overwrite: true,
        });
      };

      let lastScrollY = window.scrollY;
      let lastHeaderState: "visible" | "hidden" = "visible";
      const syncHeader = () => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        if (Math.abs(delta) < 4) return;
        if (delta > 0 && currentY > 48 && lastHeaderState !== "hidden") {
          hideHeader();
          lastHeaderState = "hidden";
        }
        if (delta < 0 && lastHeaderState !== "visible") {
          showHeader();
          lastHeaderState = "visible";
        }
        lastScrollY = currentY;
      };
      window.addEventListener("scroll", syncHeader, { passive: true });

      const magneticCleanups: Array<() => void> = [];
      gsap.utils.toArray<HTMLElement>(".magnetic-button").forEach((button) => {
        const zone = button.closest<HTMLElement>(".magnetic-zone") ?? button;
        const content = zone.querySelector<HTMLElement>(".button-content");
        const strength = 0.4;
        const labelStrength = 0.24;

        gsap.to(button, {
          rotation: 2,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          overwrite: "auto",
        });

        const onMove = (event: MouseEvent) => {
          const rect = zone.getBoundingClientRect();
          const mapX = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, event.clientX);
          const mapY = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, event.clientY);

          gsap.to(button, {
            x: mapX * strength,
            y: mapY * strength,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
          if (content) {
            gsap.to(content, {
              x: mapX * labelStrength,
              y: mapY * labelStrength,
              duration: 0.4,
              ease: "power2.out",
              overwrite: true,
            });
          }
        };
        const onLeave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1,0.4)",
            overwrite: "auto",
          });
          if (content) {
            gsap.to(content, {
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "elastic.out(1,0.4)",
              overwrite: true,
            });
          }
        };
        zone.addEventListener("mousemove", onMove);
        zone.addEventListener("mouseleave", onLeave);
        magneticCleanups.push(() => {
          zone.removeEventListener("mousemove", onMove);
          zone.removeEventListener("mouseleave", onLeave);
        });
      });

      const aboutCopyLines = gsap.utils.toArray<HTMLElement>(".about-copy-line-inner");
      gsap.set(aboutCopyLines, { yPercent: 110, autoAlpha: 0 });

      const aboutTitlePanes = gsap.utils.toArray<HTMLElement>(".about-title-phrase");
      const aboutTitlePaneInners = gsap.utils.toArray<HTMLElement>(".about-title-line-inner");

      gsap.set(aboutTitlePanes, {
        xPercent: -50,
        yPercent: -50,
        z: "-1.8vw",
        rotationX: -90,
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
      });
      gsap.set(aboutTitlePanes[0], { rotationX: 0 });
      gsap.set(aboutTitlePaneInners, {
        z: "1.8vw",
        autoAlpha: 1,
        rotationZ: 0,
        transformStyle: "preserve-3d",
      });
      gsap.set(".about-orbital-card", { autoAlpha: 1, scale: 1 });

      const aboutTitleTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-title-pin",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
          pin: ".about-title-stage",
          anticipatePin: 1,
        },
      });

      aboutTitleTl.to({}, { duration: 0.28 }, 0);
      aboutTitlePanes.slice(0, -1).forEach((pane, index) => {
        const nextPane = aboutTitlePanes[index + 1];
        const paneInner = pane.querySelector<HTMLElement>(".about-title-line-inner");
        const nextInner = nextPane?.querySelector<HTMLElement>(".about-title-line-inner");
        const angle = index % 2 === 0 ? -5 : 5;
        const position = 0.28 + index * 1.4;

        aboutTitleTl
          .to(pane, {
            rotationX: 90,
            duration: 1.4,
            ease: "expo.inOut",
          }, position)
          .to(paneInner, {
            rotationZ: angle,
            autoAlpha: 0,
            duration: 1.4,
            ease: "expo.inOut",
          }, position)
          .fromTo(nextPane, {
            rotationX: -90,
          }, {
            rotationX: 0,
            duration: 1.4,
            ease: "expo.inOut",
          }, position)
          .fromTo(nextInner, {
            rotationZ: angle,
            autoAlpha: 0,
          }, {
            rotationZ: 0,
            autoAlpha: 1,
            duration: 1.4,
            ease: "expo.inOut",
          }, position);
      });
      aboutTitleTl.to({}, { duration: 0.5 });

      const orbitalCards = gsap.utils.toArray<HTMLElement>(".about-orbital-card");
      const orbitalTrack = document.querySelector<HTMLElement>(".about-orbital-cards");
      if (orbitalTrack && orbitalCards.length) {
        const isPortrait = window.innerWidth < window.innerHeight;
        const orbitalAmplitude = isPortrait ? 0.38 : 0.48;

        gsap.set(orbitalTrack, { x: () => window.innerWidth + Math.min(window.innerWidth * 0.18, 320) });
        gsap.set(orbitalCards, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          rotation: (index) => ((index % 5) - 2) * 1.4,
          transformOrigin: "50% 50%",
        });

        const orbitalScroll = gsap.to(orbitalTrack, {
          x: () => -orbitalTrack.scrollWidth - Math.min(window.innerWidth * 0.18, 320),
          ease: "none",
          scrollTrigger: {
            trigger: ".about-title-pin",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        orbitalCards.forEach((card, index) => {
          const sign = index % 2 === 0 ? 1 : -1;
          const rotation = ((index % 5) - 2) * 1.4;

          gsap.fromTo(card, { rotation }, {
            rotation: -rotation,
            y: () => sign * -orbitalAmplitude * window.innerHeight,
            yPercent: () => sign * 50,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: card,
              containerAnimation: orbitalScroll,
              start: "left 90%",
              end: "right 10%",
              scrub: true,
            },
          });

          gsap.to(card, {
            scale: 1.42,
            yoyo: true,
            repeat: 1,
            ease: "back.inOut(3)",
            scrollTrigger: {
              trigger: card,
              containerAnimation: orbitalScroll,
              start: "left 90%",
              end: "right 10%",
              scrub: true,
            },
          });
        });
      }

      gsap.set(".about-content-grid", { autoAlpha: 0, y: 48 });
      gsap.set(".about-image-stack img", { autoAlpha: 0 });

      const aboutImageEls = gsap.utils.toArray<HTMLElement>(".about-image-stack img");
      const imageVelocitySetters = aboutImageEls.map((image, index) => ({
        x: gsap.quickTo(image, "x", { duration: 0.36, ease: "power3.out" }),
        skewY: gsap.quickTo(image, "skewY", { duration: 0.36, ease: "power3.out" }),
        lift: gsap.quickTo(image, "y", { duration: 0.36, ease: "power3.out" }),
        dir: index % 2 === 0 ? 1 : -1,
      }));

      const resetImageVelocity = () => {
        imageVelocitySetters.forEach((setter) => {
          setter.x(0);
          setter.skewY(0);
          setter.lift(0);
        });
      };

      const aboutContentTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-content-pin",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          pin: ".about-content-stage",
          anticipatePin: 1,
          onUpdate(self) {
            const velocity = gsap.utils.clamp(-1, 1, self.getVelocity() / 1800);
            imageVelocitySetters.forEach((setter, index) => {
              setter.x(velocity * setter.dir * (10 + index * 3));
              setter.skewY(velocity * setter.dir * 4);
              setter.lift(Math.abs(velocity) * -10);
            });
          },
          onScrubComplete: resetImageVelocity,
          onLeave: resetImageVelocity,
          onLeaveBack: resetImageVelocity,
        },
      });

      aboutContentTl
        .to(".about-content-grid", { autoAlpha: 1, y: 0, duration: 0.72, ease: "power3.out" })
        .to(aboutCopyLines, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.86,
          stagger: 0.12,
          ease: "expo.out",
        }, "+=0.08")
        .to({}, { duration: 0.36 });
      aboutImageEls.forEach((image, index) => {
        aboutContentTl.fromTo(
          image,
          {
            autoAlpha: 0,
            yPercent: 28,
            xPercent: index % 2 === 0 ? -8 : 8,
            rotation: [-8, 6, -4, 9, -7, 4][index] ?? 0,
            scale: 0.92,
            filter: "blur(6px)",
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            xPercent: 0,
            rotation: [-8, 6, -4, 9, -7, 4][index] ?? 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.14,
            ease: "power3.out",
          },
        ).to({}, { duration: 0.56 });
      });
      aboutContentTl.to({}, { duration: 1.4 });

      const schedulePath = document.querySelector<SVGPathElement>(".schedule-path-draw");
      if (schedulePath) {
        const pathLength = schedulePath.getTotalLength();
        gsap.set(schedulePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        const scheduleNodes = gsap.utils.toArray<HTMLElement>(".schedule-node");
        const scheduleItems = gsap.utils.toArray<HTMLElement>(".schedule-item");
        gsap.set(scheduleNodes, { scale: 0.62, autoAlpha: 0, transformOrigin: "50% 50%" });
        gsap.set(".schedule-item", { xPercent: 0, y: 22, autoAlpha: 0, transformOrigin: "50% 50%" });

        const scheduleTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".schedule-timeline",
            start: "top 76%",
            end: "center center",
            scrub: 0.7,
          },
        });

        scheduleTl.to(schedulePath, { strokeDashoffset: 0, duration: 1, ease: "none" });
        [0.16, 0.38, 0.62, 0.86].forEach((position, index) => {
          scheduleTl
            .to(scheduleNodes[index], {
              autoAlpha: 1,
              scale: 1,
              duration: 0.11,
              ease: "back.out(2)",
            }, position)
            .to(scheduleItems[index], {
              autoAlpha: 1,
              xPercent: 0,
              y: 0,
              duration: 0.16,
              ease: "power3.out",
            }, position + 0.035);
        });
      }

      gsap.utils.toArray<HTMLElement>(".awards-slide").forEach((slide, index) => {
        const contentWrapper = slide.querySelector<HTMLElement>(".awards-content-wrapper");
        const content = slide.querySelector<HTMLElement>(".awards-content");
        if (!contentWrapper || !content) return;

        if (index === 0) {
          gsap.fromTo(content, {
            autoAlpha: 0,
            y: 40,
            scale: 0.96,
            filter: "blur(10px)",
          }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: slide,
              start: "top 82%",
              end: "top 44%",
              scrub: 0.55,
            },
          });
        }

        gsap.to(content, {
          rotationZ: index % 2 === 0 ? -3.2 : 3.2,
          scale: 0.7,
          rotationX: 40,
          ease: "power1.in",
          scrollTrigger: {
            pin: contentWrapper,
            trigger: slide,
            start: "top top",
            end: () => `+=${window.innerHeight}`,
            scrub: 0.75,
          },
        });

        gsap.to(content, {
          autoAlpha: 0,
          ease: "power1.in",
          scrollTrigger: {
            trigger: content,
            start: "top -80%",
            end: () => `+=${0.2 * window.innerHeight}`,
            scrub: 0.55,
          },
        });
      });

      const trackCards = gsap.utils.toArray<HTMLElement>(".tracks-scroll-card");
      const tracksPin = document.querySelector<HTMLElement>(".tracks-pin-height");
      const tracksContainer = document.querySelector<HTMLElement>(".tracks-scroll-container");
      const tracksTitle = document.querySelector<HTMLElement>(".tracks-title");
      if (trackCards.length && tracksPin && tracksContainer) {
        const viewportCenter = window.innerWidth / 2;
        const cardGap = 16;

        const tracksTl = gsap.timeline({
          scrollTrigger: {
            trigger: tracksPin,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
            pin: tracksContainer,
            invalidateOnRefresh: true,
          },
        });

        if (tracksTitle) {
          const titleInner = tracksTitle.querySelector<HTMLElement>(".line-inner");
          gsap.set(tracksTitle, {
            transformOrigin: "50% 50%",
          });
          if (titleInner) {
            gsap.set(titleInner, { yPercent: 110, autoAlpha: 0 });
          }

          tracksTl.to(titleInner ?? tracksTitle, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.64,
            ease: "expo.out",
          }, 0);
        }

        trackCards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const centerX = viewportCenter - cardCenter;
          const startX = window.innerWidth + rect.width + index * (rect.width + cardGap) - cardCenter;

          gsap.set(card, {
            x: startX,
            rotate: index % 2 === 0 ? -0.9 : 0.9,
            autoAlpha: 1,
            transformOrigin: "50% 50%",
          });

          if (index === 0) {
            tracksTl
              .to(card, {
                x: centerX,
                rotate: 0,
                duration: 0.76,
                ease: "power3.inOut",
              }, 0.08)
              .to(card, {
                x: 0,
                duration: 0.82,
                ease: "power2.inOut",
              }, 0.98);
            return;
          }

          tracksTl.to(card, {
            x: 0,
            rotate: 0,
            duration: 0.82,
            ease: "power2.inOut",
          }, 1 + (index - 1) * 0.28);
        });

        tracksTl.to({}, { duration: 2.1 });
      }

      const trackHoverCleanups: Array<() => void> = [];
      gsap.utils.toArray<HTMLElement>(".tracks-scroll-card").forEach((card) => {
        const inner = card.querySelector<HTMLElement>(".track-card-inner");
        if (!inner) return;
        gsap.set(inner, { transformPerspective: 900, transformOrigin: "50% 50%" });
        const rotateX = gsap.quickTo(inner, "rotationX", { duration: 0.36, ease: "power3.out" });
        const rotateY = gsap.quickTo(inner, "rotationY", { duration: 0.36, ease: "power3.out" });
        const z = gsap.quickTo(inner, "z", { duration: 0.36, ease: "power3.out" });

        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX(py * -8);
          rotateY(px * 9);
          z(32);
        };
        const onLeave = () => {
          rotateX(0);
          rotateY(0);
          z(0);
        };
        card.addEventListener("pointermove", onMove);
        card.addEventListener("mouseleave", onLeave);
        trackHoverCleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      gsap.set(".gallery-item", {
        autoAlpha: 1,
        y: 0,
        transformOrigin: "50% 50%",
      });

      const galleryHoverCleanups: Array<() => void> = [];
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((card) => {
        const media = card.querySelector<HTMLElement>(".gallery-media");
        if (!media) return;

        gsap.set(media, {
          transformPerspective: 800,
          transformOrigin: "50% 50%",
        });

        const rotateX = gsap.quickTo(media, "rotationX", { duration: 0.48, ease: "power3.out" });
        const rotateY = gsap.quickTo(media, "rotationY", { duration: 0.48, ease: "power3.out" });
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX(py * -14);
          rotateY(px * 14);
        };
        const onLeave = () => {
          rotateX(0);
          rotateY(0);
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        galleryHoverCleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      ScrollTrigger.batch(".gallery-item", {
        start: "top 88%",
        end: "bottom 8%",
        interval: 0.08,
        batchMax: 6,
        onEnter: (batch) => gsap.fromTo(batch,
          { autoAlpha: 0, y: 28, rotationX: 8 },
          {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            duration: 0.88,
            stagger: 0.045,
            overwrite: true,
            ease: "expo.out",
          },
        ),
        onEnterBack: (batch) => gsap.fromTo(batch,
          { autoAlpha: 0, y: -20, rotationX: -6 },
          {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            duration: 0.62,
            stagger: 0.035,
            overwrite: true,
            ease: "power3.out",
          },
        ),
      });

      const guideCardsEls = gsap.utils.toArray<HTMLElement>(".guide-panel");
      const guideTopicEls = gsap.utils.toArray<HTMLElement>(".guide-topic");
      const guideViewportCenter = window.innerWidth / 2;
      guideCardsEls.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        gsap.set(card, {
          x: window.innerWidth + rect.width + index * (rect.width + 16) - cardCenter,
          autoAlpha: 0,
          rotationY: -8,
        });
      });
      const guideTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".guide-card-grid",
          start: "top 88%",
          end: "bottom 18%",
          scrub: 0.75,
        },
      });

      if (guideCardsEls[0]) {
        const firstRect = guideCardsEls[0].getBoundingClientRect();
        const firstCenter = firstRect.left + firstRect.width / 2;
        guideTl
          .to(guideCardsEls[0], {
            x: guideViewportCenter - firstCenter,
            autoAlpha: 1,
            rotationY: 0,
            duration: 0.72,
            ease: "power3.inOut",
          })
          .to(guideCardsEls[0], {
            x: 0,
            duration: 0.7,
            ease: "power2.inOut",
          });
      }

      guideCardsEls.slice(1).forEach((card, index) => {
        guideTl.to(card, {
          x: 0,
          autoAlpha: 1,
          rotationY: 0,
          duration: 0.7,
          ease: "power2.inOut",
        }, 0.76 + index * 0.22);
      });

      guideTl
        .to({}, { duration: 0.38 })
        .to(guideCardsEls, {
          x: () => -window.innerWidth * 0.72,
          autoAlpha: 0,
          rotationY: 8,
          duration: 0.72,
          stagger: 0.08,
          ease: "power2.in",
        });

      const downloadStats = gsap.utils.toArray<HTMLElement>(".download-stat");
      const downloadLabels = gsap.utils.toArray<HTMLElement>(".download-stat .stat-word");
      const animatePills = (
        trigger: string,
        pills: HTMLElement[],
        labels: HTMLElement[] = pills,
      ) => {
        const show = () => {
          gsap.fromTo(pills,
            { y: -56, autoAlpha: 0, rotationX: -14, filter: "blur(7px)" },
            {
              y: 0,
              autoAlpha: 1,
              rotationX: 0,
              filter: "blur(0px)",
              duration: 0.78,
              stagger: 0.075,
              ease: "expo.out",
              overwrite: true,
            },
          );
          gsap.fromTo(labels,
            { y: 12, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.55,
              stagger: 0.075,
              delay: 0.08,
              ease: "power3.out",
              overwrite: true,
            },
          );
        };
        const hide = (direction: number) => {
          gsap.to(pills, {
            y: direction * 40,
            autoAlpha: 0,
            duration: 0.38,
            stagger: 0.04,
            ease: "power2.in",
            overwrite: true,
          });
        };

        gsap.set(pills, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger,
          start: "top 84%",
          end: "bottom 16%",
          onEnter: show,
          onEnterBack: show,
          onLeave: () => hide(-1),
          onLeaveBack: () => hide(1),
        });
      };

      animatePills(".guide-topics", guideTopicEls);
      animatePills(".download-stats", downloadStats, downloadLabels);

      ScrollTrigger.batch(".reveal-card", {
        start: "top 82%",
        end: "bottom 12%",
        onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, overwrite: true, ease: "expo.out" }),
        onEnterBack: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.05, overwrite: true, ease: "power3.out" }),
        onLeave: (batch) => gsap.to(batch, { y: -26, autoAlpha: 0, duration: 0.45, stagger: 0.03, overwrite: true, ease: "power2.in" }),
        onLeaveBack: (batch) => gsap.to(batch, { y: 32, autoAlpha: 0, duration: 0.45, stagger: 0.03, overwrite: true, ease: "power2.in" }),
      });

      ScrollTrigger.batch(".scroll-line", {
        start: "top 84%",
        end: "bottom 18%",
        onEnter: (batch) => gsap.to(batch.map((el) => el.querySelector(".line-inner")), { yPercent: 0, autoAlpha: 1, duration: 0.72, stagger: 0.06, overwrite: true, ease: "expo.out" }),
        onEnterBack: (batch) => gsap.to(batch.map((el) => el.querySelector(".line-inner")), { yPercent: 0, autoAlpha: 1, duration: 0.62, stagger: 0.04, overwrite: true, ease: "expo.out" }),
        onLeave: (batch) => gsap.to(batch.map((el) => el.querySelector(".line-inner")), { yPercent: -110, autoAlpha: 0, duration: 0.46, stagger: 0.03, overwrite: true, ease: "power2.in" }),
        onLeaveBack: (batch) => gsap.to(batch.map((el) => el.querySelector(".line-inner")), { yPercent: 110, autoAlpha: 0, duration: 0.46, stagger: 0.03, overwrite: true, ease: "power2.in" }),
      });

      return () => {
        window.removeEventListener("scroll", syncHeader);
        magneticCleanups.forEach((cleanup) => cleanup());
        trackHoverCleanups.forEach((cleanup) => cleanup());
        galleryHoverCleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-background text-foreground">
      <PixelIntro pixels={pixels} />
      <div className="page-shell">
        <nav className="site-nav fixed left-0 right-0 top-0 z-50">
          <div className="site-nav-inner mx-auto grid max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center px-6 md:px-8">
            <a href="#hero" className="brand-lockup">
              <span>MVLAND</span>
              <span>X</span>
              <span>INDE</span>
              <span>X</span>
              <span>站酷</span>
            </a>
            <div className="nav-links hidden items-center justify-center md:flex">
              {navItems.map(([label, id]) => (
                <a key={id} href={`#${id}`}>
                  {label}
                </a>
              ))}
            </div>
            <Button asChild className="nav-action justify-self-end">
              <a href="#download" className="hidden gap-2 md:inline-flex">
                <span>立即参赛</span>
              </a>
            </Button>
            <Button size="icon" className="justify-self-end md:hidden" aria-label="打开导航">
              <span className="text-xs">菜单</span>
            </Button>
          </div>
        </nav>

        <main>
          <section id="hero" className="hero relative flex min-h-screen overflow-hidden bg-black px-6 pt-28 md:px-8">
            <img className="hero-bg" src="/hero-main-visual.png" alt="" aria-hidden="true" />
            <div className="hero-bg-shade" aria-hidden="true" />
            <div className="hero-bottom-mask" aria-hidden="true" />
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center pb-20 text-center">
              <p className="hero-kicker mb-8 text-sm font-medium uppercase tracking-[0.32em]">
                <RollingWords text="MVLAND × INDE × 站酷" />
              </p>
              <div className="hero-title-shell">
                <TextPressure
                  text="嘻哈狂欢派对"
                  fontFamily="Noto Sans TC"
                  fontUrl=""
                  width
                  weight
                  italic={false}
                  alpha={false}
                  flex={false}
                  stroke={false}
                  scale={false}
                  textColor="#E7E9EC"
                  minFontSize={72}
                  maxFontSize={150}
                />
              </div>
              <p className="hero-copy mt-8 max-w-none text-base leading-relaxed sm:text-lg">
                当嘻哈精神遇见AI创造力。用AIMV，把真实的自己装进MV，让愤怒、脆弱、宣言与告解一起发声。
              </p>
              <div className="hero-actions mt-12 flex flex-col items-center gap-2 sm:flex-row">
                <span className="magnetic-zone">
                  <Button asChild size="lg" className="hero-button magnetic-button">
                    <a href="#download">
                      <span className="button-content">获取赛事资料</span>
                    </a>
                  </Button>
                </span>
                <span className="magnetic-zone">
                  <Button asChild size="lg" className="hero-button magnetic-button">
                    <a href="#about">
                      <span className="button-content">查看赛制</span>
                    </a>
                  </Button>
                </span>
              </div>
            </div>
          </section>

          <section id="about" className="about-section section-band">
            <div className="about-title-pin">
              <div className="about-title-stage">
                <div className="about-orbital" aria-hidden="true">
                  <div className="about-orbital-cards">
                    {orbitalImages.map((src) => (
                      <img className="about-orbital-card" src={src} alt="" key={src} />
                    ))}
                  </div>
                </div>
                <h2 className="about-title">
                  {aboutTitlePhrases.map((phrase) => (
                    <span className="about-title-phrase" key={phrase}>
                      <span className="about-title-line">
                        <span className="about-title-line-inner">{phrase}</span>
                      </span>
                    </span>
                  ))}
                </h2>
              </div>
            </div>
            <div className="about-content-pin">
              <div className="about-content-stage">
              <div className="about-content-grid">
                <div className="about-copy">
                  {aboutCopy.map((text) => (
                    <SentenceRevealParagraph text={text} key={text} />
                  ))}
                </div>
                <div className="about-image-stack" aria-hidden="true">
                  {aboutImages.map((src, index) => (
                    <img src={src} alt="" key={src} style={{ "--stack-index": index } as React.CSSProperties} />
                  ))}
                </div>
              </div>
              </div>
            </div>
          </section>

          <section className="section-band schedule-section">
            <div className="section-inner mx-auto max-w-7xl">
              <div className="section-heading-row flex items-end justify-between">
                <h2 className="section-title">
                  <RevealLine>赛事进程</RevealLine>
                </h2>
              </div>
              <div className="schedule-timeline">
                <svg className="schedule-curve" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="scheduleLineGradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ff8709" />
                      <stop offset="48%" stopColor="#c8ff2e" />
                      <stop offset="100%" stopColor="#f7bdf8" />
                    </linearGradient>
                  </defs>
                  <path className="schedule-path-base" d="M56 208 H246 L286 164 H482 L522 120 H704 L744 72 H924 L964 24 H1144" />
                  <path className="schedule-path-draw" d="M56 208 H246 L286 164 H482 L522 120 H704 L744 72 H924 L964 24 H1144" />
                </svg>
                {schedule.map(([step, title, date]) => (
                  <article key={step} className="schedule-item">
                    <span className="schedule-node" aria-hidden="true" />
                    <h3>{title}</h3>
                    <p>{date}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="tracks" className="section-band tracks-section">
            <div className="section-inner mx-auto max-w-[1504px]">
              <div className="tracks-pin-height section-content-lg">
                <div className="tracks-scroll-container">
                  <h2 className="section-title tracks-title mx-auto text-center">
                    <span className="tracks-title-line block overflow-hidden">
                      <span className="line-inner block">四个平行赛道让真实有不同的声场</span>
                    </span>
                  </h2>
                  <div className="tracks-scroll-row">
                    {tracks.map((track, index) => (
                      <article key={track.title} className="tracks-scroll-card track-panel">
                        <div className="track-card-inner">
                          {index % 2 === 1 && <ShaderCardBackground />}
                          <h3>{track.title}</h3>
                          <p>{track.desc}</p>
                          <ul>
                            {track.requirements.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          <div className="weight-list">
                            {track.weights.map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                          <small>{track.note}</small>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="awards" className="awards-section section-band">
            <div className="awards-effect">
              <div className="awards-slide awards-intro-slide">
                  <div className="awards-content-wrapper">
                  <div className="awards-content awards-intro">
                    <h2>总奖池</h2>
                    <strong>¥300,000</strong>
                    <span>现金奖励 + 1,260,000 积分</span>
                  </div>
                </div>
              </div>
              {[awards[0], awards[1]].map((award, index) => (
                <div className="awards-slide" key={award.title}>
                  <div className="awards-content-wrapper">
                    <article className="awards-content award-swiss-card">
                      {index === 1 && <ShaderCardBackground />}
                      <div className="award-swiss-top">
                        <p>{award.pool}</p>
                        <span>{award.title}</span>
                      </div>
                      <h3>{award.title}</h3>
                      <strong>{award.pool}</strong>
                      <div className="award-swiss-rows">
                        {award.rows.map(([name, value, detail]) => (
                          <div className="award-swiss-row" key={`${award.title}-${name}`}>
                            <span>{name}</span>
                            <b>{value}</b>
                            {detail && <p>{detail}</p>}
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>
                </div>
              ))}
              <div className="awards-slide">
                <div className="awards-content-wrapper">
                  <article className="awards-content award-swiss-card award-swiss-split">
                    {[awards[2], awards[3]].map((award) => (
                      <div key={award.title}>
                        <div className="award-swiss-top">
                          <p>{award.pool}</p>
                          <span>{award.title}</span>
                        </div>
                        <h3>{award.title}</h3>
                        <strong>{award.pool}</strong>
                        <div className="award-swiss-rows">
                          {award.rows.map(([name, value, detail]) => (
                            <div className="award-swiss-row" key={`${award.title}-${name}`}>
                              <span>{name}</span>
                              <b>{value}</b>
                              {detail && <p>{detail}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </article>
                </div>
              </div>
              <div className="awards-slide">
                <div className="awards-content-wrapper">
                  <article className="awards-content award-swiss-card award-swiss-extra">
                    <ShaderCardBackground />
                    <div>
                      <h3>艺人互动</h3>
                      <strong>100,000 积分</strong>
                      <p>每周10名，每人2000积分。活动时间：7月1日 - 7月31日，每周一次。</p>
                    </div>
                    <div>
                      <h3>每周社媒翻牌</h3>
                      <strong>100,000 积分</strong>
                      <p>每周10名，每人2000积分。活动时间：7月1日 - 7月31日，每周一次。</p>
                    </div>
                    <div>
                      <h3>额外激励权益</h3>
                      <ul>
                        <li>官方专题曝光：获奖作品将收录至MVLAND官方作品集</li>
                        <li>线下展映机会：获奖作品将在后续线下活动中展映</li>
                        <li>官方签约合作：等级奖有机会获得INDE COMPANY关注和合作</li>
                        <li>官方作品推荐：MVLAND、站酷官方作品加热推荐</li>
                      </ul>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section id="guide" className="section-band guide-section">
            <div className="section-inner mx-auto max-w-[1504px]">
              <h2 className="section-title guide-title mx-auto text-center">
                <RevealLine>参赛指南</RevealLine>
              </h2>
              <div className="guide-card-grid section-content grid md:grid-cols-3">
                {guideCards.map((card, index) => (
                  <article key={card.title} className="guide-panel">
                    {index === 1 && <ShaderCardBackground />}
                    <h3>{card.title}</h3>
                    <ol>
                      {card.items.map((item, index) => (
                        <li key={item}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
              <div className="guide-topics">
                <p>参赛必带社媒话题</p>
                <div className="guide-topic-row">
                  {["#MVLAND夏日嘻哈狂欢派对", "#MVLAND", "#站酷挑战赛", "#INDEcompany"].map((tag) => (
                    <span className="guide-topic" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="download" className="section-band">
            <div className="section-inner mx-auto max-w-7xl">
              <div className="download-stage download-plain reveal-card">
                <h2>获取完整赛事资料包</h2>
                <p>包含授权音乐曲库列表、赛事创作模版、品牌视觉规范、官方LOGO素材等。</p>
                <div className="button-row flex flex-col justify-center sm:flex-row">
                  <Button size="lg" variant="solid">下载赛事资料</Button>
                  <Button size="lg">授权曲库列表</Button>
                </div>
                <div className="download-stats">
                  {["50+ 授权嘻哈歌曲", "10+ 官方艺人IP", "5套 创作模版", "完整 视觉规范"].map((stat) => (
                    <span className="download-stat" key={stat}>
                      <em className="stat-word">{stat}</em>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="gallery" className="section-band">
            <div className="section-inner mx-auto max-w-7xl">
              <h2 className="section-title mx-auto max-w-4xl text-center">
                <RevealLine>作品展示</RevealLine>
              </h2>
              <div
                className={`gallery-window reveal-card section-content ${canExpandGallery ? "is-clipped" : "is-open"}`}
                style={{ "--gallery-max-height": `${720 + galleryLevel * 360}px` } as React.CSSProperties}
              >
                <div className="gallery-grid">
                  {galleryItems.map(([title, track, ratio, src]) => (
                    <article className="gallery-item" key={title}>
                      <div className="gallery-media" style={{ aspectRatio: ratio }}>
                        <img src={src} alt={title} loading="lazy" />
                        <div className="gallery-body">
                          <h3>{title}</h3>
                          <p>{track}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              {canExpandGallery && (
                <div className="gallery-more-bar">
                  <Button type="button" size="lg" onClick={() => setGalleryLevel((level) => Math.min(level + 1, 3))}>
                    See more
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="site-footer border-t border-cream-10">
          <div className="footer-inner mx-auto flex max-w-7xl flex-col justify-between text-sm text-cream-50 md:flex-row">
            <p className="font-display text-2xl text-cream">MVLAND × INDE × 站酷</p>
            <p>© 2026 MVLAND × INDE × 站酷. AIMV嘻哈狂欢派对创作大赛</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
