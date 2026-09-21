import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "../types";

export function useOrderStatus(ref: string | null) {
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!ref) return;
    
        supabase
          .from("orders")
          .select("*")
          .eq("order_reference", ref)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Помилка отримання замовлення:", error);
              return;
            }
            setOrder(data);
    
        });
    
        const subscription = supabase
          .channel("public:orders")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "orders",
              filter: `order_reference=eq.${ref}`,
            },
            (payload) => {
              setOrder(payload.new as Order);
            }
            
        ).subscribe();
    
        return () => {
          supabase.removeChannel(subscription);
        };

    }, [ref]);

    return order;
}