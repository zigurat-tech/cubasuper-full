import { Store } from "@store/store";
import { Zodios, makeApi } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";
import axios from "axios";
import { z } from "zod";

export const Subcategory = z.object({
	id: z.number().int(),
	name: z.string().max(255),
	name_trans: z.string().max(255).nullish(),
	category: z.object({
		id: z.number().int(),
		image: z.string(),
		name: z.string().max(255),
		name_trans: z.string().max(255).nullish(),
	}),
	definitions: z.array(
		z.object({
			id: z.number().int(),
			name: z.string().max(255),
			name_trans: z.string().max(255).nullish(),
		}),
	),
});

export type SubcategoryType = z.infer<typeof Subcategory>;

export const Category = z.object({
	id: z.number().int(),
	image: z.string(),
	promoted: z.boolean().optional(),
	name: z.string().max(255),
	name_trans: z.string().max(255).nullish(),
	subcategories: z.array(Subcategory),
});

export type CategoryType = z.infer<typeof Category>;

export const Definition = z.object({
	id: z.number().int(),
	subcategory: Subcategory,
	name: z.string().max(255),
	name_trans: z.string().max(255).nullish(),
});

export type DefinitionType = z.infer<typeof Definition>;

export const PatchedDefinition = z
	.object({
		id: z.number().int(),
		subcategory: Subcategory,
		name: z.string().max(255),
		name_trans: z.string().max(255).nullable(),
	})
	.partial();

export const PatchedSubcategory = z
	.object({
		id: z.number().int(),
		category: Category,
		name: z.string().max(255),
		name_trans: z.string().max(255).nullable(),
	})
	.partial();

export const AuthToken = z.object({
	username: z.string(),
	password: z.string(),
});

export const PatchedCategory = z
	.object({
		id: z.number().int(),
		image: z.string(),
		promoted: z.boolean(),
		name: z.string().max(255),
		name_trans: z.string().max(255).nullable(),
	})
	.partial();

export const Product = z.object({
	id: z.number().int(),
	image: z.string().url(),
	name: z.string().max(255),
	name_trans: z.string().max(255).nullish(),
	description: z.string().max(255),
	description_trans: z.string().max(255).nullish(),
	unit_of_measurement: z.string().max(255),
	unit_of_measurement_trans: z.string().max(255).nullish(),
	price: z.number().gte(0.01),
	stock: z.number().int(),
	gallery: z.string().array(),
	visible: z.boolean().optional(),
	sales: z.number().int().optional(),
	sku: z.string().max(255),
	modified: z.string().optional(),
	batch: z.number().int().nullish(),
	definition: Definition,
});

export const PatchedProduct = z
	.object({
		id: z.number().int(),
		image: z.string().url(),
		name: z.string().max(255),
		name_trans: z.string().max(255).nullable(),
		description: z.string().max(255),
		description_trans: z.string().max(255).nullable(),
		unit_of_measurement: z.string().max(255),
		unit_of_measurement_trans: z.string().max(255).nullable(),
		price: z.number().gte(0.01),
		stock: z.number().int(),
		visible: z.boolean(),
		sales: z.number().int(),
		sku: z.string().max(255),
		modified: z.string(),
		batch: z.number().int().nullable(),
		definition: z.number().int(),
	})
	.partial();

export const Slide = z.object({
	id: z.number().int(),
	image: z.string(),
	subtittle: z.string().max(255),
	subtittle_trans: z.string().max(255).nullish(),
	tittle: z.string().max(255),
	tittle_trans: z.string().max(255).nullish(),
	content: z.string().max(255),
	content_trans: z.string().max(255).nullish(),
	button: z.string().max(255),
	button_trans: z.string().max(255).nullish(),
	link: z.string().max(200).url(),
	visible: z.boolean().optional(),
	order: z.number().int().optional(),
});

