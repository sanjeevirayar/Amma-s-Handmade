import { Link } from "react-router-dom";

const faqs = [
    {
        question: "What does Amma mean?",
        answer:
            "Amma means mother in Tamil. Amma’s Handmade carries that feeling of care, with pieces made to feel as though your own mother created them for you.",
    },
    {
        question: "Will every handmade piece look exactly the same?",
        answer:
            "Small variations in shape, texture, and finish are part of handmade work. These details give each piece its own character.",
    },
    {
        question: "Can I discuss a custom design?",
        answer:
            "Yes. You can discuss your ideas, preferred colours, and reference images with us. The design, price, and making time need to be confirmed before a custom order goes ahead.",
    },
    {
        question: "How should I care for my purchase?",
        answer:
            "Care depends on the materials and construction of each piece. Check the Care Instructions section on its product page. If information is missing or you’re unsure, contact us before cleaning it.",
    },
    {
        question: "Can I learn a craft with Amma?",
        answer:
            "Amma shares her skills with people interested in learning. Visit Learn with Amma to explore workshop information. New batches are planned for Mondays, with availability and arrangements to be confirmed.",
    },
    {
        question: "Do the enquiry forms send my request?",
        answer:
            "Not yet. The custom-order and workshop forms currently let you preview your details only. To reach us, use the email address or phone number on our Contact page.",
    },
];

function FAQ() {
    return (
        <main className="faq-page">
            <div className="container">
                <header className="faq-header">
                    <span className="section-eyebrow">
                        A Little Help
                    </span>

                    <h1>Frequently asked questions</h1>

                    <p>
                        A few things you might like to know
                        about Amma’s Handmade.
                    </p>
                </header>

                <div className="faq-list">
                    {faqs.map((faq) => (
                        <details
                            className="faq-item"
                            key={faq.question}
                        >
                            <summary>{faq.question}</summary>

                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>

                <div className="faq-contact">
                    <h2>Still have a question?</h2>

                    <p>We’d be happy to hear from you.</p>

                    <Link to="/contact">
                        Contact Amma’s Handmade
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default FAQ;