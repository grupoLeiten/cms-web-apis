import { ROUTE_TEMPLATE_CONFIG } from "~/config/routeTemplateConfig";
import { getVistaBORRAR } from "./apiContentSettings.server";

export const getDirectLink = async ({ request, idView, idMenu, token, idEntity = "" }: any) => {
    const result = await getVistaBORRAR({ params: { idView }, token });
    const { templateName } = result;

    // const url = new URL(request.url);
    // const paramsObj = Object.fromEntries(url.searchParams.entries());
    // const { idEntity, ...rest } = paramsObj;

    const route = `${ROUTE_TEMPLATE_CONFIG[templateName as keyof typeof ROUTE_TEMPLATE_CONFIG]({ idView, idMenu, idEntity, search: {}, modo: "/simulable" })}`;
    return route;
}