export interface IOrder {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    date: string;
    userEmail: string | null;
}
