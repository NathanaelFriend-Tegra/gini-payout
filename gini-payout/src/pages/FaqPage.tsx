import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import faqData from '@/data/faqs.json';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

// --- Accordion Item ---
const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className="w-full text-left bg-card border border-border rounded-2xl overflow-hidden hover:bg-accent/30 transition-colors active:scale-[0.99]"
  >
    <div className="flex items-center justify-between gap-3 p-4">
      <span className="font-medium text-foreground text-sm leading-snug">{item.question}</span>
      {isOpen ? (
        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      ) : (
        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      )}
    </div>
    {isOpen && (
      <div className="px-4 pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
      </div>
    )}
  </button>
);

// --- Main Page ---
const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const categories = ['All', ...(faqData as FAQCategory[]).map((c) => c.category)];

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return (faqData as FAQCategory[])
      .filter((cat) => activeCategory === 'All' || cat.category === activeCategory)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            !query ||
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [search, activeCategory]);

  const totalResults = filtered.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-foreground">FAQs</h1>
        <p className="text-sm text-muted-foreground mt-1">Find answers to common questions</p>
      </div>

      {/* Search bar */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenIndex(null);
            }}
            placeholder="Search questions..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:bg-accent/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 space-y-6 pb-10">
        {search && (
          <p className="text-xs text-muted-foreground">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{search}&quot;
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-medium text-foreground">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try different keywords or browse by category
            </p>
          </div>
        ) : (
          filtered.map((cat) => (
            <div key={cat.category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                {cat.category}
              </p>
              <div className="space-y-2">
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  return (
                    <AccordionItem
                      key={key}
                      item={item}
                      isOpen={openIndex === key}
                      onToggle={() => setOpenIndex(openIndex === key ? null : key)}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-8">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-sm font-medium text-foreground">Still need help?</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">Our team is here for you</p>
          <button
            onClick={() => window.open('mailto:support@ginipay.co.za')}
            className="text-sm font-medium text-primary hover:underline"
          >
            Contact support →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;