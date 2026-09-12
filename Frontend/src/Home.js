import React, { useState } from "react";
import { Search, Calendar, Trash2, Leaf, Plus } from "lucide-react";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Quarter Pounder with Cheese Deluxe (McDonald's)",
    calories: 630,
    proteins: 20,
    fats: 130,
    carbs: 50,
  },
  {
    id: 2,
    name: "Big Mac (McDonald's)",
    calories: 550,
    proteins: 25,
    fats: 30,
    carbs: 45,
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults] = useState(INITIAL_PRODUCTS);

  const [todaysDiet, setTodaysDiet] = useState([
    {
      id: 1,
      name: "Quarter Pounder with Cheese Deluxe (McDonald's)",
      calories: 630,
      proteins: 20,
      fats: 130,
      carbs: 50,
    },
  ]);

  const targetCalories = 1600;
  const consumedCalories = todaysDiet.reduce((acc, item) => acc + item.calories, 0);
  const leftCalories = Math.max(0, targetCalories - consumedCalories);

  const consumedProteins = todaysDiet.reduce((acc, item) => acc + item.proteins, 0);
  const consumedFats = todaysDiet.reduce((acc, item) => acc + item.fats, 0);
  const consumedCarbs = todaysDiet.reduce((acc, item) => acc + item.carbs, 0);

  const targetProteins = 150;
  const targetFats = 70;
  const targetCarbs = 300;

  const handleAddFood = (product) => {
    setTodaysDiet((prev) => [...prev, { ...product, id: Date.now() }]);
  };

  const handleRemoveFood = (id) => {
    setTodaysDiet((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredProducts = searchResults.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.layout}>
        <div style={styles.leftColumn}>
          <div style={styles.headerGroup}>
            <h1 style={styles.mainTitle}>Add food</h1>
            <p style={styles.subtitle}>
              Find a product in the database or add your own. Once added, it will automatically appear in your food diary.
            </p>

            <div style={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              <Search style={styles.searchIcon} size={20} />
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Search results</h2>

            {filteredProducts.map((product) => (
              <div key={product.id} style={styles.productRow}>
                <div style={styles.productInfo}>
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.productMacros}>
                    <span>🔥 {product.calories} kcal</span>
                    <span>🥩 {product.proteins} g</span>
                    <span>🧈 {product.fats} g</span>
                    <span>🌾 {product.carbs} g</span>
                  </div>
                </div>
                <button
                  style={styles.addButton}
                  onClick={() => handleAddFood(product)}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.card}>
            <div style={styles.todayHeader}>
              <Calendar size={22} color="#4a5d23" />
              <span style={styles.todayTitle}>Today</span>
            </div>

            <div style={styles.circleContainer}>
              <div style={styles.circleOuter}>
                <span style={styles.circleValue}>{consumedCalories}</span>
                <span style={styles.circleUnit}>kcal</span>
                <span style={styles.circleSub}>out of {targetCalories}</span>
              </div>
            </div>

            <div style={styles.macroGroup}>
              <div style={styles.macroRow}>
                <span style={styles.macroLabel}>Proteins</span>
                <span style={styles.macroValue}>
                  {consumedProteins}g / {targetProteins}g
                </span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(100, (consumedProteins / targetProteins) * 100)}%`,
                    backgroundColor: "#5a6b28",
                  }}
                />
              </div>

              <div style={styles.macroRow}>
                <span style={styles.macroLabel}>Fats</span>
                <span style={styles.macroValue}>
                  {consumedFats}g / {targetFats}g
                </span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(100, (consumedFats / targetFats) * 100)}%`,
                    backgroundColor: "#e09f19",
                  }}
                />
              </div>

              <div style={styles.macroRow}>
                <span style={styles.macroLabel}>Carbs</span>
                <span style={styles.macroValue}>
                  {consumedCarbs}g / {targetCarbs}g
                </span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(100, (consumedCarbs / targetCarbs) * 100)}%`,
                    backgroundColor: "#9e5d26",
                  }}
                />
              </div>
            </div>

            <div style={styles.leftBanner}>
              <Leaf size={28} color="#4a5d23" style={{ transform: "scaleX(-1)" }} />
              <div>
                <div style={styles.leftTitle}>Left</div>
                <div style={styles.leftValue}>{leftCalories} kcal</div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Your diet for today</h2>

            {todaysDiet.length === 0 ? (
              <p style={{ color: "#888", fontSize: "14px" }}>No items added yet.</p>
            ) : (
              todaysDiet.map((item) => (
                <div key={item.id} style={styles.dietRow}>
                  <span style={styles.dietName}>{item.name}</span>
                  <div style={styles.dietRight}>
                    <span style={styles.dietBadge}>{item.calories} Cal</span>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleRemoveFood(item.id)}
                    >
                      <Trash2 size={18} color="#778062" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#eef0e5",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#333",
    boxSizing: "border-box",
  },
  layout: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "30px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#222",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888c80",
    margin: "0 0 20px 0",
    lineHeight: "1.4",
  },
  searchWrapper: {
    position: "relative",
    width: "100%",
  },
  searchInput: {
    width: "100%",
    padding: "14px 45px 14px 20px",
    borderRadius: "30px",
    border: "1px solid #e0e2d8",
    backgroundColor: "#f7f8f3",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  searchIcon: {
    position: "absolute",
    right: "18px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#5b664d",
  },
  card: {
    backgroundColor: "#f8f9f4",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginTop: 0,
    marginBottom: "18px",
    color: "#222",
  },
  productRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f2e9",
    borderRadius: "16px",
    padding: "16px 20px",
    border: "1px solid #e2e5d8",
  },
  productInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  productName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#222",
  },
  productMacros: {
    display: "flex",
    gap: "16px",
    fontSize: "13px",
    color: "#6b725c",
  },
  addButton: {
    backgroundColor: "#3b4822",
    color: "#fff",
    border: "none",
    padding: "8px 20px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },
  todayHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  todayTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#222",
  },
  circleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  circleOuter: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    backgroundColor: "#e8ebe0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  circleValue: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#222",
    lineHeight: "1",
  },
  circleUnit: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#444",
    marginTop: "2px",
  },
  circleSub: {
    fontSize: "11px",
    color: "#888",
    marginTop: "4px",
  },
  macroGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  macroRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
  },
  macroLabel: {
    fontWeight: "500",
    color: "#444",
  },
  macroValue: {
    color: "#888",
  },
  progressTrack: {
    height: "8px",
    backgroundColor: "#e8ebe0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  leftBanner: {
    backgroundColor: "#e3e7d8",
    borderRadius: "14px",
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  leftTitle: {
    fontSize: "12px",
    color: "#6b725c",
  },
  leftValue: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#333",
  },
  dietRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f2e9",
    borderRadius: "14px",
    padding: "12px 16px",
    border: "1px solid #e2e5d8",
  },
  dietName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#333",
    maxWidth: "180px",
  },
  dietRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dietBadge: {
    backgroundColor: "#e4e7da",
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "12px",
    color: "#555",
  },
  deleteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
};