export const PatchedSlide = z
	.object({
		id: z.number().int(),
		image: z.string(),
		subtittle: z.string().max(255),
		subtittle_trans: z.string().max(255).nullable(),
		tittle: z.string().max(255),
		tittle_trans: z.string().max(255).nullable(),
		content: z.string().max(255),
		content_trans: z.string().max(255).nullable(),
		button: z.string().max(255),
		button_trans: z.string().max(255).nullable(),
		link: z.string().max(200).url(),
		visible: z.boolean(),
		order: z.number().int(),
	})
	.partial();

export const ResponseProduct = z.object({
	count: z.number(),
	results: z.array(Product),
	total: z.number(),
});

export type Response<T> = {
	count: number;
	total: number;
	results: T[];
};

export type ProductType = z.infer<typeof Product>;
export type ResponseProductType = z.infer<typeof ResponseProduct>;

export const CheckoutPost = z.object({
	date_of_creation: z.string(),
	total: z.string(),
	user: z.string(),
	component: z
		.object({
			quantity: z.number(),
			actual_amount: z.number(),
			product: z.number(),
		})
		.array(),
});
export type CheckoutPostType = z.infer<typeof CheckoutPost>;

export const Banner = z.object({
	id: z.number(),
	name: z.string(),
	image: z.string(),
	position: z.number(),
	visible: z.boolean(),
});
export type BannerType = z.infer<typeof Banner>;

