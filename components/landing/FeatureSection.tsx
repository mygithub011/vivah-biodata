import Link from "next/link";

export default function FeatureSection() {
  const features = [
    {
      icon: "🎨",
      title: "50 Premium Templates",
      description: "Across 8 curated collections — Royal, Floral, Traditional, Modern, Luxury, Heritage, Elegant, and Regional.",
    },
    {
      icon: "⚡",
      title: "Live Preview",
      description: "See your own biodata rendered in real time as you type. Switch templates in one click.",
    },
    {
      icon: "🤖",
      title: "AI-Powered",
      description: "AI writes your 'About Me' section beautifully. Smart suggestions for every field.",
    },
    {
      icon: "📄",
      title: "HD PDF Download",
      description: "Professional print-quality PDF. No watermarks. Ready to share or print.",
    },
    {
      icon: "📱",
      title: "WhatsApp Ready",
      description: "Generate shareable cards, story images, and QR codes for instant sharing.",
    },
    {
      icon: "🔒",
      title: "Private & Secure",
      description: "Your data is encrypted and never shared. Delete your biodata anytime.",
    },
  ];

  const steps = [
    { num: "01", title: "Choose Your Style", desc: "Pick from Royal, Floral, Traditional, Modern, Luxury, or Heritage collections." },
    { num: "02", title: "Fill Your Details", desc: "Enter personal, family, education, and career details in a simple guided form." },
    { num: "03", title: "See Live Preview", desc: "Your biodata renders instantly. Switch templates without re-entering details." },
    { num: "04", title: "Download HD PDF", desc: "Pay ₹49 once. Download your premium biodata in HD quality, no watermark." },
  ];

  return (
    <>
      {/* How it works */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Create in 4 Simple Steps
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              From blank page to a beautiful biodata in under 2 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-amber-200 -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-700 to-red-900 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ShaadiBio?
            </h2>
            <p className="text-gray-500 text-lg">
              Not just a template — a complete biodata creation experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-red-100 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Honest Pricing</h2>
            <p className="text-gray-500 text-lg">One-time payment. No subscriptions. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "₹0",
                features: ["Watermarked PDF", "3 basic templates", "Standard quality"],
                cta: "Get Started Free",
                highlighted: false,
              },
              {
                name: "Premium",
                price: "₹49",
                badge: "Most Popular",
                features: ["All 50 templates", "HD PDF — no watermark", "All 8 collections", "Instant download"],
                cta: "Create Premium Biodata",
                highlighted: true,
              },
              {
                name: "Premium Plus",
                price: "₹99",
                features: ["Everything in Premium", "AI-written About Me", "Bilingual (Hindi + English)", "WhatsApp share card", "Unlimited downloads"],
                cta: "Get Premium Plus",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 ${plan.highlighted ? "bg-gradient-to-br from-red-700 to-red-900 text-white shadow-2xl scale-105" : "bg-white border border-gray-100 shadow-sm"}`}
              >
                {plan.badge && (
                  <span className="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                    {plan.badge}
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                <div className={`text-4xl font-bold mb-6 ${plan.highlighted ? "text-amber-300" : "text-red-700"}`}>{plan.price}</div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlighted ? "text-red-100" : "text-gray-600"}`}>
                      <span className={`text-base ${plan.highlighted ? "text-amber-300" : "text-green-500"}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/collections"
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? "bg-amber-400 hover:bg-amber-500 text-gray-900"
                      : "border-2 border-red-700 text-red-700 hover:bg-red-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">Loved by Families Across India</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Delhi",
                text: "Created a beautiful biodata for my son in just 10 minutes! The Royal Collection design is absolutely stunning.",
                rating: 5,
              },
              {
                name: "Ramesh Patel",
                location: "Ahmedabad",
                text: "The live preview feature is amazing. We tried 5 different templates before choosing the perfect one. Worth every rupee!",
                rating: 5,
              },
              {
                name: "Sunita Iyer",
                location: "Chennai",
                text: "Finally a biodata maker that looks premium! The Traditional Hindu template was exactly what our family wanted.",
                rating: 5,
              },
            ].map((review) => (
              <div key={review.name} className="bg-amber-50 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3 text-amber-400">
                  {"★".repeat(review.rating)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-gray-400 text-xs">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
