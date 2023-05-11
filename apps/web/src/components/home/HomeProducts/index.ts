import dynamic from "next/dynamic";
export { default as HomeProducts } from "./HomeProducts";

export const HomeProductsDynamic = dynamic(() => import("./HomeProducts"));
