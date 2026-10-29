import {
    createContext,
    useEffect,
    useState
} from "react";


export const ProductContext =
    createContext();


function ProductProvider({ children }) {

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const controller =
            new AbortController();


        async function loadProducts() {

            try {

                setLoading(true);
                setError("");


                const response =
                    await fetch(
                        "/api/products",
                        {
                            signal:
                                controller.signal,
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to load products."
                    );

                }


                const data =
                    await response.json();


                setProducts(data);

            } catch (err) {

                if (
                    err.name ===
                    "AbortError"
                ) {
                    return;
                }


                console.error(
                    "Product loading error:",
                    err
                );


                setError(
                    "We couldn't load the products."
                );

            } finally {

                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }

            }

        }


        loadProducts();


        return () => {

            controller.abort();

        };

    }, []);


    return (

        <ProductContext.Provider
            value={{
                products,
                loading,
                error
            }}
        >

            {children}

        </ProductContext.Provider>

    );

}


export default ProductProvider;