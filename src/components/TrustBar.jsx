import {
    Globe2,
    HeartHandshake,
    ShieldCheck
} from "lucide-react";

function TrustBar() {
    return (
        <div className="trust-bar">
            <div className="container trust-bar-inner">

                <div className="trust-item">
                    <Globe2 />
                    <span>Worldwide Shipping</span>
                </div>

                <span className="trust-divider"></span>

                <div className="trust-item">
                    <HeartHandshake />
                    <span>Handmade in India</span>
                </div>

                <span className="trust-divider"></span>

                <div className="trust-item">
                    <ShieldCheck />
                    <span>Secure Payments</span>
                </div>

            </div>
        </div>
    );
}

export default TrustBar;