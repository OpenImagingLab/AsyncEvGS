import type { ProjectData } from './types';
import pipelineImg from './assets/pipeline_v7.png';
import heroVideo from './assets/teaser_video.mp4';

// Import videos
import loungeBaseline from './assets/interactive_results/real-world/Lounge/LSENeRF.mp4';
import loungeOurs from './assets/interactive_results/real-world/Lounge/Ours.mp4';
import patioBaseline from './assets/interactive_results/real-world/Patio/LSENeRF.mp4';
import patioOurs from './assets/interactive_results/real-world/Patio/Ours.mp4';
import factoryBaseline from './assets/interactive_results/synthetic/factory/LSENeRF.mp4';
import factoryOurs from './assets/interactive_results/synthetic/factory/Ours.mp4';
import trolleyBaseline from './assets/interactive_results/synthetic/trolley/LSENeRF.mp4';
import trolleyOurs from './assets/interactive_results/synthetic/trolley/Ours.mp4';

export const RESEARCH_DATA: ProjectData = {
  title: "AsyncEvGS: Asynchronous Event-Assisted Gaussian Splatting for Handheld Motion-Blurred Scenes",
  conference: "arXiv2026",
  authors: [
    { name: "Jun Dai",     affiliations: [1],       url: "https://daijun10086.github.io/", isEqualContribution: true },
    { name: "Renbiao Jin", affiliations: [2],       url: "#", isEqualContribution: true },
    { name: "Bo Xu",       affiliations: [2],       url: "#" },
    { name: "Yutian Chen", affiliations: [3],       url: "#" },
    { name: "Linning Xu", affiliations: [3],        url: "#" },
    { name: "Mulin Yu",    affiliations: [1],       url: "#" },
    { name: "Tianfan Xue", affiliations: [3, 1, 4], url: "#", isCorresponding: true },
    { name: "Shi Guo",     affiliations: [1],       url: "#", isCorresponding: true }
  ],
  institutions: [
    "Shanghai AI Laboratory",
    "Shanghai Jiao Tong University",
    "CUHK MMLab",
    "CPII under InnoHK"
  ],
  contactEmails: ["jundai332@gmail.com", "guoshi@pjlab.org.cn"],
  abstract: `3D reconstruction methods such as 3D Gaussian Splatting (3DGS) and Neural Radiance Fields (NeRF) achieve impressive photorealism but fail when input images suffer from severe motion blur. While event cameras provide high-temporal-resolution motion cues, existing event-assisted approaches rely on low-resolution sensors and strict synchronization, limiting their practicality for handheld 3D capture on common devices, such as smartphones. We introduce a flexible, high-resolution asynchronous RGB–Event dual-camera system and a corresponding reconstruction framework. Our approach first reconstructs sharp images from the event data and then employs a cross-domain pose estimation module based on the Visual Geometry Transformer (VGGT) to obtain robust initialization for 3DGS. During optimization, we employ a structure-driven event loss and view-specific consistency regularizers to mitigate the ill-posed behavior of traditional event losses and deblurring losses, ensuring both stable and high-fidelity reconstruction. We further contribute AsyncEv-Deblur, a new high-resolution RGB–Event dataset captured with our asynchronous system. Experiments demonstrate that our method achieves state-of-the-art performance on both our challenging dataset and existing benchmarks, substantially improving reconstruction robustness under severe motion blur.`,
  links: [
    { label: "Paper", url: "#", icon: "pdf" },
    { label: "Code", url: "#", icon: "github" },
    { label: "Video", url: "#", icon: "youtube" },
    { label: "Dataset", url: "#", icon: "database" }
  ],
  heroVideoUrl: heroVideo,
  methodDescription: `An overview of our proposed reconstruction pipeline. Our method takes blurred RGB images and sharp event streams as input. We first employ VGGT [1] to process both RGB and event images, providing robust initial camera poses and 3DGS points. The 3DGS representation is then jointly optimized using five key losses, broadly categorized into three groups: **(1) Deblurring Losses:** The blur synthesis loss ($\\mathcal{L}_{\\text{blur}}$) matches the synthesized blur to the input, while an RGB consistency regularizer ($\\mathcal{L}_{\\text{reg-r}}$) prevents degradation of the sharp neighboring views. **(2) Event-Guided Losses:** We augment the traditional photometric loss ($\\mathcal{L}_{\\text{evs}}$), with our novel structure loss ($\\mathcal{L}_{\\text{struct}}$) to robustly leverage high-frequency event details. **(3) Consistency Loss ($\\mathcal{L}_{\\text{reg-e}}$):** A color distillation loss ensures that event views match the colors learned from a coarse (Stage 1) 3DGS copy.`,
  methodImageUrl: pipelineImg, // Replace with your pipeline diagram URL
  comparisons: [
    {
      id: "lounge",
      label: "Lounge",
      category: "Real-World",
      scene: "Indoor lounge scene with complex lighting and reflections",
      videoBaseline: loungeBaseline,
      videoOurs: loungeOurs,
      description: "Our method demonstrates superior preservation and reconstruction of fine details and high-frequency textures compared to the baseline approach."
    },
    {
      id: "patio",
      label: "Patio",
      category: "Real-World",
      scene: "Outdoor patio scene with natural lighting and vegetation",
      videoBaseline: patioBaseline,
      videoOurs: patioOurs,
      description: "Our method demonstrates superior preservation and reconstruction of fine details and high-frequency textures compared to the baseline approach."
    },
    {
      id: "factory",
      label: "Factory",
      category: "Synthetic",
      scene: "Industrial factory environment with mechanical structures",
      videoBaseline: factoryBaseline,
      videoOurs: factoryOurs,
      description: "Our method demonstrates superior preservation and reconstruction of fine details and high-frequency textures compared to the baseline approach."
    },
    {
      id: "trolley",
      label: "Trolley",
      category: "Synthetic",
      scene: "Shopping trolley scene with metallic surfaces",
      videoBaseline: trolleyBaseline,
      videoOurs: trolleyOurs,
      description: "Our method demonstrates superior preservation and reconstruction of fine details and high-frequency textures compared to the baseline approach."
    }
  ],
  metrics: [
    { epoch: 0, psnr: 15.0, ssim: 0.50, lpips: 0.60 },
    { epoch: 10, psnr: 20.0, ssim: 0.65, lpips: 0.50 },
    { epoch: 20, psnr: 24.5, ssim: 0.75, lpips: 0.35 },
    { epoch: 30, psnr: 28.0, ssim: 0.82, lpips: 0.25 },
    { epoch: 40, psnr: 30.5, ssim: 0.89, lpips: 0.15 },
    { epoch: 50, psnr: 32.0, ssim: 0.93, lpips: 0.10 },
  ],
  quantitativeResults: [
    {
      name: "AsyncEv-Deblur Dataset (Real-World)",
      caption: "Quantitative results on our AsyncEv-Deblur dataset.",
      scenes: [
        { scene: "Patio", methods: { "3DGS": { psnr: 22.59, ssim: 0.744, lpips: 0.382 }, "BAGS": { psnr: 23.41, ssim: 0.779, lpips: 0.302 }, "DeblurGS": { psnr: 23.07, ssim: 0.628, lpips: 0.289 }, "LSENeRF": { psnr: 23.47, ssim: 0.779, lpips: 0.273 }, "Ours": { psnr: 24.45, ssim: 0.835, lpips: 0.223 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Bin", methods: { "3DGS": { psnr: 22.26, ssim: 0.804, lpips: 0.412 }, "BAGS": { psnr: 25.01, ssim: 0.819, lpips: 0.316 }, "DeblurGS": { psnr: 23.69, ssim: 0.633, lpips: 0.281 }, "LSENeRF": { psnr: 25.88, ssim: 0.827, lpips: 0.258 }, "Ours": { psnr: 25.67, ssim: 0.829, lpips: 0.265 } }, best: { psnr: "LSENeRF", ssim: "Ours", lpips: "LSENeRF" } },
        { scene: "Lounge", methods: { "3DGS": { psnr: 22.20, ssim: 0.778, lpips: 0.434 }, "BAGS": { psnr: 24.14, ssim: 0.834, lpips: 0.347 }, "DeblurGS": { psnr: 26.34, ssim: 0.764, lpips: 0.182 }, "LSENeRF": { psnr: 25.47, ssim: 0.852, lpips: 0.256 }, "Ours": { psnr: 25.91, ssim: 0.881, lpips: 0.199 } }, best: { psnr: "DeblurGS", ssim: "Ours", lpips: "DeblurGS" } },
        { scene: "Bench", methods: { "3DGS": { psnr: 22.95, ssim: 0.815, lpips: 0.373 }, "BAGS": { psnr: 23.03, ssim: 0.824, lpips: 0.326 }, "DeblurGS": { psnr: 24.19, ssim: 0.684, lpips: 0.192 }, "LSENeRF": { psnr: 24.48, ssim: 0.846, lpips: 0.217 }, "Ours": { psnr: 27.77, ssim: 0.896, lpips: 0.176 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Stair", methods: { "3DGS": { psnr: 24.89, ssim: 0.833, lpips: 0.376 }, "BAGS": { psnr: 26.51, ssim: 0.863, lpips: 0.294 }, "DeblurGS": { psnr: 27.95, ssim: 0.792, lpips: 0.173 }, "LSENeRF": { psnr: 26.25, ssim: 0.868, lpips: 0.202 }, "Ours": { psnr: 28.43, ssim: 0.900, lpips: 0.169 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Bus", methods: { "3DGS": { psnr: 20.53, ssim: 0.737, lpips: 0.466 }, "BAGS": { psnr: 22.06, ssim: 0.762, lpips: 0.403 }, "DeblurGS": { psnr: 23.43, ssim: 0.615, lpips: 0.255 }, "LSENeRF": { psnr: 22.14, ssim: 0.760, lpips: 0.295 }, "Ours": { psnr: 23.94, ssim: 0.808, lpips: 0.251 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Wall", methods: { "3DGS": { psnr: 23.42, ssim: 0.707, lpips: 0.466 }, "BAGS": { psnr: 24.12, ssim: 0.704, lpips: 0.242 }, "DeblurGS": { psnr: 18.01, ssim: 0.312, lpips: 0.513 }, "LSENeRF": { psnr: 25.14, ssim: 0.749, lpips: 0.225 }, "Ours": { psnr: 25.82, ssim: 0.785, lpips: 0.224 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Average", methods: { "3DGS": { psnr: 22.69, ssim: 0.774, lpips: 0.416 }, "BAGS": { psnr: 24.04, ssim: 0.798, lpips: 0.319 }, "DeblurGS": { psnr: 23.81, ssim: 0.633, lpips: 0.269 }, "LSENeRF": { psnr: 24.69, ssim: 0.812, lpips: 0.247 }, "Ours": { psnr: 26.00, ssim: 0.847, lpips: 0.215 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } }
      ]
    },
    {
      name: "Ev-DeblurBlender Dataset (Synthetic)",
      caption: "Quantitative results on the Ev-DeblurBlender dataset.",
      scenes: [
        { scene: "Factory", methods: { "3DGS": { psnr: 18.01, ssim: 0.514, lpips: 0.446 }, "BAGS": { psnr: 19.12, ssim: 0.634, lpips: 0.312 }, "DeblurGS": { psnr: 21.26, ssim: 0.620, lpips: 0.232 }, "LSENeRF": { psnr: 20.47, ssim: 0.707, lpips: 0.219 }, "Ours": { psnr: 23.18, ssim: 0.830, lpips: 0.165 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Pool", methods: { "3DGS": { psnr: 17.24, ssim: 0.439, lpips: 0.599 }, "BAGS": { psnr: 23.84, ssim: 0.640, lpips: 0.339 }, "DeblurGS": { psnr: 15.20, ssim: 0.015, lpips: 0.739 }, "LSENeRF": { psnr: 24.22, ssim: 0.639, lpips: 0.280 }, "Ours": { psnr: 25.16, ssim: 0.696, lpips: 0.252 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Tanabata", methods: { "3DGS": { psnr: 17.51, ssim: 0.517, lpips: 0.487 }, "BAGS": { psnr: 18.31, ssim: 0.596, lpips: 0.381 }, "DeblurGS": { psnr: 19.58, ssim: 0.556, lpips: 0.256 }, "LSENeRF": { psnr: 19.60, ssim: 0.659, lpips: 0.257 }, "Ours": { psnr: 20.11, ssim: 0.727, lpips: 0.221 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Trolley", methods: { "3DGS": { psnr: 18.52, ssim: 0.609, lpips: 0.413 }, "BAGS": { psnr: 20.25, ssim: 0.722, lpips: 0.287 }, "DeblurGS": { psnr: 21.08, ssim: 0.659, lpips: 0.204 }, "LSENeRF": { psnr: 20.75, ssim: 0.753, lpips: 0.184 }, "Ours": { psnr: 23.49, ssim: 0.854, lpips: 0.135 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } },
        { scene: "Average", methods: { "3DGS": { psnr: 17.82, ssim: 0.520, lpips: 0.486 }, "BAGS": { psnr: 20.38, ssim: 0.648, lpips: 0.330 }, "DeblurGS": { psnr: 19.28, ssim: 0.463, lpips: 0.358 }, "LSENeRF": { psnr: 21.26, ssim: 0.689, lpips: 0.235 }, "Ours": { psnr: 22.99, ssim: 0.777, lpips: 0.193 } }, best: { psnr: "Ours", ssim: "Ours", lpips: "Ours" } }
      ]
    }
  ]
};