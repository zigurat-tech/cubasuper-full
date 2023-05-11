import dynamic from "next/dynamic";
export { default as HomeBanner } from "./HomeBanner";

export const HomeBannerDynamic = dynamic(() => import("./HomeBanner"));
