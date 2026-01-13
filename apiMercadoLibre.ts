import { MercadoPagoConfig, Preference } from "mercadopago";




export const getWalletMP = async ({ token, shoppingCart, tag }: { token: string, shoppingCart: any, tag: string }): Promise<any> => {


    const productsItem = shoppingCart.data.find((item: any) => item.type === "products");
    const itemsAdapater = productsItem?.data.map((product: any) => ({
        id: product.idEntity,
        title: product.nombre,
        quantity: product.cantidad,
        unit_price: parseFloat(String(product.importeTotal).replace(/,/g, '')),
    })) || [];

    const clientMercadoPago = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' });
    const preference = new Preference(clientMercadoPago);


    try {
        const result = await preference.create({
            body: {
                items: [
                    ...itemsAdapater
                ],
                back_urls: {
                    success: `${process.env.MERCADO_PAGO_URL}/simulable/view/62/checkout/close/product/shipping/paid/summary`,
                    failure: `${process.env.MERCADO_PAGO_URL}/simulable/view/62/checkout/close/product/shipping/paid/summary`,
                    pending: `${process.env.MERCADO_PAGO_URL}/simulable/view/62/checkout/close/product/shipping/paid/summary`
                },
                auto_return: "approved",
            }
        });
        return { id: result.id };
    } catch (error) {
        return { error: 'Error creating preference' };
    }
}
