import { MercadoPagoConfig, Preference } from "mercadopago";




export const getWalletMP = async ({ token, shoppingCart, tag }: { token: string, shoppingCart: any, tag: string }): Promise<any> => {



    const productsItem = shoppingCart.data.find((item: any) => item.type === "products");

    const itemsAdapater = productsItem?.data.map((product: any) => {
        // Convertir formato europeo/español (1.333.333,32) a formato numérico estándar
        // Remover puntos (separadores de miles) y reemplazar coma (separador decimal) con punto
        return {
            id: product.idEntity,
            title: product.nombre,
            quantity: product.cantidad,
            unit_price: product.importeTotalConImpuestosAsNumber,
        }
    }) || [];

    const clientMercadoPago = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' });
    const preference = new Preference(clientMercadoPago);

    const itemEnvio = {
        id: "costo-entrega",
        title: "Costo de entrega",
        quantity: 1,
        unit_price: shoppingCart.costoEntregaFinalAsNumber,
    }

    try {
        const result = await preference.create({
            body: {
                items: [
                    ...itemsAdapater,
                    itemEnvio,
                ],
                back_urls: {
                    success: `${process.env.MERCADO_PAGO_URL}/success?idView=84&idMenu=1&tag=${tag}`,
                    failure: `${process.env.MERCADO_PAGO_URL}/success?idView=85&idMenu=1&tag=${tag}`,
                    pending: `${process.env.MERCADO_PAGO_URL}/success?idView=85&idMenu=1&tag=${tag}`
                },
                auto_return: "approved",
            }
        });
        return { id: result.id };
    } catch (error) {
        return { error: 'Error creating preference' };
    }
}
