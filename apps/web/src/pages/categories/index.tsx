import {serverApiClient} from "@api/server";
import {GetServerSideProps} from "next";

export default function Page() {}

export const getServerSideProps = (async (ctx) => {
	ctx.res.setHeader(
		"Cache-Control",
		"public, s-maxage=60, stale-while-revalidate=119",
	);

	try {
		const { results } = await serverApiClient.get("/backend/v1/category/");

		if (!results[0]?.subcategories?.[0]) {
			return {
				redirect: {
					destination: `${ctx.locale === "en" ? "/en" : ""}/categories/0/1`,
					permanent: false,
				},
			};
		}
		return {
			redirect: {
				destination: `${ctx.locale === "en" ? "/en" : ""}/categories/${
					results[0].id
				}/${results[0].subcategories[0].id}`,
				permanent: false,
			},
		};
	} catch (e) {
		return {
			redirect: {
				destination: `${ctx.locale === "en" ? "/en" : ""}/server-error`,
				permanent: false,
			},
		};
	}
}) as GetServerSideProps;
