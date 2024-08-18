import {loadPaystackPop} from "@paystack/inline-js"
let paystackPromise;
const getPaystack = () => {
    if (!paystackPromise) {
        paystackPromise = loadPaystackPop(process.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
    }
    return paystackPromise;
};

export default getPaystack;