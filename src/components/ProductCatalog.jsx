import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

export const ProductCatalog = () => {
  const { products } = useStore();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        // default featured
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalog-section" className="section-padding catalog-section">
      <div className="container">
        {/* Catalog Header */}
        <div className="catalog-header">
          <div className="catalog-title-row">
            <div>
              <span className="badge badge-burgundy" style={{ marginBottom: '10px' }}>
                <Sparkles size={13} />
                <span>The Curated Collection</span>
              </span>
              <h2>Signature Wardrobe Pieces</h2>
            </div>

            {/* Search Bar */}
            <div className="catalog-search-bar">
              <Search size={18} color="#E8A598" />
              <input
                type="text"
                placeholder="Search gowns, blazers, silk..."
                className="catalog-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#E8A598', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-list">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="catalog-toolbar">
            <div>
              Showing <strong>{filteredProducts.length}</strong> luxurious designs
              {selectedCategory !== 'All' && <span> in <em>{selectedCategory}</em></span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SlidersHorizontal size={16} color="#E8A598" />
              <label htmlFor="catalog-sort" style={{ fontSize: '0.85rem' }}>Sort by:</label>
              <select
                id="catalog-sort"
                className="catalog-sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="featured">Featured & Best</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <Sparkles size={40} color="#E8A598" />
            <h3>No products found matching your search</h3>
            <p>Try clearing your search filters or browse other categories.</p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