const endpoints = makeApi([
	{
		method: "post",
		path: "/backend/v1/token/",
		requestFormat: "form-url",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AuthToken,
			},
		],
		response: AuthToken,
	},
	{
		method: "post",
		path: "/backend/v1/token/refresh/",
		requestFormat: "form-url",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({
					refresh:z.string()
				}),
			},
		],
		response: z.object({
			access:z.string()
		}),
	},
	{
		method: "post",
		path: "/backend/v1/user/",
		requestFormat: "form-url",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({
					username: z.string(),
					first_name: z.string(),
					last_name: z.string(),
					password: z.string(),
					email: z.string().email(),
				}),
			},
		],
		response: z.object({
			username: z.string(),
			first_name: z.string(),
			last_name: z.string(),
			password: z.string(),
			email: z.string().email(),
		}),
	},
	{
		method: "post",
		path: "/backend/v1/checkout/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CheckoutPost,
			},
		],
		response: z.any(),
	},
	{
		method: "get",
		path: "/backend/v1/category/",
		requestFormat: "json",
		response: z.object({
			count: z.number(),
			results: z.array(Category),
			total: z.number(),
		}),
	},
	{
		method: "get",
		path: "/backend/v1/about/",
		requestFormat: "json",
		response: z.object({
			id: z.number(),
			info: z.string(),
			info_trans: z.string(),
		}).array(),
	},
	{
		method: "get",
		path: "/backend/v1/contact/",
		requestFormat: "json",
		response: z.object({
			name: z.string(),
			email: z.string(),
			description: z.string(),
			get_full_name: z.string(),
			last_name: z.string(),
			phone_number: z.string(),
		}).array(),
	},
	{
		method: "post",
		path: "/backend/v1/category/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Category,
			},
		],
		response: Category,
	},
	{
		method: "get",
		path: "/backend/v1/category/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Category,
	},
	{
		method: "put",
		path: "/backend/v1/category/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Category,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Category,
	},
	{
		method: "patch",
		path: "/backend/v1/category/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PatchedCategory,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Category,
	},
	{
		method: "delete",
		path: "/backend/v1/category/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: z.void(),
	},
	{
		method: "get",
		path: "/backend/v1/category/promoted/",
		requestFormat: "json",
		response: z.array(Category),
	},
	{
		method: "get",
		path: "/backend/v1/definition/",
		requestFormat: "json",
		response: z.array(Definition),
	},
	{
		method: "post",
		path: "/backend/v1/definition/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Definition,
			},
		],
		response: Definition,
	},
	{
		method: "get",
		path: "/backend/v1/definition/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Definition,
	},
	{
		method: "put",
		path: "/backend/v1/definition/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Definition,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Definition,
	},
	{
		method: "patch",
		path: "/backend/v1/definition/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PatchedDefinition,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Definition,
	},
	{
		method: "delete",
		path: "/backend/v1/definition/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: z.void(),
	},
	{
		method: "get",
		path: "/backend/v1/product/",
		requestFormat: "json",
		parameters: [
			{
				name: "offset",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "max",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "subcategory",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "category",
				type: "Query",
				schema: z.number().optional(),
			},
			{
				name: "definition",
				type: "Query",
				schema: z.number().optional(),
			},
		],
		response: z.object({
			count: z.number(),
			results: z.array(Product),
			total: z.number(),
		}),
	},
	{
		method: "post",
		path: "/backend/v1/product/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Product,
			},
		],
		response: Product,
	},
	{
		method: "get",
		path: "/backend/v1/product/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: z.object({
			related: z.array(Product),
			results: z.array(Product),
		}),
	},
	{
		method: "get",
		path: "/backend/v1/search/:query/",
		requestFormat: "json",
		parameters: [
			{
				name: "query",
				type: "Path",
				schema: z.string(),
			},
			{
				name: "brand",
				type: "Query",
				schema: z.string().optional(),
			},
		],

		response: z.object({
			brands: z.string().array(),
			products: z.array(Product),
			tree: z.object({}),
		}),
	},
	{
		method: "put",
		path: "/backend/v1/product/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Product,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Product,
	},
	{
		method: "patch",
		path: "/backend/v1/product/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PatchedProduct,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Product,
	},
	{
		method: "delete",
		path: "/backend/v1/product/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: z.void(),
	},
	{
		method: "get",
		path: "/backend/v1/slide/",
		requestFormat: "json",
		response: z.array(Slide),
	},
	{
		method: "post",
		path: "/backend/v1/slide/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Slide,
			},
		],
		response: Slide,
	},
	{
		method: "get",
		path: "/backend/v1/slide/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Slide,
	},
	{
		method: "put",
		path: "/backend/v1/slide/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Slide,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Slide,
	},
	{
		method: "patch",
		path: "/backend/v1/slide/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PatchedSlide,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Slide,
	},
	{
		method: "delete",
		path: "/backend/v1/slide/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: z.void(),
	},
	{
		method: "get",
		path: "/backend/v1/subcategory/",
		requestFormat: "json",
		response: z.array(Subcategory),
	},
	{
		method: "post",
		path: "/backend/v1/subcategory/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Subcategory,
			},
		],
		response: Subcategory,
	},
	{
		method: "get",
		path: "/backend/v1/subcategory/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Subcategory,
	},
	{
		method: "put",
		path: "/backend/v1/subcategory/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: Subcategory,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Subcategory,
	},
	{
		method: "patch",
		path: "/backend/v1/subcategory/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PatchedSubcategory,
			},
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: Subcategory,
	},
	{
		method: "delete",
		path: "/backend/v1/subcategory/:id/",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.number().int(),
			},
		],
		response: z.void(),
	},
	{
		method: "get",
		path: "/backend/v1/index/",
		requestFormat: "json",
		response: z.object({
			results: z.object({
				banners: z.array(Banner),
				novedades: z.array(Product),
				populares: z.array(Product),
				recomendados: z.array(Product),
			}),
		}),
	},
]);

const clientBaseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
const serverBaseURL = `${process.env.BACKEND_URL}`;

export const apiClient = new Zodios( endpoints, {
	axiosConfig:{
		baseURL:clientBaseURL
	},
	validate: "none",
});

export const serverApiClient = new Zodios(endpoints, {
	axiosConfig:{
		baseURL:serverBaseURL
	},
	validate: "none",
});

export const api = new ZodiosHooks("cubasuper-api", apiClient);
