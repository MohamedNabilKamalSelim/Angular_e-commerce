export interface IOrderDetailsViewModel {
    productId: number;
    name: string;
    price: number;
    count: number;
    total: number;
    AVQuantity: number;
    imageUrl?: string;
    categoryid?: number;
}
