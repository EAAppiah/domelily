import {
  ref as dbRef,
  push,
  set,
  update,
  serverTimestamp,
  type Database,
} from "firebase/database";
import { useDatabase, useDatabaseObject, useDatabaseList } from "vuefire";
import type { Ref } from "vue";
import { computed } from "vue";

// Type definitions
export interface Service {
  id: string;
  name: string;
  price: number;
  createdAt?: any;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  credits: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: "cash" | "card" | "credits" | "mixed";
  customer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  timestamp?: any;
}

export interface ServiceInput {
  name: string;
  price: number;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone?: string;
  credits?: number;
}

export interface TransactionInput {
  items: CartItem[];
  total: number;
  paymentMethod: string;
  customer?: Customer | null;
}

export const useFirebaseData = () => {
  const db = useDatabase() as Database;

  // Reactive data from Firebase with proper typing
  const services = useDatabaseList<Service>(dbRef(db, "services"));
  const customers = useDatabaseList<Customer>(dbRef(db, "customers"));
  
  // Get transactions without transform option, then sort with computed
  const transactionsRaw = useDatabaseList<Transaction>(dbRef(db, "transactions"));
  
  // Create a computed property to sort transactions
  const transactions = computed(() => {
    if (!transactionsRaw.value) return [];
    
    return [...transactionsRaw.value].sort((a: Transaction, b: Transaction) => {
      const aTime =
        typeof a.timestamp === "number"
          ? a.timestamp
          : a.timestamp?.toMillis?.() || 0;
      const bTime =
        typeof b.timestamp === "number"
          ? b.timestamp
          : b.timestamp?.toMillis?.() || 0;
      return bTime - aTime;
    });
  });

  // Add new service
  const addService = async (
    serviceData: ServiceInput
  ): Promise<string | null> => {
    try {
      const servicesRef = dbRef(db, "services");
      const newServiceRef = push(servicesRef);
      await set(newServiceRef, {
        ...serviceData,
        id: newServiceRef.key,
        createdAt: serverTimestamp(),
      });
      return newServiceRef.key;
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  };

  // Add new customer
  const addCustomer = async (
    customerData: CustomerInput
  ): Promise<string | null> => {
    try {
      const customersRef = dbRef(db, "customers");
      const newCustomerRef = push(customersRef);
      await set(newCustomerRef, {
        ...customerData,
        id: newCustomerRef.key,
        credits: customerData.credits || 0,
        createdAt: serverTimestamp(),
      });
      return newCustomerRef.key;
    } catch (error) {
      console.error("Error adding customer:", error);
      throw error;
    }
  };

  // Add new transaction
  const addTransaction = async (
    transactionData: TransactionInput
  ): Promise<string | null> => {
    try {
      const transactionsRef = dbRef(db, "transactions");
      const newTransactionRef = push(transactionsRef);
      await set(newTransactionRef, {
        ...transactionData,
        id: newTransactionRef.key,
        timestamp: serverTimestamp(),
      });
      return newTransactionRef.key;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  // Update customer credits
  const updateCustomerCredits = async (
    customerId: string,
    newCredits: number
  ): Promise<void> => {
    try {
      const customerRef = dbRef(db, `customers/${customerId}`);
      await update(customerRef, {
        credits: newCredits,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating customer credits:", error);
      throw error;
    }
  };

  // Get customer by ID (reactive) - fixed return type
  const getCustomer = (customerId: string) => {
    return useDatabaseObject<Customer>(dbRef(db, `customers/${customerId}`));
  };

  return {
    services: services as Ref<Service[]>,
    customers: customers as Ref<Customer[]>,
    transactions,
    addService,
    addCustomer,
    addTransaction,
    updateCustomerCredits,
    getCustomer,
  };
};