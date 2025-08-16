import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

export interface PricingComponentProps {
  onTokenPurchase: (amount: number) => void;
  onClose: () => void;
}

const PricingComponent: React.FC<PricingComponentProps> = ({
  onTokenPurchase,
  onClose,
}) => {
  const [showComparison, setShowComparison] = useState(false);

  // Color definitions
  const colors = {
    primary: "#469b47", // Main green
    primaryDark: "#3A7D44", // Darker green
    light: "#f8faf8", // Very light greenish white
    offWhite: "#f5f7f5", // Slightly darker off-white
    textDark: "#1a2e1a", // Dark greenish text
    textLight: "#e8f5e9", // Light greenish text
    overlay: "rgba(0,0,0,0.5)", // Dark overlay
    purple: "#8b5cf6", // Purple for the new plan
    purpleDark: "#7c3aed", // Darker purple
  };

  return (
    <>
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-2 sm:mx-4 max-h-[98vh] sm:max-h-[95vh] overflow-y-auto shadow-xl border border-gray-100">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-8">
          <h3
            className="text-xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4"
            style={{ color: colors.textDark }}
          >
            Choose Your Token Plan
          </h3>
          <p className="text-gray-600 text-sm sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed px-2">
            Start with free tokens, then scale your business with plans designed
            for growth
          </p>
        </div>

        {/* Token Plans Grid - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8 items-start pt-4 sm:pt-8">
          {/* FREE Plan */}
          <div className="group relative bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-center mb-3 sm:mb-6 flex-1">
                <div className="inline-flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <svg
                    className="w-5 sm:w-7 h-5 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 text-center">
                  FREE STARTER
                </h4>
                <div className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-6 leading-relaxed h-8 sm:h-12 flex items-center justify-center px-2">
                  Perfect for testing our platform
                </div>
                <div className="mb-3 sm:mb-6 text-center">
                  <span className="text-2xl sm:text-4xl font-bold text-gray-900">₱0</span>
                  <span className="text-sm sm:text-base text-gray-600"> / 30 Days</span>
                </div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => onTokenPurchase(5)}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg text-sm sm:text-base"
                >
                  Get Free Tokens
                </button>
              </div>

              <div className="space-y-2 sm:space-y-4 mt-3 sm:mt-6">
                <p
                  className="font-semibold text-sm sm:text-base mb-2 sm:mb-4 pb-1 sm:pb-2 border-b border-gray-300 text-center"
                  style={{ color: colors.textDark }}
                >
                  What's Included:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      text: "5 FREE tokens",
                      highlight: true,
                      subtext: "(one-time for new users)",
                    },
                    { text: "Basic platform features" },
                    { text: "Email support" },
                    { text: "Getting started guide" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <div
                        className="w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <svg
                          className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-xs sm:text-sm leading-relaxed flex-1"
                        style={{ color: colors.textDark }}
                      >
                        {feature.highlight ? (
                          <strong>{feature.text}</strong>
                        ) : (
                          feature.text
                        )}
                        {feature.subtext && (
                          <span className="block text-xs text-gray-500 mt-0.5">
                            {feature.subtext}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mt-3 sm:mt-6 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-amber-200"
                style={{ backgroundColor: colors.light }}
              >
                <p className="text-xs text-amber-800 text-center font-medium">
                  ⚠️ Free tokens expire after 30 days of inactivity
                </p>
              </div>
            </div>
          </div>

          {/* STANDARD Plan */}
          <div
            className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border-3 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 shadow-lg h-full flex flex-col"
            style={{ borderColor: colors.primary }}
          >
            {/* Most Popular Badge - Mobile optimized */}
            <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 z-30">
              <div
                className="text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs font-bold shadow-lg whitespace-nowrap flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  boxShadow: "0 4px 15px rgba(70, 155, 71, 0.3)",
                }}
              >
                <span className="flex items-center justify-center">
                  ⭐ Most Popular
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div
              className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}05, ${colors.primaryDark}05)`,
              }}
            ></div>

            <div className="relative z-10">
              <div className="text-center mb-3 sm:mb-6 flex-1">
                <div
                  className="inline-flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  }}
                >
                  <svg
                    className="w-5 sm:w-7 h-5 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4
                  className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-center"
                  style={{ color: colors.textDark }}
                >
                  STANDARD
                </h4>
                <div className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-6 leading-relaxed h-8 sm:h-12 flex items-center justify-center px-2">
                  For growing businesses
                </div>
                <div className="mb-3 sm:mb-6 text-center">
                  <span
                    className="text-2xl sm:text-4xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    ₱500
                  </span>
                  <span className="text-sm sm:text-base text-gray-600"> / 1 month</span>
                </div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => onTokenPurchase(20)}
                  className="w-full text-white px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.primaryDark}, #2d5f32)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`;
                  }}
                >
                  Start Growing
                </button>
              </div>

              <div className="space-y-2 sm:space-y-4 mt-3 sm:mt-6">
                <p
                  className="font-semibold text-sm sm:text-base mb-2 sm:mb-4 pb-1 sm:pb-2 border-b text-center"
                  style={{
                    color: colors.textDark,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Everything in Free, Plus:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      text: "20 tokens monthly",
                      highlight: true,
                      subtext: "(₱25 per token)",
                    },
                    { text: "Priority support (24/7)" },
                    { text: "Low Tokens SMS Alert" },
                    { text: "Intuitive Dashboard" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <div
                        className="w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                        }}
                      >
                        <svg
                          className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-xs sm:text-sm leading-relaxed flex-1"
                        style={{ color: colors.textDark }}
                      >
                        {feature.highlight ? (
                          <strong>{feature.text}</strong>
                        ) : (
                          feature.text
                        )}
                        {feature.subtext && (
                          <span className="block text-xs text-gray-500 mt-0.5">
                            {feature.subtext}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mt-3 sm:mt-6 p-2 sm:p-3 rounded-lg sm:rounded-xl border"
                style={{
                  backgroundColor: colors.light,
                  borderColor: colors.primary + "20",
                }}
              >
                <p
                  className="text-xs font-semibold text-center"
                  style={{ color: colors.primary }}
                >
                   ⚠️ SMS-Alert • ✅ Dashboard • 📋 No contracts
                </p>
              </div>
            </div>
          </div>

          {/* BUSINESS Plan - New ₱1000 Plan */}
          <div
            className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border-3 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 shadow-lg h-full flex flex-col"
            style={{ borderColor: colors.purple }}
          >
            <div
              className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${colors.purple}05, ${colors.purpleDark}05)`,
              }}
            ></div>

            <div className="relative z-10">
              <div className="text-center mb-3 sm:mb-6 flex-1">
                <div
                  className="inline-flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.purpleDark})`,
                  }}
                >
                  <svg
                    className="w-5 sm:w-7 h-5 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h4
                  className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-center"
                  style={{ color: colors.textDark }}
                >
                  BUSINESS
                </h4>
                <div className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-6 leading-relaxed h-8 sm:h-12 flex items-center justify-center px-2">
                  For expanding businesses
                </div>
                <div className="mb-3 sm:mb-6 text-center">
                  <span
                    className="text-2xl sm:text-4xl font-bold"
                    style={{ color: colors.purple }}
                  >
                    ₱1,000
                  </span>
                  <span className="text-sm sm:text-base text-gray-600"> / 1 month</span>
                </div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => onTokenPurchase(50)}
                  className="w-full text-white px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.purpleDark})`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.purpleDark}, #6d28d9)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.purple}, ${colors.purpleDark})`;
                  }}
                >
                  Scale Business
                </button>
              </div>

              <div className="space-y-2 sm:space-y-4 mt-3 sm:mt-6">
                <p
                  className="font-semibold text-sm sm:text-base mb-2 sm:mb-4 pb-1 sm:pb-2 border-b text-center"
                  style={{
                    color: colors.textDark,
                    borderColor: colors.purple + "30",
                  }}
                >
                  Everything in Standard, Plus:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      text: "50 tokens monthly",
                      highlight: true,
                      subtext: "(₱20 per token)",
                      badge: "Save 20%",
                    },
                    { text: "Business analytics" },
                    { text: "Post Visibility" },
                    { text: "Advanced reporting" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <div
                        className="w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${colors.purple}, ${colors.purpleDark})`,
                        }}
                      >
                        <svg
                          className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span
                          className="text-xs sm:text-sm leading-relaxed"
                          style={{ color: colors.textDark }}
                        >
                          {feature.highlight ? (
                            <strong>{feature.text}</strong>
                          ) : (
                            feature.text
                          )}
                          {feature.subtext && (
                            <span className="block text-xs text-gray-500 mt-0.5">
                              {feature.subtext}
                            </span>
                          )}
                        </span>
                        {feature.badge && (
                          <span
                            className="inline-block ml-1 sm:ml-2 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, ${colors.purple}, ${colors.purpleDark})`,
                            }}
                          >
                            {feature.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mt-3 sm:mt-6 p-2 sm:p-3 rounded-lg sm:rounded-xl border"
                style={{
                  backgroundColor: colors.light,
                  borderColor: colors.purple + "20",
                }}
              >
                <p
                  className="text-xs font-semibold text-center"
                  style={{ color: colors.purple }}
                >
                  📊 Advanced reporting • 👥 Post Visibility
                </p>
              </div>
            </div>
          </div>

          {/* PREMIUM Plan */}
          <div className="group relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border-3 border-blue-400 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 shadow-lg h-full flex flex-col">
            {/* Premium Badge */}
            <div className="absolute -top-1 -right-1 w-5 sm:w-6 h-5 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="text-center mb-3 sm:mb-6 flex-1">
                <div className="inline-flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 bg-white rounded-xl sm:rounded-2xl mb-2 sm:mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <svg
                    className="w-5 sm:w-7 h-5 sm:h-7 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-center">PREMIUM</h4>
                <div className="text-xs sm:text-base text-blue-100 mb-3 sm:mb-6 leading-relaxed h-8 sm:h-12 flex items-center justify-center px-2">
                  Maximum savings & features
                </div>
                <div className="mb-3 sm:mb-6 text-center">
                  <span className="text-2xl sm:text-4xl font-bold text-white">₱5,000</span>
                  <span className="text-sm sm:text-base text-blue-100"> / 3 months</span>
                </div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => onTokenPurchase(300)}
                  className="w-full bg-white text-blue-600 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base"
                >
                  Go Premium
                </button>
              </div>

              <div className="space-y-2 sm:space-y-4 mt-3 sm:mt-6">
                <p className="font-semibold text-sm sm:text-base mb-2 sm:mb-4 pb-1 sm:pb-2 border-b border-blue-300/50 text-center">
                  Everything in Business, Plus:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      text: "300 tokens monthly",
                      highlight: true,
                      subtext: "(₱16 per token)",
                      badge: "Save 33%",
                    },
                    { text: "Dedicated account manager" },
                    { text: "Bulk discounts" },
                    { text: "Advanced analytics" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <svg
                          className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm text-white leading-relaxed">
                          {feature.highlight ? (
                            <strong>{feature.text}</strong>
                          ) : (
                            feature.text
                          )}
                          {feature.subtext && (
                            <span className="block text-xs text-blue-100 mt-0.5">
                              {feature.subtext}
                            </span>
                          )}
                        </span>
                        {feature.badge && (
                          <span className="inline-block ml-1 sm:ml-2 bg-white text-blue-600 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                            {feature.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 sm:mt-6 p-2 sm:p-3 bg-blue-500/30 border border-blue-300/50 rounded-lg sm:rounded-xl backdrop-blur-sm">
                <p className="text-xs text-white text-center font-semibold">
                  🎁 Discounted Tokens + VIP support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compare Plans Button - Mobile optimized */}
        <div className="text-center mb-4 sm:mb-8">
          <button
            onClick={() => setShowComparison(true)}
            className="inline-flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 text-white rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold group text-sm sm:text-base"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            }}
          >
            <span className="mr-2">Compare Plans & Savings</span>
            <svg
              className="w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-300 group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
        </div>

        {/* Modal Actions - Mobile optimized */}
        <div className="flex justify-center pt-3 sm:pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 sm:px-12 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 font-semibold shadow-sm text-sm sm:text-base"
          >
            Maybe Later
          </button>
        </div>
      </div>

      {/* Comparison Modal - Mobile optimized */}
      {showComparison && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
          style={{
            backgroundColor: colors.overlay,
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl transform animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h4
                className="font-bold text-xl sm:text-3xl"
                style={{ color: colors.textDark }}
              >
                See How Much You Save!
              </h4>
              <button
                onClick={() => setShowComparison(false)}
                className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-4 sm:mb-8">
              {/* Standard Savings */}
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-green-300 transform hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${colors.light}, ${colors.offWhite})`,
                  borderColor: colors.primary + "20",
                }}
              >
                <div className="text-center mb-3 sm:mb-4">
                  <div
                    className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                    }}
                  >
                    <span className="text-white font-bold text-sm sm:text-lg">₱25</span>
                  </div>
                  <h5
                    className="font-bold text-lg sm:text-2xl mb-2 sm:mb-3"
                    style={{ color: colors.textDark }}
                  >
                    Standard Savings
                  </h5>
                  <div
                    className="text-sm sm:text-lg space-y-2 sm:space-y-3"
                    style={{ color: colors.textDark }}
                  >
                    <div
                      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border"
                      style={{ borderColor: colors.primary + "10" }}
                    >
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span
                          className="font-semibold text-sm sm:text-base"
                          style={{ color: colors.primary }}
                        >
                          Standard Plan
                        </span>
                        <span
                          className="text-lg sm:text-2xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          ₱500
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        20 tokens included
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ₱25 per token
                      </div>
                    </div>
                    <div
                      className="text-white rounded-lg sm:rounded-xl p-3 sm:p-4 font-bold shadow-md text-center"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      }}
                    >
                      <div className="text-sm sm:text-lg">Same price as individual!</div>
                      <div className="text-xs sm:text-sm opacity-90">
                        But with monthly convenience
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="text-center p-3 sm:p-4 bg-white/80 rounded-lg sm:rounded-xl border"
                  style={{ borderColor: colors.primary + "20" }}
                >
                  <p
                    className="text-xs sm:text-sm font-bold mb-1"
                    style={{ color: colors.primary }}
                  >
                    🎯 Perfect for growing businesses
                  </p>
                  <p className="text-xs" style={{ color: colors.primaryDark }}>
                    Ideal for 15-25 transactions monthly
                  </p>
                </div>
              </div>

              {/* Business Savings */}
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-purple-300 transform hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, #faf5ff, #f3e8ff)`,
                  borderColor: colors.purple + "20",
                }}
              >
                <div className="text-center mb-3 sm:mb-4">
                  <div
                    className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${colors.purple}, ${colors.purpleDark})`,
                    }}
                  >
                    <span className="text-white font-bold text-sm sm:text-lg">20%</span>
                  </div>
                  <h5
                    className="font-bold text-lg sm:text-2xl mb-2 sm:mb-3"
                    style={{ color: colors.textDark }}
                  >
                    Business Savings
                  </h5>
                  <div
                    className="text-sm sm:text-lg space-y-2 sm:space-y-3"
                    style={{ color: colors.textDark }}
                  >
                    <div
                      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border"
                      style={{ borderColor: colors.purple + "10" }}
                    >
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span
                          className="font-semibold text-sm sm:text-base"
                          style={{ color: colors.purple }}
                        >
                          Business Plan
                        </span>
                        <span
                          className="text-lg sm:text-2xl font-bold"
                          style={{ color: colors.purple }}
                        >
                          ₱1,000
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        50 tokens included
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ₱20 per token
                      </div>
                    </div>
                    <div
                      className="text-white rounded-lg sm:rounded-xl p-3 sm:p-4 font-bold shadow-md text-center"
                      style={{
                        background: `linear-gradient(135deg, ${colors.purple}, ${colors.purpleDark})`,
                      }}
                    >
                      <div className="text-sm sm:text-lg">Save ₱250 monthly!</div>
                      <div className="text-xs sm:text-sm opacity-90">
                        That's 20% off every token
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="text-center p-3 sm:p-4 bg-white/80 rounded-lg sm:rounded-xl border"
                  style={{ borderColor: colors.purple + "20" }}
                >
                  <p
                    className="text-xs sm:text-sm font-bold mb-1"
                    style={{ color: colors.purple }}
                  >
                    🏢 Perfect for expanding businesses
                  </p>
                  <p className="text-xs" style={{ color: colors.purpleDark }}>
                    Ideal for 40-60 transactions monthly
                  </p>
                </div>
              </div>

              {/* Premium Savings */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 hover:border-blue-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
                    <span className="text-white font-bold text-sm sm:text-lg">33%</span>
                  </div>
                  <h5 className="font-bold text-lg sm:text-2xl text-gray-900 mb-2 sm:mb-3">
                    Premium Savings
                  </h5>
                  <div className="text-sm sm:text-lg text-gray-700 space-y-2 sm:space-y-3">
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-blue-100">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span className="font-semibold text-sm sm:text-base text-blue-600">
                          Premium Plan
                        </span>
                        <span className="text-lg sm:text-2xl font-bold text-blue-600">
                          ₱5,000
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        300 tokens included
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ₱16 per token
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 font-bold shadow-md text-center">
                      <div className="text-sm sm:text-lg">Save ₱2,700 monthly!</div>
                      <div className="text-xs sm:text-sm opacity-90">
                        That's 33% off every token
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/80 rounded-lg sm:rounded-xl border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-700 font-bold mb-1">
                    🚀 Best value for enterprises
                  </p>
                  <p className="text-xs text-blue-600">
                    Perfect for 200+ monthly transactions
                  </p>
                </div>
              </div>
            </div>

            {/* Savings Breakdown - Mobile optimized */}
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
              <h5 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 text-center">
                💡 Token Price Comparison
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div
                  className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border-2"
                  style={{ borderColor: colors.primary }}
                >
                  <div
                    className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2"
                    style={{ color: colors.primary }}
                  >
                    ₱25
                  </div>
                  <div
                    className="text-xs sm:text-sm mb-1 font-semibold"
                    style={{ color: colors.primary }}
                  >
                    Standard Price
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: colors.primary }}
                  >
                    Same Price
                  </div>
                </div>
                <div
                  className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border-2"
                  style={{ borderColor: colors.purple }}
                >
                  <div
                    className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2"
                    style={{ color: colors.purple }}
                  >
                    ₱20
                  </div>
                  <div
                    className="text-xs sm:text-sm mb-1 font-semibold"
                    style={{ color: colors.purple }}
                  >
                    Business Price
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: colors.purple }}
                  >
                    Save 20%
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md sm:col-span-1">
                  <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">₱16</div>
                  <div className="text-xs sm:text-sm mb-1 font-semibold">
                    Premium Price
                  </div>
                  <div className="text-xs font-medium">Save 33%</div>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">
                🎯 Pro Tip: Higher plans = Higher savings!
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                Start with Standard and upgrade as your business grows
              </p>
              <button
                onClick={() => setShowComparison(false)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-white rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                }}
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default PricingComponent