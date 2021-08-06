import { ControllerData, PageParams } from "../@types";

export const Paginated = ({page, direction, limit, sort}: PageParams) => function (
    _: any,
    __: string | symbol,
    desc: PropertyDescriptor,
) {
    const pre = desc.value;
    desc.value = async function ({ body, params, headers, query, claims, response }: any) {
        const pageRequest: PageParams = {
            page: parseInt(query.page) || page,
            limit: parseInt(query.limit) || limit,
            direction: query.direction || direction,
            sort: query.sort || sort,
        }
        return pre.apply(this, [{ body, params, headers, query, claims, page: pageRequest, response } as ControllerData])
    }
}

export function Route(route: string){
    return (constructor: Function) => {
        Reflect.defineMetadata("path", route, constructor.prototype)
    }
}
