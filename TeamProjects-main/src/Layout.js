import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const footerRef = useRef(null);

  const scrollToContent = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <div style={styles.overlay} />

        <div style={styles.content}>
          <h1 style={styles.title}>
            Count calories <br />
            <span style={styles.subtitleTitle}>live mindfully</span>
          </h1>

          <p style={styles.description}>
            A simple way to track your nutrition, reach your goals, and <br />
            feel better.
          </p>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => navigate("/registration")}
              style={styles.primaryButton}
            >
              Start <span style={styles.arrow}>→</span>
            </button>

            <button
              onClick={scrollToContent}
              style={styles.secondaryButton}
            >
              How it works
            </button>
          </div>

          <div style={styles.scrollIndicator} onClick={scrollToContent}>
            <div style={styles.mouseOutline}>
              <span style={styles.scrollArrow}>↓</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={footerRef} style={styles.bottomSection}>
        <div style={styles.infoCard}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.stepsGrid}>
            <div style={styles.stepItem}>
              <div style={styles.stepNumber}>1</div>
              <p style={styles.stepText}>Create your personal account with your daily metrics.</p>
            </div>
            <div style={styles.stepItem}>
              <div style={styles.stepNumber}>2</div>
              <p style={styles.stepText}>Log the food you eat throughout the day using our database.</p>
            </div>
            <div style={styles.stepItem}>
              <div style={styles.stepNumber}>3</div>
              <p style={styles.stepText}>Keep track of your protein, fat, carb, and calorie goals!</p>
            </div>
          </div>

          <div style={styles.contactsBlock}>
            <h3 style={styles.contactsTitle}>Contacts</h3>
            <p style={styles.contactItem}>📧 Email: support@fitnessapp.com</p>
            <p style={styles.contactItem}>💬 Telegram: @fitness_app_support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#eef0e5",
    minHeight: "100vh",
    margin: 0,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  heroSection: {
    position: "relative",
    width: "100%",
    height: "85vh",
    minHeight: "550px",
    backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderBottomLeftRadius: "50% 12%",
    borderBottomRightRadius: "50% 12%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(25, 40, 20, 0.45)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    color: "#ffffff",
    padding: "0 20px",
    maxWidth: "700px",
  },
  title: {
    fontSize: "clamp(36px, 5vw, 56px)",
    fontWeight: "700",
    lineHeight: "1.15",
    margin: "0 0 16px 0",
    letterSpacing: "-0.5px",
  },
  subtitleTitle: {
    color: "#a4b882",
    fontWeight: "400",
  },
  description: {
    fontSize: "clamp(14px, 2vw, 18px)",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "32px",
    lineHeight: "1.5",
    fontWeight: "300",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "40px",
  },
  primaryButton: {
    backgroundColor: "#f5a823",
    color: "#1c2510",
    border: "none",
    borderRadius: "30px",
    padding: "12px 32px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  arrow: {
    fontSize: "18px",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    borderRadius: "30px",
    padding: "12px 28px",
    fontSize: "16px",
    fontWeight: "400",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
  },
  scrollIndicator: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    cursor: "pointer",
  },
  mouseOutline: {
    width: "22px",
    height: "38px",
    border: "1.5px solid rgba(255, 255, 255, 0.8)",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollArrow: {
    color: "#ffffff",
    fontSize: "12px",
  },
  bottomSection: {
    padding: "60px 20px",
    display: "flex",
    justifyContent: "center",
  },
  infoCard: {
    maxWidth: "800px",
    width: "100%",
    backgroundColor: "#f8f9f4",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  sectionTitle: {
    fontSize: "28px",
    color: "#2a3617",
    marginBottom: "30px",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  stepItem: {
    padding: "16px",
    backgroundColor: "#eef0e5",
    borderRadius: "16px",
  },
  stepNumber: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#f5a823",
    marginBottom: "8px",
  },
  stepText: {
    fontSize: "14px",
    color: "#4a5438",
    lineHeight: "1.4",
    margin: 0,
  },
  contactsBlock: {
    borderTop: "1px solid #e0e2d8",
    paddingTop: "24px",
  },
  contactsTitle: {
    fontSize: "20px",
    color: "#2a3617",
    marginBottom: "12px",
  },
  contactItem: {
    fontSize: "15px",
    color: "#5b664d",
    margin: "6px 0",
  },
};