import type { FaqItem } from "@/components/Faq";
import type { Testimonial } from "@/components/Testimonials";

export const testimonials: Testimonial[] = [
  {
    name: "Rucell",
    topic: "Code Quality",
    text: "I'm very satisfied with how the FreshCart app works and the team's support. They responded quickly and provided excellent cooperation and support. I highly recommend working with them for any food delivery project.",
  },
  {
    name: "ajaythakkar",
    topic: "Code Quality",
    text: "Five stars! I've purchased multiple products from Infidec Marketplace and they are easily the best in the market. Clean code and excellent work. Highly recommended!",
  },
  {
    name: "Zyoma855",
    topic: "Customizability",
    text: "Very good software product. It is very convenient that everything is in one assembly - admin panel, public site and application. Also very well written documentation.",
  },
  {
    name: "Priya Nair",
    topic: "Design Quality",
    text: "The NutriPlan UI is beautiful and our dietitians loved the panel. We launched our diet coaching app in under three weeks.",
  },
  {
    name: "Marcus L.",
    topic: "Customer Support",
    text: "Installation support was fast and professional. They configured the server, SSL and push notifications for us in two days.",
  },
  {
    name: "Harshit",
    topic: "Feature Availability",
    text: "HomeChef had every feature we needed for our home-food marketplace - chef onboarding, commissions and live tracking out of the box.",
  },
  {
    name: "Sofia R.",
    topic: "Documentation",
    text: "Documentation is detailed and easy to follow. Even our junior developer set up the Flutter app and Laravel panel without problems.",
  },
  {
    name: "Daniel K.",
    topic: "Code Quality",
    text: "Well-structured Flutter code with clean state management. Customising the theme to our gym brand took just an afternoon.",
  },
  {
    name: "Meera S.",
    topic: "Value for Money",
    text: "The FitBite meal subscription app saved us months of development and a big budget. Great value and regular updates.",
  },
];

export const homeFaqs: FaqItem[] = [
  {
    q: "What is included when I purchase a Infidec Marketplace product source code?",
    a: "Most products include complete source code, an admin panel, APIs, documentation, and additional components such as mobile apps and websites, depending on the package. These ready-made health, food and wellness app solutions are designed to help businesses launch faster without building everything from scratch.",
  },
  {
    q: "What is the difference between a Regular License and an Extended License?",
    a: "A Regular License gives you the full source code for one end product and one domain with 6 months of guidance support. An Extended License adds ready-to-launch configuration of your Android, iOS, web and admin panel plus 6 months of dedicated support.",
  },
  {
    q: "What support is included after purchase?",
    a: "Every purchase includes free lifetime updates and 6 months of support for installation questions, bug fixes and documentation guidance, delivered by the same team that builds the product.",
  },
  {
    q: "Are Infidec Marketplace products production-ready?",
    a: "Yes. Our apps are used by thousands of businesses worldwide. They are built with Flutter, Laravel and Next.js, follow secure coding practices and are tested before every release.",
  },
  {
    q: "Do you offer both website and app source code solutions?",
    a: "Yes. Most products ship with Android and iOS apps built in Flutter, a responsive website or PWA, and a Laravel admin panel.",
  },
  {
    q: "How can I contact the support team?",
    a: "You can reach us through the Contact Us page, by email at contact@infidec.com or on WhatsApp. We usually reply within 1-2 business days.",
  },
  {
    q: "What makes Infidec Marketplace different from other source code providers?",
    a: "We focus exclusively on health, food and wellness products. Every product is designed, developed and supported in-house, so you get consistent quality, faster fixes and domain-specific features.",
  },
];

export const allFaqs: FaqItem[] = [
  ...homeFaqs,
  {
    q: "Can I get a refund?",
    a: "Because source code is a digital product, refunds are available only if the product is not as described or has a critical issue we cannot fix within a reasonable time. See our Refund Policy for details.",
  },
  {
    q: "Do you provide installation and reskinning services?",
    a: "Yes. Choose one of our installation plans and our experts will set up your server, database, admin panel, SSL, push notifications and publish your apps to the Play Store and App Store.",
  },
  {
    q: "Can I customise the app design and features?",
    a: "Absolutely. You receive the complete source code, so you can change colours, logos, fonts and features. Our team also offers paid customisation on request.",
  },
  {
    q: "Which payment methods are supported inside the apps?",
    a: "Our apps support popular gateways such as Razorpay, Stripe, PayPal, Paystack, Flutterwave and Cashfree, with more available as add-ons.",
  },
];
