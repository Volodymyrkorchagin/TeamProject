import React, { useState, useEffect } from "react";

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "https://kaleigh-remindful-actinically.ngrok-free.dev/api/Products";

  const fetchProducts = async () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error loading products: ${response.status}`);
      }

      const data = await response.json();
      
      const rawProducts = Array.isArray(data) ? data : data.items || [];
      const normalizedProducts = rawProducts.map((p) => ({
        id: p.id ?? p.Id ?? p.productId ?? p.ProductId,
        name: p.name || p.Name || "Unnamed",
        calories: p.calories ?? p.Calories ?? 0,
        proteins: p.proteins ?? p.Proteins ?? 0,
        fats: p.fats ?? p.Fats ?? 0,
        carbs: p.carbs ?? p.Carbs ?? 0,
        unit: p.unit || p.Unit || "g",
        calorieUnit: "kcal",
        proteinUnit: "gramm (g)",
        fatUnit: "gramm (g)",
        carbUnit: "gramm (g)",
      }));

      setProducts(normalizedProducts);
      setError("");
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleValueChange = (id, field, delta) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedValue = Math.max(0, (item[field] || 0) + delta);
          return { ...item, [field]: updatedValue };
        }
        return item;
      })
    );
  };

  const handleUnitChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("Error: Product ID is missing.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const deleteUrl = `${API_URL}/delete/${id}`;

    const headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    };

    try {
      let response = await fetch(deleteUrl, {
        method: "DELETE",
        headers,
      });

      if (response.status === 405) {
        response = await fetch(deleteUrl, {
          method: "POST",
          headers,
        });
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(`Delete failed (${response.status}):`, errorText);
        throw new Error(`Server status ${response.status}`);
      }

      setProducts((prev) => prev.filter((item) => item.id !== id));
      if (openId === id) setOpenId(null);
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Could not delete item (${err.message})`);
    }
  };

  const handleSave = async (product) => {
    const token = localStorage.getItem("authToken");

    const payload = {
      Id: product.id,
      Name: product.name,
      Unit: product.unit,
      Calories: Number(product.calories),
      Proteins: Number(product.proteins),
      Fats: Number(product.fats),
      Carbs: Number(product.carbs),
    };

    try {
      const response = await fetch(`${API_URL}/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(`Save failed (${response.status}):`, errorText);
        throw new Error(`Server status ${response.status}`);
      }

      setOpenId(null);
      alert("Product saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert(`Error saving changes (${err.message})`);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.searchIcon}>🔍</span>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Products</h2>

        {loading && <p style={styles.statusText}>Loading products...</p>}
        {error && <p style={styles.errorText}>{error}</p>}

        {!loading && filteredProducts.length === 0 && (
          <p style={styles.statusText}>No products found.</p>
        )}

        {filteredProducts.map((product) => {
          const isOpen = openId === product.id;

          return (
            <div
              key={product.id || Math.random()}
              style={{
                ...styles.accordion,
                backgroundColor: isOpen ? "#f3f5eb" : "#f7f7f3",
                border: isOpen ? "1px solid #dcdfd0" : "1px solid #e2e2dc",
              }}
            >
              <div
                style={styles.accordionHeader}
                onClick={() => toggleOpen(product.id)}
              >
                <span style={styles.productName}>{product.name}</span>
                <div style={styles.headerRight}>
                  <span style={styles.badge}>{product.calories} Cal</span>
                  <span style={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>

              {isOpen && (
                <div style={styles.accordionBody}>
                  <div style={styles.grid}>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>calories</label>
                      <div style={styles.controlsRow}>
                        <div style={styles.stepper}>
                          <button
                            type="button"
                            style={styles.stepBtn}
                            onClick={() =>
                              handleValueChange(product.id, "calories", -10)
                            }
                          >
                            −
                          </button>
                          <span style={styles.stepVal}>{product.calories}</span>
                          <button
                            type="button"
                            style={styles.stepBtn}
                            onClick={() =>
                              handleValueChange(product.id, "calories", 10)
                            }
                          >
                            +
                          </button>
                        </div>
                        <select
                          value={product.calorieUnit}
                          onChange={(e) =>
                            handleUnitChange(
                              product.id,
                              "calorieUnit",
                              e.target.value
                            )
                          }
                          style={styles.select}
                        >
                          <option value="kcal">kcal</option>
                          <option value="cal">cal</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>proteins</label>
                      <div style={styles.controlsRow}>
                        <div style={styles.stepper}>
                          <button
                            type="button"
                            style={styles.stepBtn}
                            onClick={() =>
                              handleValueChange(product.id, "proteins", -1)
                            }
                          >
                            −
                          </button>
                          <span style={styles.stepVal}>{product.proteins}</span>
                          <button
                            type="button"
                            style={styles.stepBtn}
                            onClick={() =>
                              handleValueChange(product.id, "proteins", 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <select
                          value={product.proteinUnit}
                          onChange={(e) =>
                            handleUnitChange(
                              product.id,
                              "proteinUnit",
                              e.target.value
                            )
                          }
                          style={styles.select}
                        >
                          <option value="gramm (g)">gramm (g)</option>
                          <option value="mg">mg</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>fats</label>
                      <div style={styles.controlsRow}>
                        <div style={styles.stepper}>
                          <button
                            type="button"
                            style={styles.stepBtn}
                            onClick={() =>
                              handleValueChange(product.id, "fats", -1)
                            }
                          >
                            −
                          </button>
                          <span style={styles.stepVal}>{product.fats}</span>
                          <button
                            type="button"
                            style={styles.stepBtn}
                            onClick={() =>
                              handleValueChange(product.id, "fats", 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <select
                          value={product.fatUnit}
                          onChange={(e) =>
                            handleUnitChange(
                              product.id,
                              "fatUnit",
                              e.target.value
                            )
                          }
                          style={styles.select}
                        >
                          <option value="gramm (g)">gramm (g)</option>
                          <option value="mg">mg</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>carbs</label>
                      <div style={styles.controlsRow}>
                        <div style={styles.stepper}>
                          <button
                            type="button"
                            style={styles.stepBtn}
                            onClick={() =>
                              handleValueChange(product.id, "carbs", -1)
                            }
                          >
                            −
                          </button>
                          <span style={styles.stepVal}>{product.carbs}</span>
                          <button
                            type="button"
                            style={styles.stepBtn}
                            onClick={() =>
                              handleValueChange(product.id, "carbs", 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <select
                          value={product.carbUnit}
                          onChange={(e) =>
                            handleUnitChange(
                              product.id,
                              "carbUnit",
                              e.target.value
                            )
                          }
                          style={styles.select}
                        >
                          <option value="gramm (g)">gramm (g)</option>
                          <option value="mg">mg</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={styles.saveBtn}
                      onClick={() => handleSave(product)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "680px",
    margin: "20px auto",
    fontFamily: "sans-serif",
    color: "#4a4a40",
  },
  searchWrapper: {
    position: "relative",
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 18px",
    borderRadius: "25px",
    border: "1px solid #e0e0d8",
    backgroundColor: "#f5f5f0",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  searchIcon: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#777",
    pointerEvents: "none",
  },
  card: {
    backgroundColor: "#fcfcf9",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
    border: "1px solid #eeeeea",
  },
  title: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "20px",
    color: "#333",
  },
  statusText: {
    textAlign: "center",
    color: "#777",
    fontSize: "14px",
  },
  errorText: {
    textAlign: "center",
    color: "#d9534f",
    fontSize: "14px",
  },
  accordion: {
    borderRadius: "16px",
    marginBottom: "12px",
    overflow: "hidden",
    transition: "all 0.2s ease",
  },
  accordionHeader: {
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  productName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  badge: {
    backgroundColor: "#e3e5cf",
    color: "#555",
    fontSize: "12px",
    padding: "4px 12px",
    borderRadius: "12px",
    fontWeight: "bold",
  },
  arrow: {
    fontSize: "10px",
    color: "#666",
  },
  accordionBody: {
    padding: "0 18px 18px 18px",
    borderTop: "1px solid #e5e7da",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "12px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    color: "#777",
  },
  controlsRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  stepper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e8eae0",
    borderRadius: "20px",
    padding: "2px 8px",
    flex: 1,
    justifyContent: "space-between",
  },
  stepBtn: {
    border: "none",
    backgroundColor: "#b8be9f",
    color: "#fff",
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "bold",
  },
  stepVal: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#444",
  },
  select: {
    backgroundColor: "#e8eae0",
    border: "none",
    borderRadius: "15px",
    padding: "6px 10px",
    fontSize: "12px",
    color: "#444",
    outline: "none",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "16px",
  },
  saveBtn: {
    backgroundColor: "transparent",
    border: "1px solid #b2b899",
    color: "#555",
    padding: "6px 20px",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "13px",
  },
  deleteBtn: {
    backgroundColor: "#fde8e8",
    border: "1px solid #f8b4b4",
    color: "#d9534f",
    padding: "6px 20px",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "13px",
  },
};