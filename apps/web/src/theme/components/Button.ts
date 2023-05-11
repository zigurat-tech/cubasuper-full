import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
	// The styles all button have in common
	baseStyle: {
		borderRadius: "base", // <-- border radius is same for all variants and sizes
	},
	// Two sizes: sm and md
	sizes: {
		sm: {
			fontSize: "sm",
			px: 4, // <-- px is short for paddingLeft and paddingRight
			py: 3, // <-- py is short for paddingTop and paddingBottom
		},
		md: {
			fontSize: "md",
			px: 6, // <-- these values are tokens from the design system
			py: 4, // <-- these values are tokens from the design system
		},
	},
	// Two variants: outline and solid
	variants: {
		primary: {
			backgroundColor: "selected",
			border: "2px solid",
			borderColor: "selected",
			borderRadius: "2rem",
			color: "white",
			fontWeight: 400,
			fontSize: "sm",
			boxShadow: "0px 0px 5px rgb(10 22 39 / 20%)",
			transition: "all 0.5s",
			"&:hover": {
				boxShadow: "0px 0px 10px #0aa0df",
				transition: "all 0.5s",
			},
			"&:focus": {
				boxShadow: "0px 0px 5px #0aa0df !important",
			},
		},
		primarySolid: {
			border: "2px solid",
			borderColor: "selected",
			borderRadius: "2rem",
			color: "black",
			fontWeight: 400,
			fontSize: "sm",
			"&:hover": {
				boxShadow: "0px 0px 5px #0aa0df",
				backgroundColor: "selectedDark",
				borderColor: "selectedDark",
				color: "white",
			},
			"&:focus": {
				boxShadow: "0px 0px 5px #0aa0df !important",
			},
		},
		secondary: {
			border: "2px solid",
			borderColor: "primary",
			borderRadius: "2rem",
			backgroundColor: "primary",
			color: "white",
			"&:hover": {
				backgroundColor: "transparent",
				color: "primary",
				boxShadow: "0px 0px 5px #28374a",
			},
			"&:focus": {
				backgroundColor: "transparent",
				color: "primary",
				boxShadow: "0px 0px 5px #28374a",
			},
		},
		success: {
			backgroundColor: "green",
			color: "white",
			fontWeight: 400,
			fontSize: "sm",
			"&:hover": {
				opacity: 0.8,
				boxShadow: "0px 0px 5px green",
			},
			"&:focus": {
				opacity: 0.8,
				boxShadow: "0px 0px 5px green",
			},
		},
		error: {
			backgroundColor: "error.200",
			color: "white",
			fontWeight: 400,
			fontSize: "sm",
			"&:hover": {
				opacity: 0.8,
				boxShadow: "0px 0px 5px #E01020",
			},
			"&:focus": {
				opacity: 0.8,
				boxShadow: "0px 0px 5px #E01020",
			},
		},
	},
	// The default size and variant values
	defaultProps: {
		size: "md",
		variant: "primary",
	},
});
