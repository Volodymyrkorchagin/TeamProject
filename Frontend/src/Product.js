import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";

// Функція для відправки запиту на backend винесена за межі компонента
export const createProduct = async (productData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.warn("Токен відсутній. Перенаправлення на авторизацію...");
    window.location.href = "/registration";
    return null;
  }

  // Формуємо строго валідований payload у PascalCase
  const payload = {
    Name: String(productData.name).trim(),
    Unit: String(productData.unit),
    PortionSize: Number(productData.portionSize) || 0,
    Calories: Number(productData.calories) || 0,
    Proteins: Number(productData.proteins) || 0,
    Fats: Number(productData.fats) || 0,
    Carbs: Number(productData.carbs) || 0,
  };

  try {
    const response = await fetch(
      "https://kaleigh-remindful-actinically.ngrok-free.dev/api/Products/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.status === 401) {
      console.error("Сесія закінчилася. Потрібно знову увійти.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/registration";
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || errorData?.title || `Помилка створення: ${response.status}`
      );
    }

    const createdProduct = await response.json().catch(() => payload);
    console.log("Продукт успішно створено:", createdProduct);
    return createdProduct;
  } catch (error) {
    console.error("Помилка при створенні продукту:", error);
    throw error;
  }
};

export default function AddProduct({ onAddProduct }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    unit: "g",
    portionSize: "100",
    calories: "100",
    proteins: "100",
    fats: "100",
    carbs: "100",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStep = (field, delta) => {
    setProductData((prev) => {
      const currentVal = Number(prev[field]) || 0;
      const newVal = Math.max(0, currentVal + delta);
      return { ...prev, [field]: String(newVal) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      Number(productData.calories) < 0 ||
      Number(productData.proteins) < 0 ||
      Number(productData.fats) < 0 ||
      Number(productData.carbs) < 0 ||
      Number(productData.portionSize) <= 0
    ) {
      setError("Values cannot be negative or zero!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await createProduct(productData);

      if (result) {
        if (onAddProduct) {
          onAddProduct(result);
        }

        // Скидання форми та перехід до списку
        setProductData({
          name: "",
          unit: "g",
          portionSize: "100",
          calories: "100",
          proteins: "100",
          fats: "100",
          carbs: "100",
        });

        navigate("/productsList");
      }
    } catch (err) {
      setError(err.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <main style={styles.mainContent}>
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.mainLabel}>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name of product"
                value={productData.name}
                onChange={handleChange}
                required
                style={styles.nameInput}
              />
            </div>

            <div style={styles.amountSection}>
              <h3 style={styles.amountTitle}>Amount</h3>

              {error && <p style={styles.errorMessage}>{error}</p>}

              <div style={styles.grid2x2}>
                <div style={styles.gridItem}>
                  <label style={styles.subLabel}>calories</label>
                  <div style={styles.inputRow}>
                    <div style={styles.counterBox}>
                      <button
                        type="button"
                        onClick={() => handleStep("calories", -10)}
                        style={styles.counterBtn}
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        name="calories"
                        value={productData.calories}
                        onChange={handleChange}
                        style={styles.numberInput}
                      />
                      <button
                        type="button"
                        onClick={() => handleStep("calories", 10)}
                        style={styles.counterBtn}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <select
                      name="unit"
                      value={productData.unit}
                      onChange={handleChange}
                      style={styles.selectUnit}
                    >
                      <option value="g">kcal</option>
                      <option value="pcs">kcal / pcs</option>
                    </select>
                  </div>
                </div>

                <div style={styles.gridItem}>
                  <label style={styles.subLabel}>proteins</label>
                  <div style={styles.inputRow}>
                    <div style={styles.counterBox}>
                      <button
                        type="button"
                        onClick={() => handleStep("proteins", -5)}
                        style={styles.counterBtn}
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        name="proteins"
                        value={productData.proteins}
                        onChange={handleChange}
                        style={styles.numberInput}
                      />
                      <button
                        type="button"
                        onClick={() => handleStep("proteins", 5)}
                        style={styles.counterBtn}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <select style={styles.selectUnit}>
                      <option>gramm (g)</option>
                    </select>
                  </div>
                </div>

                <div style={styles.gridItem}>
                  <label style={styles.subLabel}>fats</label>
                  <div style={styles.inputRow}>
                    <div style={styles.counterBox}>
                      <button
                        type="button"
                        onClick={() => handleStep("fats", -5)}
                        style={styles.counterBtn}
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        name="fats"
                        value={productData.fats}
                        onChange={handleChange}
                        style={styles.numberInput}
                      />
                      <button
                        type="button"
                        onClick={() => handleStep("fats", 5)}
                        style={styles.counterBtn}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <select style={styles.selectUnit}>
                      <option>gramm (g)</option>
                    </select>
                  </div>
                </div>

                <div style={styles.gridItem}>
                  <label style={styles.subLabel}>carbs</label>
                  <div style={styles.inputRow}>
                    <div style={styles.counterBox}>
                      <button
                        type="button"
                        onClick={() => handleStep("carbs", -5)}
                        style={styles.counterBtn}
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        name="carbs"
                        value={productData.carbs}
                        onChange={handleChange}
                        style={styles.numberInput}
                      />
                      <button
                        type="button"
                        onClick={() => handleStep("carbs", 5)}
                        style={styles.counterBtn}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <select style={styles.selectUnit}>
                      <option>gramm (g)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? "Adding..." : "Add product"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#2d3a1e",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  mainContent: {
    flex: 1,
    position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#f4f5ee",
    borderRadius: "24px",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "580px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    zIndex: 1,
  },
  fieldGroup: {
    marginBottom: "24px",
  },
  mainLabel: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2a3617",
    display: "block",
    marginBottom: "10px",
  },
  nameInput: {
    width: "100%",
    padding: "12px 20px",
    borderRadius: "20px",
    border: "1px solid #e0e2d8",
    backgroundColor: "#eef0e5",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  amountSection: {
    marginBottom: "24px",
  },
  amountTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2a3617",
    marginBottom: "16px",
  },
  grid2x2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px 24px",
  },
  gridItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  subLabel: {
    fontSize: "12px",
    color: "#5b664d",
    fontWeight: "500",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  counterBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#eef0e5",
    borderRadius: "18px",
    padding: "4px 8px",
    border: "1px solid #e0e2d8",
    flex: 1,
  },
  counterBtn: {
    backgroundColor: "#c5ceb1",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#2a3617",
    padding: 0,
  },
  numberInput: {
    width: "100%",
    border: "none",
    background: "transparent",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "600",
    color: "#2a3617",
    outline: "none",
  },
  selectUnit: {
    backgroundColor: "#eef0e5",
    border: "1px solid #e0e2d8",
    borderRadius: "18px",
    padding: "8px 12px",
    fontSize: "12px",
    color: "#2a3617",
    outline: "none",
    cursor: "pointer",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#f5a823",
    color: "#1c2510",
    border: "none",
    borderRadius: "24px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  errorMessage: {
    color: "red",
    fontSize: "13px",
    marginBottom: "12px",
    fontWeight: "bold",
  },
};