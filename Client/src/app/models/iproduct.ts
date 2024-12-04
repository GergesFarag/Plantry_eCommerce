export interface Iproduct {
    _id:string
    title:string;
    price:number;
    imageURL:string;
    category: string;
    quantity:number;
    description:string;
    hasDiscount:boolean;
    isFeatured: boolean;
    isDeleted:boolean;
    // isLoved:boolean;
    // addedToCart:boolean;
    // isDeleted:boolean;
}
