import { Footer } from "./footer/Footer";
import {
	CartDrawerDynamic,
	Header,
	ProductModalDynamic,
} from "@components/layout";
import React from "react";

type LayoutProps = {
	children: JSX.Element;
};

export function AppLayout({ children }: LayoutProps) {
	return (
		<React.Fragment>
			<Header />
			{children}
			<Footer />
			<ProductModalDynamic />
			<CartDrawerDynamic />
		</React.Fragment>
	);
}
