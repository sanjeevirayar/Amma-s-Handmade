import { useEffect, useState } from "react";

function BackendStatus() {
    const [message, setMessage] = useState("Connecting to backend…");

    useEffect(() => {
        const controller = new AbortController();

        async function checkBackend() {
            try {
                const response = await fetch("/api/health", {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                const data = await response.json();

                setMessage(data.message);
            } catch (error) {
                if (error.name === "AbortError") return;

                setMessage(
                    "Cannot reach the backend. Check that it is running."
                );
            }
        }

        checkBackend();

        return () => controller.abort();
    }, []);

    return (
        <div className="container">
            <p role="status">{message}</p>
        </div>
    );
}

export default BackendStatus;