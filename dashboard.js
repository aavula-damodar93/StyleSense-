// ==========================================
//  StyleSense Dashboard - dashboard.js
// ==========================================

// Auth guard
(function() {
  const user = localStorage.getItem('ss_user');
  if (!user) { window.location.href = 'login.html'; return; }
  const name = localStorage.getItem('ss_name') || user.split('@')[0];
  document.getElementById('userName').textContent = name.charAt(0).toUpperCase() + name.slice(1);
  document.getElementById('userAvatar').textContent = name.charAt(0).toUpperCase();
})();

// ==============================
//  NAV SECTION SWITCHING
// ==============================
function showSection(id, linkEl) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==============================
//  CATEGORY TABS
// ==============================
function showCategory(cat, tabEl) {
  document.querySelectorAll('.category-section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('cat-' + cat).classList.remove('hidden');
  tabEl.classList.add('active');
}

// ==============================
//  ITEM DATABASE — Pricing & Fabrics
// ==============================
const itemDatabase = {
  // MEN
  'Formal Shirt': {
    minPrice: 399,
    priceRange: '₹399 – ₹4,500',
    fabrics: [
      { name: 'Cotton', desc: 'Breathable, easy to iron, great for daily wear', icon: '🌿' },
      { name: 'Linen', desc: 'Light & airy, ideal for summer, slight wrinkle-prone', icon: '🌾' },
      { name: 'Poplin', desc: 'Smooth fine weave, crisp look, widely affordable', icon: '✨' },
      { name: 'Oxford Cloth', desc: 'Textured, durable, casual-formal balance', icon: '🧵' },
      { name: 'Silk Blend', desc: 'Lustrous finish, premium feel, special occasions', icon: '🪡' },
    ],
    tags: ['Formal', 'Office', 'Wedding', 'Party'],
    tip: 'Go for 100% cotton for daily comfort. Silk blends for weddings & events.'
  },
  'T-Shirt': {
    minPrice: 199,
    priceRange: '₹199 – ₹2,000',
    fabrics: [
      { name: 'Cotton Jersey', desc: 'Soft, stretchy, most common T-shirt fabric', icon: '🌿' },
      { name: 'Pique Cotton', desc: 'Textured weave, used for polo tees', icon: '🧶' },
      { name: 'Polyester Blend', desc: 'Moisture-wicking, great for sports', icon: '⚡' },
      { name: 'Slub Cotton', desc: 'Natural irregular texture, premium casual look', icon: '✨' },
      { name: 'Bamboo Fabric', desc: 'Eco-friendly, ultra-soft, hypoallergenic', icon: '🌱' },
    ],
    tags: ['Casual', 'Sports', 'Everyday'],
    tip: 'Slub cotton and bamboo fabric give a premium look at a mid-range price.'
  },
  'Hoodie': {
    minPrice: 599,
    priceRange: '₹599 – ₹5,000',
    fabrics: [
      { name: 'French Terry', desc: 'Lightweight loop-back, ideal for mild weather', icon: '🌬️' },
      { name: 'Fleece', desc: 'Warm, fluffy interior, great for winters', icon: '❄️' },
      { name: 'Cotton Blend', desc: 'Soft & breathable mix, all-season comfort', icon: '🌿' },
      { name: 'Tech Fleece', desc: 'Engineered warmth, slim fit, premium brands', icon: '⚙️' },
    ],
    tags: ['Casual', 'Winter', 'Street Style'],
    tip: 'French terry is lighter and more versatile. Fleece for colder climates.'
  },
  'Pants': {
    minPrice: 499,
    priceRange: '₹499 – ₹6,000',
    fabrics: [
      { name: 'Wool Blend', desc: 'Structured drape, perfect for formal trousers', icon: '🐑' },
      { name: 'Polyester Viscose', desc: 'Budget formal, wrinkle-resistant', icon: '✨' },
      { name: 'Cotton Twill', desc: 'Durable diagonal weave, smart casual', icon: '🌿' },
      { name: 'Linen', desc: 'Summer-ready, breezy, slightly textured', icon: '🌾' },
    ],
    tags: ['Formal', 'Office', 'Smart Casual'],
    tip: 'Wool blends give the best drape for office formals.'
  },
  'Jeans': {
    minPrice: 699,
    priceRange: '₹699 – ₹8,000',
    fabrics: [
      { name: 'Denim (100% Cotton)', desc: 'Classic, durable, gets better with age', icon: '🌿' },
      { name: 'Stretch Denim', desc: 'Spandex blend, flexible & comfortable', icon: '🤸' },
      { name: 'Raw Denim', desc: 'Stiff initially, molds to your body over time', icon: '✦' },
      { name: 'Selvedge Denim', desc: 'Tightly woven edges, premium Japanese quality', icon: '🎌' },
    ],
    tags: ['Casual', 'Everyday', 'Street Style'],
    tip: 'Stretch denim is best for daily comfort. Raw denim is for enthusiasts.'
  },
  'Baggy Linen': {
    minPrice: 699,
    priceRange: '₹699 – ₹4,000',
    fabrics: [
      { name: 'Pure Linen', desc: 'Natural, breathable, gets softer with each wash', icon: '🌾' },
      { name: 'Linen-Cotton Blend', desc: 'Less wrinkle-prone, softer texture', icon: '🌿' },
      { name: 'Linen-Rayon Blend', desc: 'Drapier, lighter, good for warm climates', icon: '☀️' },
    ],
    tags: ['Summer', 'Casual', 'Beachwear'],
    tip: 'Linen-cotton blend is the most practical choice — less wrinkling, more comfort.'
  },
  'Men Shoes': {
    minPrice: 799,
    priceRange: '₹799 – ₹15,000',
    fabrics: [
      { name: 'Full Grain Leather', desc: 'Most durable, develops patina over time', icon: '🏆' },
      { name: 'Suede', desc: 'Soft napped leather, stylish but less water-resistant', icon: '✨' },
      { name: 'Canvas', desc: 'Casual, lightweight, breathable for sneakers', icon: '🌿' },
      { name: 'Synthetic Leather', desc: 'Budget-friendly, easy to clean', icon: '💡' },
      { name: 'Patent Leather', desc: 'Glossy finish, perfect for formal occasions', icon: '🎩' },
    ],
    tags: ['Formal', 'Casual', 'Sports', 'Party'],
    tip: 'Invest in full-grain leather for formal shoes — they last decades with care.'
  },
  'Men Accessories': {
    minPrice: 199,
    priceRange: '₹199 – ₹10,000',
    fabrics: [
      { name: 'Stainless Steel', desc: 'Durable, rust-proof, for watches & belts', icon: '⚙️' },
      { name: 'Genuine Leather', desc: 'Classic belts, wallets, watch straps', icon: '🏆' },
      { name: 'Silk', desc: 'Premium ties & pocket squares', icon: '🪡' },
      { name: 'Sterling Silver', desc: 'Jewelry, cufflinks, tie clips', icon: '💎' },
    ],
    tags: ['Formal', 'Casual', 'Luxury'],
    tip: 'A quality leather belt and watch immediately elevate any outfit.'
  },
  'Blazer': {
    minPrice: 1499,
    priceRange: '₹1,499 – ₹18,000',
    fabrics: [
      { name: 'Wool', desc: 'Classic suit fabric, structured and warm', icon: '🐑' },
      { name: 'Tweed', desc: 'Textured, great for autumn/winter events', icon: '🍂' },
      { name: 'Linen', desc: 'Lightweight blazers for summer formals', icon: '🌾' },
      { name: 'Cotton', desc: 'Unstructured casual blazers', icon: '🌿' },
      { name: 'Velvet', desc: 'Luxurious evening blazer fabric', icon: '✨' },
    ],
    tags: ['Formal', 'Smart Casual', 'Office', 'Party'],
    tip: 'A navy wool blazer is the most versatile item in a man\'s wardrobe.'
  },
  'Jacket': {
    minPrice: 999,
    priceRange: '₹999 – ₹12,000',
    fabrics: [
      { name: 'Denim', desc: 'Classic casual jacket, layering staple', icon: '🌿' },
      { name: 'Leather', desc: 'Timeless, durable, biker aesthetic', icon: '🏆' },
      { name: 'Nylon', desc: 'Lightweight windbreaker material', icon: '🌬️' },
      { name: 'Wool Blend', desc: 'Warm overcoat-style jacket', icon: '🐑' },
      { name: 'Quilted Polyester', desc: 'Padded puffer jacket, excellent warmth', icon: '❄️' },
    ],
    tags: ['Casual', 'Winter', 'Outerwear'],
    tip: 'A denim jacket and a bomber are two essential casual jackets to own.'
  },

  // WOMEN
  'Dress': {
    minPrice: 599,
    priceRange: '₹599 – ₹12,000',
    fabrics: [
      { name: 'Chiffon', desc: 'Light, flowy, perfect for parties & events', icon: '🌸' },
      { name: 'Crepe', desc: 'Smooth drape, flattering for all body types', icon: '✨' },
      { name: 'Georgette', desc: 'Slightly textured, elegant for formal dresses', icon: '🌺' },
      { name: 'Cotton', desc: 'Casual day dresses, comfortable & easy-care', icon: '🌿' },
      { name: 'Satin', desc: 'Glossy, luxurious, for evening & party dresses', icon: '🪡' },
      { name: 'Linen', desc: 'Summer dresses, relaxed & breathable', icon: '🌾' },
    ],
    tags: ['Party', 'Casual', 'Formal', 'Wedding'],
    tip: 'Crepe and georgette are the most universally flattering dress fabrics.'
  },
  'Blouse': {
    minPrice: 299,
    priceRange: '₹299 – ₹5,000',
    fabrics: [
      { name: 'Silk', desc: 'Luxurious drape, perfect for smart casual', icon: '🪡' },
      { name: 'Chiffon', desc: 'Sheer, lightweight, often layered', icon: '🌸' },
      { name: 'Cotton', desc: 'Everyday comfort, easy care', icon: '🌿' },
      { name: 'Georgette', desc: 'Slightly textured elegance', icon: '✨' },
      { name: 'Satin', desc: 'Smooth and glossy for evening looks', icon: '🌟' },
    ],
    tags: ['Office', 'Casual', 'Party'],
    tip: 'A silk or satin blouse instantly elevates a simple pair of trousers.'
  },
  'Saree': {
    minPrice: 799,
    priceRange: '₹799 – ₹1,00,000+',
    fabrics: [
      { name: 'Silk (Kanjivaram)', desc: 'The gold standard — heavy, lustrous, heirloom quality', icon: '🏆' },
      { name: 'Chiffon', desc: 'Light & floaty, great for daily wear', icon: '🌸' },
      { name: 'Georgette', desc: 'Flowy, comfortable, ideal for parties', icon: '🌺' },
      { name: 'Cotton', desc: 'Everyday sarees, breathable & traditional', icon: '🌿' },
      { name: 'Banarasi Silk', desc: 'Intricate gold/silver zari work, for occasions', icon: '✨' },
      { name: 'Linen', desc: 'Modern drape, casual and sustainable', icon: '🌾' },
    ],
    tags: ['Traditional', 'Wedding', 'Festival', 'Formal'],
    tip: 'Georgette is the easiest to drape. Kanjivaram is the ultimate investment saree.'
  },
  'Kurti': {
    minPrice: 299,
    priceRange: '₹299 – ₹4,000',
    fabrics: [
      { name: 'Cotton', desc: 'Most popular — soft, breathable, easy to wash', icon: '🌿' },
      { name: 'Rayon', desc: 'Drapey, wrinkle-resistant, smooth finish', icon: '✨' },
      { name: 'Linen', desc: 'Natural texture, perfect for summers', icon: '🌾' },
      { name: 'Silk Blend', desc: 'For festive kurtis with a premium sheen', icon: '🪡' },
      { name: 'Chanderi', desc: 'Sheer, delicate, traditional Indian weave', icon: '🌸' },
    ],
    tags: ['Ethnic', 'Casual', 'Office', 'Festival'],
    tip: 'Rayon kurtis are the most low-maintenance option for daily wear.'
  },
  'Skirt': {
    minPrice: 399,
    priceRange: '₹399 – ₹6,000',
    fabrics: [
      { name: 'Cotton', desc: 'Casual day skirts, comfortable & versatile', icon: '🌿' },
      { name: 'Denim', desc: 'Mini to midi denim skirts, casual chic', icon: '⭐' },
      { name: 'Chiffon', desc: 'Flowy midi skirts, feminine elegance', icon: '🌸' },
      { name: 'Leather/Faux', desc: 'Edgy mini skirts, party looks', icon: '🏆' },
      { name: 'Satin', desc: 'Slip skirts, effortless evening style', icon: '🪡' },
    ],
    tags: ['Casual', 'Party', 'Office'],
    tip: 'A midi chiffon skirt is incredibly versatile — style it up or down.'
  },
  'Leggings': {
    minPrice: 199,
    priceRange: '₹199 – ₹2,500',
    fabrics: [
      { name: 'Cotton Lycra', desc: 'Most common — soft, stretchy, breathable', icon: '🌿' },
      { name: 'Polyester Spandex', desc: 'Moisture-wicking, ideal for sports & yoga', icon: '⚡' },
      { name: 'Velvet', desc: 'Thick, warm leggings for winter', icon: '❄️' },
      { name: 'Wet-look/PU', desc: 'Glossy party leggings, faux leather finish', icon: '✨' },
    ],
    tags: ['Casual', 'Sports', 'Comfort'],
    tip: 'Cotton lycra for daily wear, polyester spandex for workouts.'
  },
  'Women Shoes': {
    minPrice: 499,
    priceRange: '₹499 – ₹20,000',
    fabrics: [
      { name: 'Genuine Leather', desc: 'Heels, flats, boots — durable & classic', icon: '🏆' },
      { name: 'Suede', desc: 'Soft, elegant, less water-resistant', icon: '✨' },
      { name: 'Fabric/Canvas', desc: 'Casual flats & sneakers', icon: '🌿' },
      { name: 'Patent Leather', desc: 'Glossy finish, party & formal heels', icon: '🌟' },
      { name: 'Satin', desc: 'Bridal & occasion heels', icon: '🌸' },
    ],
    tags: ['Formal', 'Casual', 'Party', 'Bridal'],
    tip: 'Block heels in leather are the most comfortable yet stylish option.'
  },
  'Handbag': {
    minPrice: 499,
    priceRange: '₹499 – ₹50,000+',
    fabrics: [
      { name: 'Genuine Leather', desc: 'Most durable, ages beautifully', icon: '🏆' },
      { name: 'Faux Leather (PU)', desc: 'Cruelty-free, affordable, wide variety', icon: '💡' },
      { name: 'Canvas', desc: 'Casual totes, lightweight & functional', icon: '🌿' },
      { name: 'Suede', desc: 'Soft, textured, semi-formal bags', icon: '✨' },
      { name: 'Rattan/Wicker', desc: 'Boho summer bags, natural aesthetic', icon: '🌾' },
    ],
    tags: ['Formal', 'Casual', 'Party', 'Everyday'],
    tip: 'One good leather bag in a neutral tone is worth every rupee.'
  },
  'Jacket': {
    minPrice: 999,
    priceRange: '₹999 – ₹12,000',
    fabrics: [
      { name: 'Denim', desc: 'Casual classic jacket, perfect for layering', icon: '🌿' },
      { name: 'Leather', desc: 'Biker jacket, timeless edge', icon: '🏆' },
      { name: 'Blazer Fabric', desc: 'Structured shoulder jackets for work', icon: '✨' },
      { name: 'Quilted Polyester', desc: 'Puffer jacket, winter warmth', icon: '❄️' },
    ],
    tags: ['Casual', 'Winter', 'Layering'],
    tip: 'A cropped denim jacket is one of the most versatile women\'s wardrobe staples.'
  },
  'Jewelry': {
    minPrice: 99,
    priceRange: '₹99 – ₹5,00,000+',
    fabrics: [
      { name: 'Gold (18K/22K)', desc: 'Investment jewelry, traditional & modern', icon: '🏆' },
      { name: 'Sterling Silver', desc: 'Contemporary, affordable fine jewelry', icon: '💎' },
      { name: 'Brass/Gold Plated', desc: 'Fashion jewelry, trend-driven designs', icon: '✨' },
      { name: 'Kundan & Meenakari', desc: 'Traditional Indian jewelry with gemstones', icon: '🌸' },
      { name: 'Oxidized Silver', desc: 'Bohemian & ethnic look, very affordable', icon: '🌿' },
    ],
    tags: ['Traditional', 'Casual', 'Wedding', 'Party'],
    tip: 'One set of good gold-plated earrings and a necklace can transform any ethnic outfit.'
  },

  // KIDS
  'Kids T-Shirt': {
    minPrice: 149,
    priceRange: '₹149 – ₹1,200',
    fabrics: [
      { name: 'Cotton (100%)', desc: 'Best for kids — soft, breathable, safe for sensitive skin', icon: '🌿' },
      { name: 'Cotton Blend', desc: 'Slightly more durable, maintains shape better', icon: '🌱' },
      { name: 'Organic Cotton', desc: 'Chemical-free, eco-friendly, gentle on skin', icon: '🌍' },
    ],
    tags: ['Everyday', 'School', 'Play'],
    tip: '100% cotton is a must for kids — it\'s the safest and most comfortable option.'
  },
  'Kids Dress': {
    minPrice: 299,
    priceRange: '₹299 – ₹3,500',
    fabrics: [
      { name: 'Cotton', desc: 'Everyday frocks, easy to wash, breathable', icon: '🌿' },
      { name: 'Net/Tulle', desc: 'Fluffy party dresses, princess look', icon: '✨' },
      { name: 'Georgette', desc: 'Ethnic dresses, festivals and occasions', icon: '🌸' },
      { name: 'Velvet', desc: 'Festive party dresses for winters', icon: '❄️' },
    ],
    tags: ['Party', 'Casual', 'Festive'],
    tip: 'For parties, layered tulle/net creates that magical puffed princess look.'
  },
  'Kids Jeans': {
    minPrice: 349,
    priceRange: '₹349 – ₹2,000',
    fabrics: [
      { name: 'Stretch Denim', desc: 'Essential for kids — flexible, comfortable for play', icon: '🤸' },
      { name: 'Cotton Denim', desc: 'Classic look, slightly stiffer but durable', icon: '🌿' },
      { name: 'Jeggings Fabric', desc: 'Legging comfort in jeans appearance', icon: '⚡' },
    ],
    tags: ['School', 'Casual', 'Everyday'],
    tip: 'Stretch denim is ideal for active kids — they can run and play freely.'
  },
  'Kids Shorts': {
    minPrice: 149,
    priceRange: '₹149 – ₹1,200',
    fabrics: [
      { name: 'Cotton', desc: 'Breathable, perfect for hot climates & play', icon: '🌿' },
      { name: 'Nylon', desc: 'Quick-dry, great for sports & outdoor activities', icon: '⚡' },
      { name: 'Denim', desc: 'Casual denim cutoffs for summer style', icon: '☀️' },
    ],
    tags: ['Summer', 'Play', 'Sports'],
    tip: 'Cotton shorts in bright colors are ideal for summer school and playdates.'
  },
  'School Uniform': {
    minPrice: 299,
    priceRange: '₹299 – ₹2,500',
    fabrics: [
      { name: 'Polyester-Cotton Blend', desc: 'Most common uniform fabric — durable & easy-iron', icon: '✨' },
      { name: 'Cotton', desc: 'Comfortable cotton uniforms for warmer schools', icon: '🌿' },
      { name: 'Polyester', desc: 'Wrinkle-resistant, holds color well, budget option', icon: '💡' },
    ],
    tags: ['School', 'Everyday'],
    tip: 'Poly-cotton blend uniforms last longer and look neater through school hours.'
  },
  'Kids Hoodie': {
    minPrice: 399,
    priceRange: '₹399 – ₹2,500',
    fabrics: [
      { name: 'Cotton Fleece', desc: 'Soft lining, gentle on child\'s skin', icon: '🌿' },
      { name: 'Polyester Fleece', desc: 'Warmer, retains heat better for winters', icon: '❄️' },
      { name: 'French Terry', desc: 'Lighter option for mild weather', icon: '🌬️' },
    ],
    tags: ['Winter', 'Casual', 'School'],
    tip: 'Cotton fleece is the ideal kids\' hoodie material — warm but not itchy.'
  },
  'Kids Shoes': {
    minPrice: 299,
    priceRange: '₹299 – ₹3,500',
    fabrics: [
      { name: 'Mesh/Knit Upper', desc: 'Breathable sneakers, perfect for active kids', icon: '⚡' },
      { name: 'Canvas', desc: 'Casual school shoes, easy to clean', icon: '🌿' },
      { name: 'Synthetic Leather', desc: 'School & party shoes, durable & affordable', icon: '💡' },
      { name: 'EVA Sole', desc: 'Lightweight, cushioned soles for all-day comfort', icon: '☁️' },
    ],
    tags: ['School', 'Sports', 'Everyday'],
    tip: 'Look for shoes with velcro or easy lace loops for younger kids\' independence.'
  },
  'Party Wear': {
    minPrice: 399,
    priceRange: '₹399 – ₹5,000',
    fabrics: [
      { name: 'Net/Tulle', desc: 'Puffed skirts and princess dresses', icon: '✨' },
      { name: 'Velvet', desc: 'Rich, festive feel for birthday and occasions', icon: '🌟' },
      { name: 'Satin', desc: 'Smooth, glossy fabric for special events', icon: '🪡' },
      { name: 'Georgette', desc: 'Flowy ethnic party wear', icon: '🌸' },
    ],
    tags: ['Birthday', 'Festive', 'Wedding'],
    tip: 'Net over satin lining creates the most magical kids\' party look.'
  },
  'Ethnic Wear': {
    minPrice: 349,
    priceRange: '₹349 – ₹6,000',
    fabrics: [
      { name: 'Cotton Blend', desc: 'Comfortable ethnic wear for daily festivals', icon: '🌿' },
      { name: 'Silk Blend', desc: 'Festive kurtas & lehengas with a sheen', icon: '🪡' },
      { name: 'Chanderi', desc: 'Fine, traditional Indian weave for special occasions', icon: '🌸' },
      { name: 'Jacquard', desc: 'Woven patterns, used for festive sets', icon: '✨' },
    ],
    tags: ['Festival', 'Wedding', 'Traditional'],
    tip: 'Silk blend for weddings, cotton blend for comfortable festival wear all day.'
  },
  'Kids Accessories': {
    minPrice: 49,
    priceRange: '₹49 – ₹800',
    fabrics: [
      { name: 'Fabric/Ribbon', desc: 'Hair bands, bows, ties — soft & colorful', icon: '🎀' },
      { name: 'Plastic/Acrylic', desc: 'Clips, bands, pins — safe and colorful for kids', icon: '🎨' },
      { name: 'Metal (Nickel-free)', desc: 'Belts, buttons — ensure nickel-free for safety', icon: '✨' },
    ],
    tags: ['Everyday', 'School', 'Party'],
    tip: 'Always choose nickel-free metal accessories for children to avoid skin irritation.'
  }
};

// ==============================
//  ITEM SELECTION — Opens Detail Panel
// ==============================
let activeCard = null;

function selectItem(card, name) {
  // Deselect if same card clicked again
  if (activeCard === card) {
    card.classList.remove('selected');
    closeItemPanel();
    activeCard = null;
    return;
  }

  // Deselect previous
  if (activeCard) activeCard.classList.remove('selected');
  card.classList.add('selected');
  activeCard = card;

  openItemPanel(name);
}

function openItemPanel(name) {
  const data = itemDatabase[name];
  if (!data) { showToast(`✦ ${name} selected`); return; }

  let panel = document.getElementById('itemDetailPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'itemDetailPanel';
    panel.className = 'item-detail-panel';
    document.body.appendChild(panel);
  }

  panel.innerHTML = `
    <div class="idp-header">
      <div>
        <div class="idp-label">Selected Item</div>
        <div class="idp-title">${name}</div>
        <div class="idp-tags">${data.tags.map(t => `<span class="idp-tag">${t}</span>`).join('')}</div>
      </div>
      <button class="idp-close" onclick="closeItemPanel()">✕</button>
    </div>

    <div class="idp-price-box">
      <div class="idp-price-label">Starting From</div>
      <div class="idp-price">₹${data.minPrice.toLocaleString()}</div>
      <div class="idp-price-range">Range: ${data.priceRange}</div>
    </div>

    <div class="idp-section">
      <div class="idp-section-title">Available Fabrics</div>
      <div class="idp-fabrics">
        ${data.fabrics.map(f => `
          <div class="fabric-card">
            <div class="fabric-icon">${f.icon}</div>
            <div class="fabric-info">
              <div class="fabric-name">${f.name}</div>
              <div class="fabric-desc">${f.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="idp-tip">
      <span class="idp-tip-icon">💡</span>
      <span>${data.tip}</span>
    </div>
  `;

  panel.classList.add('open');
}

function closeItemPanel() {
  const panel = document.getElementById('itemDetailPanel');
  if (panel) panel.classList.remove('open');
  if (activeCard) { activeCard.classList.remove('selected'); activeCard = null; }
}

// ==============================
//  USER MENU
// ==============================
function toggleUserMenu() {
  document.getElementById('userDropdown').classList.toggle('open');
}
document.addEventListener('click', e => {
  const menu = document.getElementById('userDropdown');
  if (!e.target.closest('.user-menu')) menu.classList.remove('open');
});

function logout() {
  localStorage.removeItem('ss_user');
  localStorage.removeItem('ss_name');
  window.location.href = 'login.html';
}

// ==============================
//  COLOR PREFERENCES
// ==============================
const colorPalette = [
  { name: 'Obsidian', hex: '#1a1a1a' },
  { name: 'Ivory', hex: '#f5f0e8' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Cobalt', hex: '#1a4fa0' },
  { name: 'Sky', hex: '#6aafcf' },
  { name: 'Teal', hex: '#007980' },
  { name: 'Emerald', hex: '#1a7a5a' },
  { name: 'Sage', hex: '#78917a' },
  { name: 'Olive', hex: '#6B6B2A' },
  { name: 'Forest', hex: '#2d5a2d' },
  { name: 'Caramel', hex: '#C4822A' },
  { name: 'Ochre', hex: '#C9973A' },
  { name: 'Blush', hex: '#D4876A' },
  { name: 'Rose', hex: '#B05070' },
  { name: 'Burgundy', hex: '#7B1B2A' },
  { name: 'Plum', hex: '#4A1A4A' },
  { name: 'Lavender', hex: '#8A7AB0' },
  { name: 'Lilac', hex: '#BBA0CB' },
  { name: 'Coral', hex: '#E8704A' },
  { name: 'Terracotta', hex: '#A8542A' },
  { name: 'Sand', hex: '#C8B090' },
  { name: 'Cream', hex: '#E8D8B8' },
  { name: 'White', hex: '#F8F8F8' },
  { name: 'Silver', hex: '#8A9090' },
  { name: 'Gold', hex: '#C9A84C' },
  { name: 'Mint', hex: '#7AC8A8' },
  { name: 'Blush Pink', hex: '#E8B8B8' },
  { name: 'Dusty Rose', hex: '#C89090' },
  { name: 'Slate', hex: '#607090' },
];

const selectedColors = new Set();

function initColorGrid() {
  const grid = document.getElementById('colorGrid');
  colorPalette.forEach(c => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.background = c.hex;
    swatch.title = c.name;
    swatch.dataset.hex = c.hex;
    swatch.dataset.name = c.name;
    swatch.addEventListener('click', () => toggleColor(swatch, c));
    grid.appendChild(swatch);
  });
}

function toggleColor(el, color) {
  const key = color.hex;
  if (selectedColors.has(key)) {
    selectedColors.delete(key);
    el.classList.remove('selected');
  } else {
    selectedColors.add(key);
    el.classList.add('selected');
  }
  renderSelectedSwatches();
}

function renderSelectedSwatches() {
  const container = document.getElementById('selectedSwatches');
  container.innerHTML = '';
  selectedColors.forEach(hex => {
    const s = document.createElement('div');
    s.className = 'mini-swatch';
    s.style.background = hex;
    container.appendChild(s);
  });
}

// ==============================
//  COLOR COMBINATION GENERATOR
// ==============================

// Color harmony rules database
const colorHarmonyRules = {
  neutrals:   ['#1a1a1a','#36454F','#F8F8F8','#f5f0e8','#E8D8B8','#C8B090','#8A9090'],
  warms:      ['#C4822A','#C9973A','#D4876A','#E8704A','#A8542A','#B05070','#7B1B2A','#8A0000'],
  cools:      ['#1B2A4A','#1a4fa0','#6aafcf','#007980','#1a7a5a','#78917a','#8A7AB0','#607090'],
  pastels:    ['#BBA0CB','#E8B8B8','#C89090','#7AC8A8','#FFD0A0'],
  earthy:     ['#6B6B2A','#2d5a2d','#C4822A','#A8542A','#C8B090','#6B6B2A'],
  jewel:      ['#7B1B2A','#4A1A4A','#1B2A4A','#1a7a5a','#C9A84C']
};

function getColorFamily(hex) {
  for (const [family, colors] of Object.entries(colorHarmonyRules)) {
    if (colors.includes(hex)) return family;
  }
  // Fallback: derive from hex
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  const brightness = (r*299 + g*587 + b*114) / 1000;
  if (brightness > 200) return 'pastels';
  if (r > g && r > b) return 'warms';
  if (b > r && b > g) return 'cools';
  return 'neutrals';
}

const combinationLogic = [
  {
    name: 'Classic Monochrome',
    rule: (selected) => selected.length >= 1,
    generate: (selected, palette) => {
      const base = selected[0];
      // Pick 2-3 neutrals to go with the base
      const neutrals = palette.filter(c => colorHarmonyRules.neutrals.includes(c.hex) && c.hex !== base);
      return [
        { hex: base, role: 'Dominant' },
        { hex: neutrals[0]?.hex || '#1a1a1a', role: 'Base' },
        { hex: neutrals[1]?.hex || '#F8F8F8', role: 'Accent' },
      ];
    },
    tip: 'One bold color with clean neutrals — the most timeless and versatile pairing.',
    occasion: 'Office, Everyday'
  },
  {
    name: 'Tonal Harmony',
    rule: (selected) => selected.length >= 2,
    generate: (selected) => {
      return selected.slice(0,2).map((hex, i) => ({
        hex,
        role: i === 0 ? 'Dominant' : 'Complementary'
      })).concat([{ hex: '#F8F8F8', role: 'Light Accent' }]);
    },
    tip: 'Tonal combinations use shades within the same color family for a sophisticated, pulled-together look.',
    occasion: 'Work, Smart Casual'
  },
  {
    name: 'Bold Contrast',
    rule: (selected) => selected.length >= 2,
    generate: (selected) => {
      const warm = selected.find(h => colorHarmonyRules.warms.includes(h));
      const cool = selected.find(h => colorHarmonyRules.cools.includes(h));
      if (warm && cool) {
        return [
          { hex: warm, role: 'Statement' },
          { hex: cool, role: 'Contrast' },
          { hex: '#1a1a1a', role: 'Anchor' }
        ];
      }
      return [
        { hex: selected[0], role: 'Statement' },
        { hex: selected[1] || '#1a1a1a', role: 'Contrast' },
        { hex: '#F8F8F8', role: 'Neutral' }
      ];
    },
    tip: 'Warm vs cool contrast creates high visual impact — perfect for events and parties.',
    occasion: 'Party, Festive, Date Night'
  },
  {
    name: 'Earth & Nature',
    rule: (selected) => {
      return selected.some(h => colorHarmonyRules.earthy.includes(h));
    },
    generate: (selected, palette) => {
      const earthies = palette.filter(c => colorHarmonyRules.earthy.includes(c.hex));
      return [
        { hex: selected[0], role: 'Base' },
        { hex: earthies[0]?.hex || '#C4822A', role: 'Earth Tone' },
        { hex: '#E8D8B8', role: 'Sand Neutral' }
      ];
    },
    tip: 'Earthy tones feel natural, grounded and incredibly stylish for casual and ethnic wear.',
    occasion: 'Casual, Festival, Ethnic'
  },
  {
    name: 'Pastel Dream',
    rule: (selected) => selected.some(h => colorHarmonyRules.pastels.includes(h)),
    generate: (selected) => {
      return [
        { hex: selected[0], role: 'Soft Base' },
        { hex: '#BBA0CB', role: 'Pastel Accent' },
        { hex: '#F8F8F8', role: 'Pure White' }
      ];
    },
    tip: 'Pastels layered with white create an effortlessly soft and romantic aesthetic.',
    occasion: 'Casual, Wedding Guest, Brunch'
  },
  {
    name: 'Jewel Tones',
    rule: (selected) => selected.some(h => colorHarmonyRules.jewel.includes(h)),
    generate: (selected) => {
      const jewel = selected.find(h => colorHarmonyRules.jewel.includes(h)) || selected[0];
      return [
        { hex: jewel, role: 'Rich Statement' },
        { hex: '#C9A84C', role: 'Gold Accent' },
        { hex: '#1a1a1a', role: 'Dark Anchor' }
      ];
    },
    tip: 'Jewel tones paired with gold accents is the ultimate formula for festive and wedding dressing.',
    occasion: 'Wedding, Festival, Gala'
  },
  {
    name: 'Neutral Power',
    rule: (selected) => selected.some(h => colorHarmonyRules.neutrals.includes(h)),
    generate: (selected) => {
      return [
        { hex: '#1a1a1a', role: 'Deep Neutral' },
        { hex: '#C8B090', role: 'Warm Neutral' },
        { hex: '#F8F8F8', role: 'Light Neutral' }
      ];
    },
    tip: 'An all-neutral palette is the foundation of a capsule wardrobe — endlessly mix-and-match.',
    occasion: 'Office, Travel, Everyday'
  }
];

function applyColorPrefs() {
  if (selectedColors.size === 0) { showToast('Please select at least one color'); return; }

  const selected = Array.from(selectedColors);
  generateColorCombinations(selected);
  loadEventSuggestions(currentEvent, null, true);
}

function generateColorCombinations(selectedHexes) {
  // Find which combinations are applicable
  const applicable = combinationLogic.filter(c => c.rule(selectedHexes));
  const results = applicable.slice(0, 5).map(combo => ({
    ...combo,
    colors: combo.generate(selectedHexes, colorPalette)
  }));

  // Show in panel
  let panel = document.getElementById('colorCombosPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'colorCombosPanel';
    panel.className = 'color-combos-panel';
    const colorSection = document.querySelector('.color-section');
    colorSection.appendChild(panel);
  }

  panel.innerHTML = `
    <div class="ccp-header">
      <div class="ai-badge">✦ AI Color Intelligence</div>
      <h3 class="ccp-title">Suggested Color Combinations</h3>
      <p class="ccp-sub">Based on your ${selectedHexes.length} selected color${selectedHexes.length>1?'s':''} — ${results.length} combinations generated</p>
    </div>
    <div class="ccp-grid">
      ${results.map((combo, i) => `
        <div class="ccp-card" style="animation-delay:${i*0.08}s">
          <div class="ccp-combo-bar">
            ${combo.colors.map(c => `
              <div class="ccp-color-block" style="background:${c.hex}" title="${c.role}">
                <div class="ccp-role-label">${c.role}</div>
              </div>
            `).join('')}
          </div>
          <div class="ccp-card-body">
            <div class="ccp-combo-name">${combo.name}</div>
            <div class="ccp-hexes">
              ${combo.colors.map(c => `<span class="ccp-hex-chip"><span class="ccp-hex-dot" style="background:${c.hex}"></span>${c.hex}</span>`).join('')}
            </div>
            <div class="ccp-occasion">📍 Best for: <strong>${combo.occasion}</strong></div>
            <div class="ccp-tip">💡 ${combo.tip}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast(`✦ ${results.length} color combinations generated for you!`);
}

initColorGrid();

// ==============================
//  AI EVENT SUGGESTIONS
// ==============================
let currentEvent = 'wedding';

const eventSuggestions = {
  wedding: [
    {
      category: 'Men', title: 'Royal Sherwani Look',
      pieces: ['Ivory Sherwani', 'Churidar Pants', 'Embroidered Stole', 'Mojri Shoes', 'Turban'],
      tip: 'Choose silk or brocade fabric for maximum elegance. A contrasting dupatta elevates the look.',
      colors: ['#F5F0E0', '#C9A84C', '#8A0000', '#2A1A00']
    },
    {
      category: 'Women', title: 'Bridal Silk Saree',
      pieces: ['Kanjivaram Saree', 'Silk Blouse', 'Statement Necklace', 'Gold Bangles', 'Embellished Heels'],
      tip: 'Rich jewel tones complement bridal gold jewelry perfectly. Pair with a bun adorned with fresh flowers.',
      colors: ['#8A0000', '#C9A84C', '#4A0000', '#F5E8D0']
    },
    {
      category: 'Kids', title: 'Little Royals Ethnic',
      pieces: ['Mini Sherwani / Lehenga', 'Embroidered Shoes', 'Small Accessories', 'Dupatta'],
      tip: 'Soft pastel tones with gold accents are perfect for young ones at wedding functions.',
      colors: ['#FFD0A0', '#C9A84C', '#FF9080', '#F0E8FF']
    },
    {
      category: 'Unisex', title: 'Contemporary Fusion',
      pieces: ['Indo-Western Jacket', 'Tailored Trousers', 'Embroidered Footwear', 'Pocket Square'],
      tip: 'Mixing modern cuts with traditional embroidery is the new wedding fashion statement.',
      colors: ['#2A2A2A', '#C9A84C', '#E0D0C0', '#4A3A2A']
    }
  ],
  office: [
    {
      category: 'Men', title: 'Sharp Executive',
      pieces: ['Crisp White Shirt', 'Slim Navy Trousers', 'Oxford Shoes', 'Leather Belt', 'Subtle Tie'],
      tip: 'A well-fitted white shirt is the cornerstone of professional dressing. Keep accessories minimal.',
      colors: ['#F5F5F5', '#1B2A4A', '#8B6914', '#3A3A3A']
    },
    {
      category: 'Women', title: 'Power Blazer Set',
      pieces: ['Structured Blazer', 'Straight Leg Trousers', 'Silk Blouse', 'Block Heels', 'Minimal Watch'],
      tip: 'Monochromatic outfits in neutral tones project confidence and authority in the boardroom.',
      colors: ['#2A2A3A', '#F5F0E8', '#C8B090', '#4A3A2A']
    },
    {
      category: 'Men', title: 'Business Casual',
      pieces: ['Oxford Button-down', 'Chino Pants', 'Loafers', 'Smart Watch', 'Blazer (optional)'],
      tip: 'Business casual is about looking polished without being overly formal. Opt for structured fabrics.',
      colors: ['#5A7A8A', '#E8DDD0', '#8B6914', '#2A3A2A']
    },
    {
      category: 'Women', title: 'Kurti Formal Look',
      pieces: ['Long Formal Kurti', 'Palazzo or Straight Pants', 'Block Heels', 'Light Dupatta', 'Ear Studs'],
      tip: 'Ethnic formals can be incredibly powerful. Go for structured cuts in deep, rich colours.',
      colors: ['#1A3A4A', '#C9A84C', '#E0D0C0', '#3A1A00']
    }
  ],
  party: [
    {
      category: 'Men', title: 'Statement Night Out',
      pieces: ['Patterned Shirt', 'Black Slim Trousers', 'Chelsea Boots', 'Layered Chain', 'Watch'],
      tip: 'Bold prints or textured fabrics instantly elevate a party look. Let one piece do the talking.',
      colors: ['#1A1A1A', '#8A1A3A', '#C9A84C', '#F5F0E8']
    },
    {
      category: 'Women', title: 'Glamour Sequin',
      pieces: ['Sequin Mini Dress', 'Strappy Heels', 'Clutch Bag', 'Statement Earrings', 'Bold Lip'],
      tip: 'For party nights, go all in on one bold element — sequins, an oversized earring, or a dramatic clutch.',
      colors: ['#C9A84C', '#1A1A1A', '#8A1A3A', '#F0E8D0']
    },
    {
      category: 'Kids', title: 'Party Sparkle',
      pieces: ['Sparkle Dress / Suit', 'Mary Janes / Smart Shoes', 'Bow / Bow-tie', 'Fun Accessories'],
      tip: 'Let kids be playful with metallics and bright colors — parties are meant to be fun!',
      colors: ['#FFD700', '#FF70A0', '#70A0FF', '#FFFFFF']
    },
    {
      category: 'Unisex', title: 'Boho Chic',
      pieces: ['Flowy Co-ord Set', 'Strappy Sandals', 'Layered Jewelry', 'Fringed Bag', 'Headband'],
      tip: 'Boho-chic is about layering textures — lace, fringe, and natural fabrics work beautifully together.',
      colors: ['#C8A878', '#8A5A2A', '#E8D0B0', '#3A5A3A']
    }
  ],
  casual: [
    {
      category: 'Men', title: 'Weekend Vibes',
      pieces: ['Graphic Tee', 'Slim Jeans', 'Clean White Sneakers', 'Minimalist Watch', 'Cap (optional)'],
      tip: 'A clean, well-fitted graphic tee with minimal styling is effortlessly cool for weekends.',
      colors: ['#F5F5F5', '#1B2A4A', '#E8D0B0', '#3A3A3A']
    },
    {
      category: 'Women', title: 'Effortless Casual',
      pieces: ['Linen Blouse', 'High-waist Mom Jeans', 'White Sneakers', 'Tote Bag', 'Sunglasses'],
      tip: 'Linen is perfect for casual, breathable dressing. Tuck in partially for a laid-back editorial feel.',
      colors: ['#E8D8C0', '#5A7A9A', '#F5F0E8', '#8A7A6A']
    },
    {
      category: 'Kids', title: 'Playful Casual',
      pieces: ['Printed T-shirt', 'Jogger Shorts', 'Canvas Sneakers', 'Backpack', 'Sunglasses'],
      tip: 'Bright colors and playful prints keep kids comfortable and stylish for everyday adventures.',
      colors: ['#FF7050', '#50A0FF', '#70D070', '#FFD700']
    },
    {
      category: 'Men', title: 'Smart Casual',
      pieces: ['Polo Shirt', 'Chinos', 'Loafers or Boat Shoes', 'Canvas Tote', 'Slim Bracelet'],
      tip: 'Smart casual hits the sweet spot between relaxed and put-together. Stick to two colors max.',
      colors: ['#5A7A5A', '#E8DDD0', '#8A6020', '#2A3A3A']
    }
  ],
  festival: [
    {
      category: 'Men', title: 'Festive Kurta',
      pieces: ['Silk Kurta', 'Dhoti or Pyjama', 'Kolhapuri Chappals', 'Rudraksha Bracelet', 'Angavastram'],
      tip: 'Festivals call for rich fabrics and warm tones. Turmeric yellow, saffron, and deep red are classics.',
      colors: ['#C9A84C', '#8A0000', '#FF8C00', '#F5E8C0']
    },
    {
      category: 'Women', title: 'Anarkali Glamour',
      pieces: ['Anarkali Suit', 'Dupatta', 'Jhumka Earrings', 'Bangles', 'Mojri or Heels'],
      tip: 'Mirror work and zari embroidery capture festive light beautifully. Opt for jewel-toned fabrics.',
      colors: ['#8A0000', '#C9A84C', '#4A0A8A', '#F5DEC0']
    },
    {
      category: 'Kids', title: 'Little Festive Star',
      pieces: ['Ethnic Kurta Set / Lehenga', 'Beaded Footwear', 'Tikka / Accessories', 'Bright Dupatta'],
      tip: 'Match kids to family color themes for beautiful coordinated festival photographs.',
      colors: ['#C9A84C', '#FF6030', '#8A0050', '#FFD070']
    },
    {
      category: 'Unisex', title: 'Contemporary Ethnic',
      pieces: ['Embroidered Jacket over Basic Kurta', 'Narrow Pyjama', 'Statement Footwear', 'Minimal Jewelry'],
      tip: 'A statement embroidered jacket over a plain base creates a modern ethnic look for any festival.',
      colors: ['#2A1A00', '#C9A84C', '#E8D8B0', '#5A2A00']
    }
  ],
  sport: [
    {
      category: 'Men', title: 'Performance Athletic',
      pieces: ['Moisture-wicking Tee', 'Compression Shorts', 'Running Shoes', 'Sweatband', 'Sports Watch'],
      tip: 'Opt for breathable, technical fabrics that wick sweat. Bright accents improve visibility.',
      colors: ['#1A3A6A', '#E8F0F8', '#FF6020', '#3A3A3A']
    },
    {
      category: 'Women', title: 'Athleisure Power',
      pieces: ['Sports Bra', 'High-waist Leggings', 'Training Shoes', 'Zip Jacket', 'Hair Ties'],
      tip: 'Athleisure thrives on matching sets. A coordinated top-bottom combo instantly elevates gym wear.',
      colors: ['#3A1A5A', '#E8D0FF', '#C9A84C', '#F5F5F5']
    },
    {
      category: 'Kids', title: 'Junior Athlete',
      pieces: ['Sports Jersey', 'Track Pants', 'Sports Shoes', 'Cap', 'Water Bottle'],
      tip: 'Breathable fabrics and secure fits are essential for active kids. Let them pick bold colors!',
      colors: ['#1A7A2A', '#F5F5F5', '#FF3020', '#1A3A8A']
    },
    {
      category: 'Unisex', title: 'Yoga & Wellness',
      pieces: ['Fitted Yoga Top', 'Yoga Pants', 'Non-slip Mat Shoes', 'Light Jacket', 'Meditation Beads'],
      tip: 'For yoga, choose earthy, calming tones in soft, stretchy fabrics that move with your body.',
      colors: ['#6A8A5A', '#E8D8C0', '#8A7A5A', '#F0EDE0']
    }
  ],
  date: [
    {
      category: 'Men', title: 'Romantic Evening',
      pieces: ['Dark Turtleneck', 'Tailored Trousers', 'Chelsea Boots', 'Leather Watch', 'Subtle Cologne'],
      tip: 'A dark turtleneck is the most effortlessly sophisticated date night choice. Keep it simple.',
      colors: ['#1A1A1A', '#3A2A1A', '#8A6020', '#E8D8C0']
    },
    {
      category: 'Women', title: 'Enchanting Floral',
      pieces: ['Floral Midi Dress', 'Block Heel Sandals', 'Small Chain Bag', 'Delicate Jewelry', 'Light Perfume'],
      tip: 'Florals on a date are timeless. Opt for darker, moody florals for an evening look.',
      colors: ['#8A0040', '#C9A84C', '#2A3A1A', '#F0E8D0']
    },
    {
      category: 'Men', title: 'Casual Charmer',
      pieces: ['Linen Shirt (rolled cuffs)', 'Dark Slim Jeans', 'White Sneakers or Loafers', 'Minimalist Watch'],
      tip: 'Rolling up shirt sleeves gives an effortlessly charming, approachable look for casual dates.',
      colors: ['#E8D8C0', '#1A2A3A', '#F5F5F5', '#8A6020']
    },
    {
      category: 'Women', title: 'Sleek Noir',
      pieces: ['Little Black Dress', 'Strappy Heels', 'Gold Jewelry', 'Red Lip', 'Small Evening Bag'],
      tip: 'The LBD is the ultimate date night power move. Elevate it with one bold accessory.',
      colors: ['#0A0A0A', '#C9A84C', '#8A0020', '#F5F0E8']
    }
  ]
};

function loadEventSuggestions(event, tabEl, silent = false) {
  currentEvent = event;
  if (tabEl) {
    document.querySelectorAll('.event-tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
  }

  const grid = document.getElementById('aiSuggestionsGrid');
  grid.innerHTML = '';

  const suggestions = eventSuggestions[event] || [];
  suggestions.forEach(s => {
    const card = document.createElement('div');
    card.className = 'ai-card';
    card.innerHTML = `
      <div class="ai-card-category">${s.category}</div>
      <div class="ai-card-title">${s.title}</div>
      <div class="ai-card-visual">
        ${s.colors.map(c => `<div class="color-dot" style="background:${c}"></div>`).join('')}
      </div>
      <div class="ai-card-pieces">
        ${s.pieces.map(p => `<span class="piece-tag">${p}</span>`).join('')}
      </div>
      <div class="ai-card-tip">💡 ${s.tip}</div>
    `;
    grid.appendChild(card);
  });

  if (!silent) showToast(`✦ AI suggestions loaded for ${event} events`);
}

// Load initial suggestions
loadEventSuggestions('wedding', null, true);

// ==============================
//  OUTFIT RECOMMENDER MODAL
// ==============================
let uploadedFiles = [];

function openOutfitRecommender() {
  document.getElementById('outfitModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOutfitModal(e) {
  if (!e || e.target === document.getElementById('outfitModal')) {
    document.getElementById('outfitModal').classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleOutfitUpload(input) {
  const files = Array.from(input.files).slice(0, 10);
  uploadedFiles = files;

  const container = document.getElementById('uploadedPreviews');
  container.innerHTML = '';

  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = e => {
      const thumb = document.createElement('div');
      thumb.className = 'preview-thumb';
      thumb.dataset.idx = i;
      thumb.innerHTML = `
        <img src="${e.target.result}" alt="outfit ${i+1}"/>
        <button class="preview-remove" onclick="removePreview(${i})">✕</button>
      `;
      container.appendChild(thumb);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('analyzeBtn').style.display = files.length > 0 ? 'block' : 'none';
  document.getElementById('resultsSection').style.display = 'none';
}

function removePreview(idx) {
  uploadedFiles.splice(idx, 1);
  const container = document.getElementById('uploadedPreviews');
  const thumbs = container.querySelectorAll('.preview-thumb');
  if (thumbs[idx]) thumbs[idx].remove();
  if (uploadedFiles.length === 0) {
    document.getElementById('analyzeBtn').style.display = 'none';
  }
}

// Outfit ranking remarks
const rankRemarks = [
  {
    score: '98/100',
    remark: 'Exceptional color harmony and style coherence. This outfit is perfectly balanced for the occasion — every piece complements each other flawlessly. A definitive style winner.',
    label: 'Perfect Match'
  },
  {
    score: '91/100',
    remark: 'Outstanding combination with excellent tonal balance. The silhouette is flattering and the accessories elevate the overall look. A highly confident style choice.',
    label: 'Excellent Match'
  },
  {
    score: '84/100',
    remark: 'Strong outfit with good visual flow. Minor adjustments — such as a different accessory or footwear swap — would push this to perfection. Very wearable and stylish.',
    label: 'Great Match'
  },
  {
    score: '76/100',
    remark: 'Solid foundation with good pieces. The color palette works but could benefit from a tonal adjustment. Consider adding a complementary layer or accessory.',
    label: 'Good Match'
  },
  {
    score: '67/100',
    remark: 'Decent combination that works for casual settings. The pieces are individually strong but could be paired more intentionally. A belt or scarf would tie it together.',
    label: 'Fair Match'
  },
  {
    score: '58/100',
    remark: 'Moderate style score. The individual pieces are good but the combination creates some visual noise. Consider switching the footwear or adjusting the color contrast.',
    label: 'Moderate Match'
  },
  {
    score: '44/100',
    remark: 'The pieces conflict slightly in style and color. While bold choices can work, this combination needs refinement. Stick to one statement piece and neutralize the rest.',
    label: 'Needs Work'
  },
  {
    score: '32/100',
    remark: 'Challenging combination that works against style cohesion. Consider rethinking the color palette — select a dominant tone and build the outfit around it.',
    label: 'Restyle Needed'
  }
];

const rankMedals = ['🥇', '🥈', '🥉'];
const rankClasses = ['gold-rank', 'silver-rank', 'bronze-rank'];

function analyzeOutfits() {
  if (uploadedFiles.length === 0) { showToast('Please upload at least one outfit photo'); return; }

  const btn = document.getElementById('analyzeBtn');
  const btnText = document.getElementById('analyzeBtnText');
  btn.disabled = true;
  btnText.textContent = '⏳ Analyzing your outfits with AI...';

  // Simulate AI analysis delay
  setTimeout(() => {
    btn.disabled = false;
    btnText.textContent = '✦ Analyze & Rank Outfits';
    renderRankings();
  }, 2200);
}

function renderRankings() {
  const section = document.getElementById('resultsSection');
  const list = document.getElementById('rankingsList');
  list.innerHTML = '';
  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Shuffle and rank the uploaded files
  const shuffled = [...uploadedFiles].sort(() => Math.random() - 0.5);

  shuffled.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = e => {
      const data = rankRemarks[Math.min(i, rankRemarks.length - 1)];
      const item = document.createElement('div');
      item.className = 'rank-item';
      item.style.animationDelay = (i * 0.08) + 's';

      const medalEmoji = rankMedals[i] || `#${i + 1}`;
      const rankClass = rankClasses[i] || 'other-rank';

      item.innerHTML = `
        <div class="rank-badge ${rankClass}">${medalEmoji}</div>
        <img class="rank-img" src="${e.target.result}" alt="Outfit ${i+1}"/>
        <div class="rank-content">
          <div class="rank-name">Outfit ${i + 1} — ${data.label}</div>
          <div class="rank-score">AI Score: ${data.score}</div>
          <div class="rank-remark">${data.remark}</div>
        </div>
      `;
      list.appendChild(item);
    };
    reader.readAsDataURL(file);
  });

  showToast(`✦ ${shuffled.length} outfit(s) ranked successfully!`);
}

// ==============================
//  WARDROBE
// ==============================
function addToWardrobe(input) {
  const files = Array.from(input.files);
  const grid = document.getElementById('wardrobeGrid');

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const item = document.createElement('div');
      item.className = 'wardrobe-item';
      item.innerHTML = `
        <img src="${e.target.result}" alt="wardrobe item"/>
        <div class="wardrobe-item-overlay">
          <button class="wardrobe-remove" onclick="this.closest('.wardrobe-item').remove()">Remove</button>
        </div>
      `;
      grid.appendChild(item);
    };
    reader.readAsDataURL(file);
  });

  showToast(`✦ ${files.length} item(s) added to wardrobe`);
}

// ==============================
//  CONTACT FORM
// ==============================
function contactSubmit() {
  document.getElementById('contactSuccess').style.display = 'block';
  showToast('✦ Message sent successfully!');
}

// ==============================
//  TOAST NOTIFICATION
// ==============================
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==============================
//  HEADER SCROLL EFFECT
// ==============================
window.addEventListener('scroll', () => {
  const h = document.getElementById('siteHeader');
  if (window.scrollY > 20) {
    h.style.boxShadow = '0 4px 40px rgba(0,0,0,0.5)';
  } else {
    h.style.boxShadow = 'none';
  }
});
