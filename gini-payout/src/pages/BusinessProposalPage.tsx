import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle, Shield, Zap, Smartphone, CreditCard, Users, TrendingUp, Clock, BarChart3, HeadphonesIcon, Globe, Lock, Server, FileCheck } from 'lucide-react';
import logo from '@/assets/logo.jpeg';
import screenshotLanding from '@/assets/screenshots/landing-page-mobile.png';
import screenshotOnboard from '@/assets/screenshots/onboard-claim-mobile.png';
import screenshotHowItWorks from '@/assets/screenshots/how-it-works-mobile.png';
import screenshotHome from '@/assets/screenshots/home-dashboard-mobile.png';
import screenshotWithdraw from '@/assets/screenshots/withdraw-options-mobile.png';
import screenshotSpend from '@/assets/screenshots/spend-options-mobile.png';
import screenshotAirtime from '@/assets/screenshots/airtime-purchase-mobile.png';
import screenshotElectricity from '@/assets/screenshots/electricity-purchase-mobile.png';
import screenshotEFT from '@/assets/screenshots/eft-withdraw-mobile.png';
import screenshotSupport from '@/assets/screenshots/support-page-mobile.png';

const BusinessProposalPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Screen-only header */}
      <div className="print:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Print-optimized document */}
      <div className="print:pt-0 pt-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto p-8 print:p-10 text-gray-900">
          
          {/* Cover Page */}
          <header className="min-h-[600px] print:min-h-[700px] flex flex-col justify-center items-center text-center border-b-4 border-primary pb-12 mb-12">
            <img src={logo} alt="Gini Logo" className="h-24 w-24 rounded-2xl mb-8 shadow-lg" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Gini Payout Solutions</h1>
            <p className="text-2xl text-primary font-semibold mb-2">Instant Digital Refund Services</p>
            <p className="text-gray-500 mb-12">Transforming Retail Customer Experience</p>
            
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-12 py-8 rounded-2xl shadow-xl max-w-lg">
              <h2 className="text-3xl font-bold mb-2">BUSINESS PROPOSAL</h2>
              <p className="text-lg opacity-90">Instant Refund Service for Retail Partners</p>
            </div>
            
            <div className="mt-12 text-sm text-gray-500">
              <p>Proposal Date: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Valid for 30 days</p>
              <p className="mt-2 font-medium text-gray-700">Confidential Document</p>
            </div>
          </header>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Table of Contents */}
          <section className="mb-12 print:pt-8">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6">
              Table of Contents
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Executive Summary</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>The Challenge</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Our Solution</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>Platform Walkthrough & Screenshots</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                <span>Customer Journey</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                <span>Redemption Options</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                <span>Technical Integration</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">8</span>
                <span>Security & Compliance</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">9</span>
                <span>Commercial Terms</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">10</span>
                <span>ROI & Business Benefits</span>
              </li>
              <li className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">11</span>
                <span>Implementation Timeline</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">12</span>
                <span>Contact & Next Steps</span>
              </li>
            </ol>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Executive Summary */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">1</span>
              Executive Summary
            </h3>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl mb-6">
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Gini Payout Solutions offers a revolutionary <strong className="text-primary">white-label instant refund platform</strong> designed 
                specifically for large retailers seeking to enhance customer satisfaction and operational efficiency. 
                Our solution transforms the traditional 5-14 day refund waiting period into an <strong className="text-primary">immediate, 
                mobile-first experience</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Customers receive refunds directly to their mobile wallet, identified simply by their mobile number, 
                with flexible redemption options including cash withdrawal, bank transfer, airtime, electricity, 
                or high-yield savings earning up to <strong className="text-primary">6% interest</strong> via Gini iAccount.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-gray-900">Instant</p>
                <p className="text-sm text-gray-600">Seconds, not days</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Smartphone className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-gray-900">Mobile-First</p>
                <p className="text-sm text-gray-600">No app required</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-gray-900">Secure</p>
                <p className="text-sm text-gray-600">OTP verified</p>
              </div>
            </div>
          </section>

          {/* The Challenge */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">2</span>
              The Challenge
            </h3>
            <p className="text-gray-700 mb-6">
              Traditional refund processes create significant friction in the retail experience, leading to customer dissatisfaction and lost revenue opportunities.
            </p>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg mb-6">
              <h4 className="font-semibold text-red-800 mb-4">Current Pain Points:</h4>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">×</span>
                  <div>
                    <strong>Customer Frustration:</strong> 73% of shoppers cite slow refunds as a major pain point affecting brand loyalty. Customers forced to wait create negative reviews and social media complaints.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">×</span>
                  <div>
                    <strong>Processing Delays:</strong> Traditional card refunds take 5-14 business days, creating uncertainty and anxiety. Customers repeatedly check their bank accounts.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">×</span>
                  <div>
                    <strong>Lost Revenue:</strong> Customers often shop elsewhere while waiting for refunds to process. The refund amount leaves your ecosystem entirely.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">×</span>
                  <div>
                    <strong>Operational Overhead:</strong> Managing refund queries consumes valuable customer service resources. Each refund query costs R15-25 in agent time.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">×</span>
                  <div>
                    <strong>Bank Dependencies:</strong> Retailers are at the mercy of banking systems and their processing times. Weekend and holiday refunds are particularly problematic.
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800 font-medium">
                💡 Industry Research: Retailers lose an estimated R2.3 billion annually in South Africa due to refund-related customer churn and negative experiences.
              </p>
            </div>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Our Solution */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">3</span>
              Our Solution
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              The Gini Instant Refund Platform provides a seamless, mobile-first refund experience that delights customers and creates new revenue opportunities for retailers.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-primary/20 rounded-xl p-5 bg-gradient-to-br from-white to-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Instant Processing</h4>
                </div>
                <p className="text-sm text-gray-600">Funds available in seconds, not days. Customer receives SMS confirmation immediately with a link to access their money.</p>
              </div>
              <div className="border-2 border-primary/20 rounded-xl p-5 bg-gradient-to-br from-white to-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Mobile-First Design</h4>
                </div>
                <p className="text-sm text-gray-600">No bank details required. Mobile number serves as the unique identifier. Works on any smartphone - no app download needed.</p>
              </div>
              <div className="border-2 border-primary/20 rounded-xl p-5 bg-gradient-to-br from-white to-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Flexible Redemption</h4>
                </div>
                <p className="text-sm text-gray-600">Cash at ATM, EFT to bank, airtime, electricity, QR payments, or earn 6% interest in iAccount savings. Customer choice.</p>
              </div>
              <div className="border-2 border-primary/20 rounded-xl p-5 bg-gradient-to-br from-white to-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Secure & Compliant</h4>
                </div>
                <p className="text-sm text-gray-600">OTP verification for every transaction, full audit trail, and regulatory compliance built-in. 256-bit SSL encryption.</p>
              </div>
              <div className="border-2 border-primary/20 rounded-xl p-5 bg-gradient-to-br from-white to-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">White-Label Ready</h4>
                </div>
                <p className="text-sm text-gray-600">Fully customisable with your brand colours, logo, and messaging. Customers interact with your brand, not ours.</p>
              </div>
              <div className="border-2 border-primary/20 rounded-xl p-5 bg-gradient-to-br from-white to-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Revenue Retention</h4>
                </div>
                <p className="text-sm text-gray-600">Store credit option keeps funds in your ecosystem. Analytics dashboard shows redemption patterns and opportunities.</p>
              </div>
            </div>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Platform Walkthrough */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">4</span>
              Platform Walkthrough & Screenshots
            </h3>
            <p className="text-gray-700 mb-6">
              Below are actual screenshots from the GiniPayout platform, demonstrating the complete customer experience from initial notification to funds redemption.
            </p>

            {/* Landing Page */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.1</span>
                Landing Page - Customer Entry Point
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                When customers click the SMS link, they arrive at a clean, branded landing page. Clear calls-to-action guide them through the process with security badges building trust.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotLanding} alt="Landing Page" className="w-full" />
                </div>
              </div>
            </div>

            {/* Onboard/Claim */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.2</span>
                Payout Claim Screen
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Customers see their payout amount clearly displayed with sender information and expiry date. The verification badge confirms this is a legitimate payout from a trusted sender.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotOnboard} alt="Claim Screen" className="w-full" />
                </div>
              </div>
            </div>

            {/* Page break for print */}
            <div className="print:break-before-page"></div>

            {/* How It Works */}
            <div className="mb-8 print:pt-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.3</span>
                How It Works Guide
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                A simple 3-step guide helps customers understand the process. This reduces support queries and builds confidence in the platform.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotHowItWorks} alt="How It Works" className="w-full" />
                </div>
              </div>
            </div>

            {/* Home Dashboard */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.4</span>
                Customer Dashboard
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                The main dashboard shows split balances: Cash Refund (withdrawable anywhere) and Store Credit (redeemable at specific merchants). Quick actions provide one-tap access to all features.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotHome} alt="Home Dashboard" className="w-full" />
                </div>
              </div>
            </div>

            {/* Page break for print */}
            <div className="print:break-before-page"></div>

            {/* Withdraw Options */}
            <div className="mb-8 print:pt-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.5</span>
                Withdrawal Options
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Multiple cash-out methods cater to different customer preferences. EFT for bank transfers, ATM cash-out for immediate access, or Gini iAccount for earning interest.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotWithdraw} alt="Withdraw Options" className="w-full" />
                </div>
              </div>
            </div>

            {/* EFT Withdraw */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.6</span>
                EFT Bank Transfer
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Simple bank details capture for EFT transfers. Supports all major South African banks with 1-2 business day processing.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotEFT} alt="EFT Withdraw" className="w-full" />
                </div>
              </div>
            </div>

            {/* Page break for print */}
            <div className="print:break-before-page"></div>

            {/* Spend Options */}
            <div className="mb-8 print:pt-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.7</span>
                Spend Options
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Customers can spend their balance instantly via QR payments, or purchase value-added services like airtime, data, and electricity. Store credit balances show specific merchant availability.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotSpend} alt="Spend Options" className="w-full" />
                </div>
              </div>
            </div>

            {/* Airtime Purchase */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.8</span>
                Airtime Purchase
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Quick airtime top-ups for any South African mobile network. Pre-set amounts for fast selection or custom amount entry.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotAirtime} alt="Airtime Purchase" className="w-full" />
                </div>
              </div>
            </div>

            {/* Page break for print */}
            <div className="print:break-before-page"></div>

            {/* Electricity Purchase */}
            <div className="mb-8 print:pt-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.9</span>
                Electricity Token Purchase
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Prepaid electricity tokens for all major providers. Meter number saved for repeat purchases. Real-time token delivery.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotElectricity} alt="Electricity Purchase" className="w-full" />
                </div>
              </div>
            </div>

            {/* Support Page */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4.10</span>
                Customer Support
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                In-app support with live chat, FAQs, and multiple contact channels. Reduces retailer support burden while ensuring customer questions are answered quickly.
              </p>
              <div className="flex justify-center">
                <div className="w-[240px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  <img src={screenshotSupport} alt="Support Page" className="w-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Customer Journey */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">5</span>
              Customer Journey
            </h3>
            <p className="text-gray-700 mb-6">
              The complete refund experience from in-store return to funds in hand:
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-lg shadow-md">1</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">Customer Initiates Return</h4>
                  <p className="text-gray-600 mt-1">Customer brings item to store. Staff processes return at POS and captures customer's mobile number. This takes under 30 seconds.</p>
                  <div className="mt-2 text-sm text-primary font-medium">⏱ Time: 30 seconds</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-lg shadow-md">2</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">Retailer API Call</h4>
                  <p className="text-gray-600 mt-1">POS system calls Gini API with refund amount and customer mobile number. API validates and creates the payout in real-time.</p>
                  <div className="mt-2 text-sm text-primary font-medium">⏱ Time: 2 seconds</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-lg shadow-md">3</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">Customer Notification</h4>
                  <p className="text-gray-600 mt-1">Customer receives SMS with branded message and secure link to access their refund. SMS delivery is typically under 10 seconds.</p>
                  <div className="mt-2 text-sm text-primary font-medium">⏱ Time: 10 seconds</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-lg shadow-md">4</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">OTP Verification</h4>
                  <p className="text-gray-600 mt-1">Customer clicks link, enters mobile number, and receives OTP for verification. This ensures only the rightful recipient can access funds.</p>
                  <div className="mt-2 text-sm text-primary font-medium">⏱ Time: 30 seconds</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-lg shadow-md">5</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">Flexible Redemption</h4>
                  <p className="text-gray-600 mt-1">Customer chooses how to use their funds: withdraw as cash at ATM, transfer to bank account, buy airtime or electricity, pay via QR, or save and earn interest.</p>
                  <div className="mt-2 text-sm text-primary font-medium">⏱ Time: Customer's choice</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-800 font-semibold">
                ✓ Total time from return to funds access: Under 2 minutes
              </p>
              <p className="text-green-700 text-sm mt-1">
                Compare this to 5-14 business days for traditional card refunds.
              </p>
            </div>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Redemption Options */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">6</span>
              Redemption Options
            </h3>
            <p className="text-gray-700 mb-6">
              Customers have complete flexibility in how they use their refund, catering to different needs and preferences:
            </p>
            
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4 text-left">Option</th>
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-left">Timeframe</th>
                    <th className="p-4 text-left">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold">EFT to Bank</td>
                    <td className="p-4 text-gray-600">Transfer to any SA bank account</td>
                    <td className="p-4 text-gray-600">1-2 business days</td>
                    <td className="p-4 text-gray-600">Free</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-4 font-semibold">Cash at ATM</td>
                    <td className="p-4 text-gray-600">Cardless withdrawal at ABSA/Nedbank</td>
                    <td className="p-4 text-gray-600">Instant</td>
                    <td className="p-4 text-gray-600">R10 flat fee</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold">Gini iAccount</td>
                    <td className="p-4 text-gray-600">Save and earn up to 6% interest</td>
                    <td className="p-4 text-gray-600">Instant</td>
                    <td className="p-4 text-gray-600">Free</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-4 font-semibold">QR Payment</td>
                    <td className="p-4 text-gray-600">Pay at any iAccount merchant</td>
                    <td className="p-4 text-gray-600">Instant</td>
                    <td className="p-4 text-gray-600">Free</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold">Airtime</td>
                    <td className="p-4 text-gray-600">Top up any SA mobile network</td>
                    <td className="p-4 text-gray-600">Instant</td>
                    <td className="p-4 text-gray-600">Free</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-4 font-semibold">Data Bundles</td>
                    <td className="p-4 text-gray-600">Purchase mobile data</td>
                    <td className="p-4 text-gray-600">Instant</td>
                    <td className="p-4 text-gray-600">Free</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Electricity</td>
                    <td className="p-4 text-gray-600">Prepaid tokens for all providers</td>
                    <td className="p-4 text-gray-600">Instant</td>
                    <td className="p-4 text-gray-600">Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-blue-800 font-semibold">💡 Store Credit Option</p>
              <p className="text-blue-700 text-sm mt-1">
                Retailers can opt to issue refunds as Store Credit instead of cash. Store credit can only be redeemed at your stores via QR payment, keeping the funds in your ecosystem and encouraging return visits.
              </p>
            </div>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Technical Integration */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">7</span>
              Technical Integration
            </h3>
            <p className="text-gray-700 mb-6">
              Our platform is designed for seamless integration with existing retail systems:
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Server className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-gray-900">RESTful API</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Simple JSON-based requests</li>
                  <li>• Comprehensive documentation</li>
                  <li>• Sandbox environment for testing</li>
                  <li>• Webhook notifications</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-gray-900">POS Integration</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Pre-built plugins for major POS</li>
                  <li>• Custom integration support</li>
                  <li>• Staff training materials</li>
                  <li>• On-site implementation assistance</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-900 text-gray-100 p-6 rounded-xl font-mono text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">// Example API Request</p>
              <pre>{`POST /api/v1/payouts
{
  "amount": 850.00,
  "currency": "ZAR",
  "recipient_mobile": "+27821234567",
  "reference": "REF-2024-00123",
  "merchant_id": "CASHBUILD-001",
  "type": "cash_refund",
  "note": "Return - damaged item",
  "expiry_days": 30
}`}</pre>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary">99.9%</p>
                <p className="text-sm text-gray-600">API Uptime SLA</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary">&lt;200ms</p>
                <p className="text-sm text-gray-600">Average Response</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-sm text-gray-600">Technical Support</p>
              </div>
            </div>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Security & Compliance */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">8</span>
              Security & Compliance
            </h3>
            <p className="text-gray-700 mb-6">
              We take security seriously. Our platform is built with enterprise-grade security measures:
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">256-bit SSL Encryption</p>
                    <p className="text-sm text-gray-600">All data encrypted in transit and at rest</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">OTP Verification</p>
                    <p className="text-sm text-gray-600">Two-factor authentication on all transactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">POPIA Compliant</p>
                    <p className="text-sm text-gray-600">Full compliance with SA privacy legislation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">PCI-DSS Level 1</p>
                    <p className="text-sm text-gray-600">Highest level of payment security certification</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Full Audit Trail</p>
                    <p className="text-sm text-gray-600">Complete transaction history for compliance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Fraud Detection</p>
                    <p className="text-sm text-gray-600">AI-powered anomaly detection systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">SARB Registered</p>
                    <p className="text-sm text-gray-600">Licensed payment service provider</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">SOC 2 Type II</p>
                    <p className="text-sm text-gray-600">Independent security audit certification</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Commercial Terms */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">9</span>
              Commercial Terms
            </h3>
            
            <div className="overflow-hidden border-2 border-primary/20 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4 text-left">Service</th>
                    <th className="p-4 text-left">Rate</th>
                    <th className="p-4 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold">Platform Setup</td>
                    <td className="p-4 font-bold text-green-600">Waived</td>
                    <td className="p-4 text-gray-600">For annual contracts (normally R50,000)</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-4 font-semibold">Transaction Fee</td>
                    <td className="p-4 font-bold text-primary">1.5% per refund</td>
                    <td className="p-4 text-gray-600">Volume discounts available (see below)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold">Monthly Minimum</td>
                    <td className="p-4 font-bold">R 5,000</td>
                    <td className="p-4 text-gray-600">Or 500 transactions, whichever is greater</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-4 font-semibold">White-Label Branding</td>
                    <td className="p-4 font-bold text-green-600">Included</td>
                    <td className="p-4 text-gray-600">Full customisation of colours, logo, messaging</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold">API Access</td>
                    <td className="p-4 font-bold text-green-600">Included</td>
                    <td className="p-4 text-gray-600">Unlimited API calls, sandbox environment</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-4 font-semibold">Reporting Dashboard</td>
                    <td className="p-4 font-bold text-green-600">Included</td>
                    <td className="p-4 text-gray-600">Real-time analytics and reconciliation</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Dedicated Support</td>
                    <td className="p-4 font-bold text-green-600">Included</td>
                    <td className="p-4 text-gray-600">24/7 technical support, dedicated account manager</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-primary/5 p-5 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">Volume Discount Tiers:</h4>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">0-10,000</p>
                  <p className="font-bold text-primary">1.50%</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">10,001-50,000</p>
                  <p className="font-bold text-primary">1.25%</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">50,001-100,000</p>
                  <p className="font-bold text-primary">1.00%</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">100,000+</p>
                  <p className="font-bold text-primary">Custom</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">* Monthly transaction volumes. Rates based on annual commitment.</p>
            </div>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* ROI & Business Benefits */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">10</span>
              ROI & Business Benefits
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/15 rounded-xl border border-primary/20">
                <p className="text-5xl font-bold text-primary mb-2">87%</p>
                <p className="text-gray-700 font-medium">Customer Satisfaction Improvement</p>
                <p className="text-sm text-gray-500 mt-2">Based on NPS surveys post-implementation</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/15 rounded-xl border border-primary/20">
                <p className="text-5xl font-bold text-primary mb-2">60%</p>
                <p className="text-gray-700 font-medium">Reduction in Refund Queries</p>
                <p className="text-sm text-gray-500 mt-2">Fewer "where is my refund" calls</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/15 rounded-xl border border-primary/20">
                <p className="text-5xl font-bold text-primary mb-2">23%</p>
                <p className="text-gray-700 font-medium">Increase in Repeat Purchases</p>
                <p className="text-sm text-gray-500 mt-2">Customers return sooner after positive refund experience</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/15 rounded-xl border border-primary/20">
                <p className="text-5xl font-bold text-primary mb-2">35%</p>
                <p className="text-gray-700 font-medium">Store Credit Uptake</p>
                <p className="text-sm text-gray-500 mt-2">Customers choosing to keep funds in your ecosystem</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-4">ROI Calculator Example (Based on 10,000 refunds/month):</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">Average refund value</td>
                    <td className="py-3 text-right font-semibold">R 350</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">Monthly refund volume</td>
                    <td className="py-3 text-right font-semibold">R 3,500,000</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">Gini fee (1.5%)</td>
                    <td className="py-3 text-right font-semibold text-red-600">- R 52,500</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">Customer service savings (60% reduction)</td>
                    <td className="py-3 text-right font-semibold text-green-600">+ R 90,000</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">Additional revenue from repeat purchases (23% increase)</td>
                    <td className="py-3 text-right font-semibold text-green-600">+ R 175,000</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">Store credit retention (35% × R3.5M)</td>
                    <td className="py-3 text-right font-semibold text-green-600">+ R 1,225,000 retained</td>
                  </tr>
                  <tr className="bg-primary/10">
                    <td className="py-4 font-bold text-gray-900">Net Monthly Benefit</td>
                    <td className="py-4 text-right font-bold text-primary text-lg">+ R 212,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Page break for print */}
          <div className="print:break-before-page"></div>

          {/* Implementation Timeline */}
          <section className="mb-10 print:pt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">11</span>
              Implementation Timeline
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-24 shrink-0">
                  <div className="bg-primary text-white text-sm font-bold px-3 py-2 rounded-lg text-center">
                    Week 1-2
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Discovery & Planning</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Technical discovery call with IT team</li>
                    <li>• Requirements gathering and scope definition</li>
                    <li>• Branding assets collection for white-label</li>
                    <li>• API credentials and sandbox access provided</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-24 shrink-0">
                  <div className="bg-primary text-white text-sm font-bold px-3 py-2 rounded-lg text-center">
                    Week 3-4
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Integration Development</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• POS integration development/configuration</li>
                    <li>• White-label customisation implementation</li>
                    <li>• Sandbox testing and validation</li>
                    <li>• Staff training materials preparation</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-24 shrink-0">
                  <div className="bg-primary text-white text-sm font-bold px-3 py-2 rounded-lg text-center">
                    Week 5-6
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Pilot Programme</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Rollout to 3-5 pilot stores</li>
                    <li>• Staff training and onboarding</li>
                    <li>• Real-world transaction monitoring</li>
                    <li>• Customer feedback collection</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-24 shrink-0">
                  <div className="bg-primary text-white text-sm font-bold px-3 py-2 rounded-lg text-center">
                    Week 7-8
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Optimisation & Review</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Pilot metrics review and analysis</li>
                    <li>• Process optimisation based on feedback</li>
                    <li>• Full rollout planning and scheduling</li>
                    <li>• Go-live preparation</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-24 shrink-0">
                  <div className="bg-green-600 text-white text-sm font-bold px-3 py-2 rounded-lg text-center">
                    Week 9+
                  </div>
                </div>
                <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">Full Rollout</h4>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Phased rollout across all locations</li>
                    <li>• Ongoing support and monitoring</li>
                    <li>• Monthly performance reviews</li>
                    <li>• Continuous improvement iterations</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact & Next Steps */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-primary pb-3 mb-6 flex items-center gap-3">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">12</span>
              Contact & Next Steps
            </h3>
            
            <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-8 rounded-2xl mb-8">
              <h4 className="text-2xl font-bold mb-6">Ready to Transform Your Refund Experience?</h4>
              <ol className="space-y-4 text-lg">
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                  Schedule a technical discovery call with our integration team
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                  Define scope and customisation requirements
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                  Launch pilot programme with select stores
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">4</span>
                  Review metrics and optimise
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">5</span>
                  Full rollout across all locations
                </li>
              </ol>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Business Development
                </h4>
                <p className="text-gray-700 font-medium">Sarah Johnson</p>
                <p className="text-gray-600">Head of Retail Partnerships</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-gray-600">📧 partnerships@gini.co.za</p>
                  <p className="text-gray-600">📞 +27 11 123 4567</p>
                  <p className="text-gray-600">📱 +27 82 123 4567</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" />
                  Technical Integration
                </h4>
                <p className="text-gray-700 font-medium">David Nkosi</p>
                <p className="text-gray-600">Integration Solutions Architect</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-gray-600">📧 api@gini.co.za</p>
                  <p className="text-gray-600">🌐 developers.gini.co.za</p>
                  <p className="text-gray-600">📞 +27 11 123 4568</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={logo} alt="Gini Logo" className="h-12 w-12 rounded-lg" />
                <div>
                  <p className="font-bold text-gray-900">Gini Payout Solutions</p>
                  <p className="text-sm text-gray-600">Instant Digital Refund Services</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Gini Payout Solutions. All rights reserved.</p>
                <p>This proposal is confidential and intended for the recipient only.</p>
              </div>
            </div>
          </footer>

        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-before-page {
            break-before: page;
          }
          .print\\:pt-0 {
            padding-top: 0 !important;
          }
          .print\\:pt-8 {
            padding-top: 2rem !important;
          }
          .print\\:p-10 {
            padding: 2.5rem !important;
          }
          .print\\:min-h-\\[700px\\] {
            min-height: 700px !important;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        }
      `}</style>
    </>
  );
};

export default BusinessProposalPage;
