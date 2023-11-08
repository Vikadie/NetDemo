import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue {
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CTX = createContext<StoreContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() {
    const context = useContext(CTX);

    if (context === undefined) {
        throw Error("Oops - we do not seem to be inside the provider");
    }

    return context;
}

export function CtxProvider({ children }: PropsWithChildren<any>) {
    const [basket, setBasket] = useState<Basket | null>(null);

    const removeItem = (productId: number, quantity: number) => {
        if (!basket) return;
        const items = [...basket.items];
        const itemIndex = items.findIndex((i) => i.productId === productId);
        if (itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;
            if (items[itemIndex].quantity <= 0) {
                items.splice(itemIndex, 1);
            }
            setBasket((prevState) => {
                return { ...prevState!, items };
            });
        }
    };

    return <CTX.Provider value={{ basket, setBasket, removeItem }}>{children}</CTX.Provider>;
}
