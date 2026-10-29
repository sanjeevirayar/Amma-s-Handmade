import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    Search,
    X,
    UserRound,
    Heart,
    ShoppingBag,
    Menu,
    ChevronDown
} from "lucide-react";

import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    CartContext
} from "../context/CartContext";

import {
    WishlistContext
} from "../context/WishlistContext";

import {
    ProductContext
} from "../context/ProductContext";


function Navbar() {

    const {
        wishlistCount
    } = useContext(
        WishlistContext
    );


    const {
        cartCount
    } = useContext(
        CartContext
    );


    const {
        products,
        loading,
        error
    } = useContext(
        ProductContext
    );


    const [
        searchOpen,
        setSearchOpen
    ] = useState(false);


    const [
        searchQuery,
        setSearchQuery
    ] = useState("");


    const [
        menuOpen,
        setMenuOpen
    ] = useState(false);


    const searchInputRef =
        useRef(null);

    const searchButtonRef =
        useRef(null);


    const navigate =
        useNavigate();


    const query =
        searchQuery
            .trim()
            .toLowerCase();


    /* =====================================================
       FOCUS SEARCH
    ===================================================== */

    useEffect(() => {

        if (searchOpen) {

            searchInputRef.current
                ?.focus();

        }

    }, [searchOpen]);


    /* =====================================================
       PRODUCT SEARCH
    ===================================================== */

    const matchingProducts =
        query
            ? products.filter(
                (product) => {

                    const matchesName =
                        product.name
                            ?.toLowerCase()
                            .includes(query);


                    const matchesCategory =
                        product.category
                            ?.toLowerCase()
                            .includes(query);


                    const matchesCollections =
                        (
                            product.collections ??
                            []
                        ).some(
                            (collection) =>
                                collection
                                    .toLowerCase()
                                    .includes(query)
                        );


                    return (
                        matchesName ||
                        matchesCategory ||
                        matchesCollections
                    );

                }
            )

            : [];


    /* =====================================================
       SEARCH SUBMIT
    ===================================================== */

    function handleSearchSubmit(
        event
    ) {

        event.preventDefault();


        const term =
            searchQuery.trim();


        if (!term) {
            return;
        }


        navigate(
            `/shop?q=${encodeURIComponent(
                term
            )}`
        );


        setSearchOpen(false);

        setSearchQuery("");

    }


    return (
        <header
            className="site-header"
            onKeyDown={(event) => {

                if (
                    event.key ===
                        "Escape" &&
                    searchOpen
                ) {

                    event.preventDefault();

                    setSearchOpen(false);

                    searchButtonRef.current
                        ?.focus();

                }

            }}
        >

            <div className="container nav-wrapper">


                {/* =================================================
                    BRAND
                ================================================= */}

                <Link
                    to="/"
                    className="brand-logo"
                    aria-label="Amma's Handmade Home"
                >

                    <img
                        src="/images/branding/ammas-handmade-logo.png"
                        alt="Amma's Handmade"
                        className="navbar-logo-image"
                    />

                </Link>


                {/* =================================================
                    DESKTOP NAVIGATION
                ================================================= */}

                <nav className="desktop-nav">

                    <NavLink
                        to="/shop"
                        className="nav-dropdown-link"
                    >

                        Shop

                        <ChevronDown />

                    </NavLink>


                    <NavLink
                        to="/collections"
                        className="nav-dropdown-link"
                    >

                        Collections

                        <ChevronDown />

                    </NavLink>


                    <NavLink to="/gifts">

                        Gifts

                    </NavLink>


                    <NavLink to="/custom-orders">

                        Custom Orders

                    </NavLink>


                    <NavLink to="/our-story">

                        Our Story

                    </NavLink>


                    <NavLink to="/learn-with-amma">

                        Learn with Amma

                    </NavLink>

                </nav>


                {/* =================================================
                    ACTION ICONS
                ================================================= */}

                <div className="nav-actions">


                    {/* SEARCH */}

                    <button
                        ref={searchButtonRef}
                        type="button"
                        className="icon-button"
                        aria-label={
                            searchOpen
                                ? "Close search"
                                : "Search products"
                        }
                        aria-expanded={
                            searchOpen
                        }
                        aria-controls="navbar-search-panel"
                        onClick={() => {

                            setSearchOpen(
                                (open) =>
                                    !open
                            );

                            setMenuOpen(false);

                        }}
                    >

                        {searchOpen
                            ? <X />
                            : <Search />}

                    </button>


                    {/* ACCOUNT */}

                    <button
                        type="button"
                        className="icon-button account-button"
                        aria-label="Account"
                    >

                        <UserRound />

                    </button>


                    {/* WISHLIST */}

                    <Link
                        to="/wishlist"
                        className="icon-button wishlist-button"
                        aria-label={`Wishlist, ${wishlistCount} ${
                            wishlistCount === 1
                                ? "saved product"
                                : "saved products"
                        }`}
                    >

                        <Heart />


                        {wishlistCount > 0 && (

                            <span
                                className="wishlist-count"
                                aria-hidden="true"
                            >

                                {wishlistCount}

                            </span>

                        )}

                    </Link>


                    {/* CART */}

                    <Link
                        to="/cart"
                        className="icon-button cart-button"
                        aria-label={`Shopping bag, ${cartCount} ${
                            cartCount === 1
                                ? "item"
                                : "items"
                        }`}
                    >

                        <ShoppingBag />


                        <span className="cart-count">

                            {cartCount}

                        </span>

                    </Link>


                    {/* MOBILE MENU */}

                    <button
                        type="button"
                        className="mobile-menu-button"
                        aria-label={
                            menuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={
                            menuOpen
                        }
                        aria-controls="mobile-navigation"
                        onClick={() => {

                            setMenuOpen(
                                (open) =>
                                    !open
                            );

                            setSearchOpen(false);

                        }}
                    >

                        {menuOpen
                            ? <X />
                            : <Menu />}

                    </button>

                </div>

            </div>


            {/* =====================================================
                MOBILE NAVIGATION
            ===================================================== */}

            {menuOpen && (

                <nav
                    id="mobile-navigation"
                    className="mobile-navigation"
                    aria-label="Mobile navigation"
                >

                    <div className="container">


                        <NavLink
                            to="/shop"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >

                            Shop

                        </NavLink>


                        <NavLink
                            to="/collections"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >

                            Collections

                        </NavLink>


                        <NavLink
                            to="/gifts"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >

                            Gifts

                        </NavLink>


                        <NavLink
                            to="/custom-orders"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >

                            Custom Orders

                        </NavLink>


                        <NavLink
                            to="/our-story"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >

                            Our Story

                        </NavLink>


                        <NavLink
                            to="/learn-with-amma"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >

                            Learn with Amma

                        </NavLink>


                    </div>

                </nav>

            )}


            {/* =====================================================
                SEARCH PANEL
            ===================================================== */}

            {searchOpen && (

                <div
                    id="navbar-search-panel"
                    className="navbar-search-panel"
                >

                    <div className="container">


                        <form
                            role="search"
                            onSubmit={
                                handleSearchSubmit
                            }
                        >

                            <label htmlFor="navbar-search-input">

                                Search Amma&apos;s Handmade

                            </label>


                            <input
                                ref={
                                    searchInputRef
                                }
                                id="navbar-search-input"
                                type="search"
                                placeholder="Search bags, jewellery, gifts..."
                                value={
                                    searchQuery
                                }
                                onChange={(event) =>
                                    setSearchQuery(
                                        event.target.value
                                    )
                                }
                            />

                        </form>


                        {/* LOADING */}

                        {query && loading && (

                            <p
                                className="navbar-search-count"
                                role="status"
                            >

                                Searching products...

                            </p>

                        )}


                        {/* ERROR */}

                        {query &&
                            !loading &&
                            error && (

                                <p
                                    className="navbar-search-count"
                                    role="alert"
                                >

                                    Products could not be loaded.

                                </p>

                            )}


                        {/* RESULTS */}

                        {query &&
                            !loading &&
                            !error && (

                                <>

                                    <p
                                        className="navbar-search-count"
                                        role="status"
                                    >

                                        {matchingProducts.length ===
                                        0

                                            ? "No products found. Try another word."

                                            : `${matchingProducts.length} ${
                                                matchingProducts.length ===
                                                1
                                                    ? "product"
                                                    : "products"
                                            } found`
                                        }

                                    </p>


                                    <ul className="navbar-search-results">

                                        {matchingProducts
                                            .slice(
                                                0,
                                                5
                                            )
                                            .map(
                                                (
                                                    product
                                                ) => (

                                                    <li
                                                        key={
                                                            product.id
                                                        }
                                                    >

                                                        <Link
                                                            to={`/product/${product.slug}`}
                                                            className="navbar-search-result"
                                                            onClick={() => {

                                                                setSearchOpen(
                                                                    false
                                                                );

                                                                setSearchQuery(
                                                                    ""
                                                                );

                                                            }}
                                                        >

                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                alt=""
                                                            />


                                                            <span className="navbar-search-result-info">

                                                                <strong>

                                                                    {
                                                                        product.name
                                                                    }

                                                                </strong>


                                                                <span>

                                                                    {
                                                                        product.category
                                                                    }

                                                                </span>

                                                            </span>


                                                            <span className="navbar-search-result-price">

                                                                {
                                                                    product.price
                                                                }

                                                            </span>

                                                        </Link>

                                                    </li>

                                                )
                                            )}

                                    </ul>


                                    {matchingProducts.length >
                                        0 && (

                                        <Link
                                            to={`/shop?q=${encodeURIComponent(
                                                searchQuery.trim()
                                            )}`}
                                            className="navbar-search-view-all"
                                            onClick={() => {

                                                setSearchOpen(
                                                    false
                                                );

                                                setSearchQuery(
                                                    ""
                                                );

                                            }}
                                        >

                                            View all results (
                                            {
                                                matchingProducts.length
                                            }
                                            )

                                        </Link>

                                    )}

                                </>

                            )}

                    </div>

                </div>

            )}

        </header>
    );

}


export default Navbar;