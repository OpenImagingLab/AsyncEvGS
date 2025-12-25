import type { ProjectData } from './types';

export const RESEARCH_DATA: ProjectData = {
  title: "AsyncEvGS: Asynchronous Event-Assisted Gaussian Splatting for Handheld Motion-Blurred Scenes",
  conference: "Conference Name 202X (Oral/Poster)",
  authors: [
    { name: "Jun Dai", affiliation: "Shanghai AI Laboratory", url: "https://daijun10086.github.io/", isEqualContribution: true },
    { name: "Renbiao Jin", affiliation: "Shanghai Jiaotong University", url: "#", isEqualContribution: false },
    { name: "Bo Xu", affiliation: "Shanghai Jiaotong University", url: "#" },
    { name: "Yutian Chen", affiliation: "CUHK", url: "#" },
    { name: "Linning Xu", affiliation: "CUHK", url: "#" },
    { name: "Mulin Xu", affiliation: "Shanghai AI Laboratory", url: "#" },
    { name: "Tianfan Xue", affiliation: "CUHK", url: "#" },
    { name: "Shi Guo", affiliation: "Shanghai AI Laboratory", url: "#" }
  ],
  abstract: "3D reconstruction methods such as 3D Gaussian Splatting (3DGS) and Neural Radiance Fields (NeRF) achieve impressive photorealism but fail when input images suffer from severe motion blur. While event cameras provide high-temporal-resolution motion cues, existing event-assisted approaches rely on low-resolution sensors and strict synchronization, limiting their practicality for handheld 3D capture on common devices, such as smartphones. We introduce a flexible, high-resolution asynchronous RGB–Event dual-camera system and a corresponding reconstruction framework. Our approach first reconstructs sharp images from the event data and then employs a cross-domain pose estimation module based on the Visual Geometry Transformer (VGGT) to obtain robust initialization for 3DGS. During optimization, we employ a structure-driven event loss and view-specific consistency regularizers to mitigate the ill-posed behavior of traditional event losses and deblurring losses, ensuring both stable and high-fidelity reconstruction. We further contribute AsyncEv-Deblur, a new high-resolution RGB–Event dataset captured with our asynchronous system. Experiments demonstrate that our method achieves state-of-the-art performance on both our challenging dataset and existing benchmarks, substantially improving reconstruction robustness under severe motion blur.",
  links: [
    { label: "Paper", url: "#", icon: "pdf" },
    { label: "Code", url: "#", icon: "github" },
    { label: "Video", url: "#", icon: "youtube" },
    { label: "Dataset", url: "#", icon: "database" }
  ],
  heroVideoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Replace with your project's teaser video URL
  methodDescription: "This section describes your proposed method. Explain the architecture, the loss functions, and the training pipeline. You can mention the specific modules (e.g., Diffusion Transformer, Gaussian Splatting Renderer) and how they interact. Replace the image URL below with your actual pipeline diagram.",
  methodImageUrl: "https://picsum.photos/seed/method/800/400", // Replace with your pipeline diagram URL
  comparisons: [
    {
      id: "c1",
      label: "Baseline Method vs Our Method",
      imageLeft: "https://picsum.photos/seed/baseline/600/400?grayscale", // Replace with baseline result
      imageRight: "https://picsum.photos/seed/ours/600/400", // Replace with your result
      description: "Interactive comparison showing improvement in detail/texture/geometry."
    },
    {
      id: "c2",
      label: "Ablation: No Refinement vs Full Model",
      imageLeft: "https://picsum.photos/seed/ablation/600/400?blur=5",
      imageRight: "https://picsum.photos/seed/fullmodel/600/400",
      description: "Visualizing the impact of the proposed refinement module."
    }
  ],
  metrics: [
    { epoch: 0, psnr: 15.0, ssim: 0.50, lpips: 0.60 },
    { epoch: 10, psnr: 20.0, ssim: 0.65, lpips: 0.50 },
    { epoch: 20, psnr: 24.5, ssim: 0.75, lpips: 0.35 },
    { epoch: 30, psnr: 28.0, ssim: 0.82, lpips: 0.25 },
    { epoch: 40, psnr: 30.5, ssim: 0.89, lpips: 0.15 },
    { epoch: 50, psnr: 32.0, ssim: 0.93, lpips: 0.10 },
  ]
};