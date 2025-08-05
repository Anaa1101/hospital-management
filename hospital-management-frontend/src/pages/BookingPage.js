

import React from "react";
import { withRouter } from "./withRouter"; // We'll create this helper

class BookingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nurses: [],
      selectedNurses: ["", "", "", ""],
      fromDate: "",
      notes: "",
      message: "",
      currentNurses: [],
      doctor: null,
    };
  }

  componentDidMount() {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      this.setState({ doctor: JSON.parse(storedDoctor) }, () => {
        this.fetchAllNurses();
        this.fetchCurrentNurses();
      });
    } else {
      this.props.navigate("/"); // ✅ Proper navigation
    }
  }

  fetchAllNurses = () => {
    fetch("http://localhost:5078/api/booking/nurses")
      .then((res) => res.json())
      .then((data) => this.setState({ nurses: data }))
      .catch(console.error);
  };

  fetchCurrentNurses = () => {
    const { doctor } = this.state;
    if (!doctor) return;
    fetch(`http://localhost:5078/api/booking/current/${doctor.doctorId}`)
      .then((res) => res.json())
      .then((data) => this.setState({ currentNurses: data }))
      .catch(console.error);
  };

  handleLogout = () => {
    localStorage.removeItem("doctor");
    this.props.navigate("/"); // ✅ Use real navigation
  };

  handleSelectChange = (index, value) => {
    const updated = [...this.state.selectedNurses];
    updated[index] = value;
    const filtered = updated.filter((id) => id !== "");
    const unique = new Set(filtered);

    if (filtered.length !== unique.size) {
      this.setState({ message: "⚠️ You cannot select the same nurse twice." });
      return;
    }

    this.setState({ selectedNurses: updated, message: "" });
  };

  handleBooking = async (e) => {
    e.preventDefault();
    const { doctor, selectedNurses } = this.state;
    const nurseIds = selectedNurses.filter((id) => id !== "");

    if (nurseIds.length === 0) {
      this.setState({ message: "⚠️ Please select at least one nurse." });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5078/api/booking/${doctor.doctorId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nurseIds),
        }
      );

      if (response.ok) {
        this.setState({
          message: "✅ Booking created successfully!",
          selectedNurses: ["", "", "", ""],
        });
        this.fetchAllNurses();
        this.fetchCurrentNurses();
      } else {
        const error = await response.text();
        this.setState({ message: `❌ Booking failed: ${error}` });
      }
    } catch (err) {
      console.error(err);
      this.setState({ message: "❌ Network error while creating booking." });
    }
  };

  handleDischarge = async (nurseId) => {
    try {
      const response = await fetch(
        `http://localhost:5078/api/booking/nurse/discharge/${nurseId}`,
        { method: "PUT" }
      );

      const result = await response.json();

      if (response.ok) {
        this.setState({ message: `✅ Nurse ${nurseId} discharged successfully` });
        this.fetchAllNurses();
        this.fetchCurrentNurses();
      } else {
        this.setState({
          message: `❌ Failed to discharge nurse. ${result.message || ""}`,
        });
      }
    } catch (err) {
      console.error("Discharge error:", err);
      this.setState({
        message: "❌ Network or server error while discharging nurse.",
      });
    }
  };

  render() {
    const {
      doctor,
      nurses,
      selectedNurses,
      fromDate,
      notes,
      message,
      currentNurses,
    } = this.state;
    if (!doctor) return null;

    return (
      <div style={styles.page}>
        {/* Navbar */}
        <div style={styles.navbar}>
          <div style={styles.navLeft}>
            🏥 <span style={styles.navTitle}>Hospital Dashboard</span>
          </div>
          <div style={styles.navRight}>
            <span style={styles.navEmail}>{doctor.email}</span>
            <button style={styles.logoutBtn} onClick={this.handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.contentWrapper}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <p style={styles.sidebarTitle}>Navigation</p>
            <div
              style={styles.navItem}
              onClick={() => this.props.navigate("/intro")}
            >
              🏠 Dashboard
            </div>
            <div
              style={{ ...styles.navItem, ...styles.activeNavItem }}
              onClick={() => window.location.reload()}
            >
              📅 Bookings
            </div>
            <div
              style={styles.navItem}
              onClick={() => this.props.navigate("/history")}
            >
              📜 History
            </div>
            <div
              style={{ ...styles.navItem, color: "#f05454" }}
              onClick={this.handleLogout}
            >
              🚪 Logout
            </div>
          </div>

          {/* Main Booking Card */}
          <div style={styles.mainContent}>
            <div style={styles.card}>
              <h2 style={styles.heading}>Book Nurses</h2>
              <form onSubmit={this.handleBooking} style={styles.form}>
                {[0, 1, 2, 3].map((i) => (
                  <select
                    key={i}
                    value={selectedNurses[i]}
                    onChange={(e) =>
                      this.handleSelectChange(i, e.target.value)
                    }
                    style={styles.input}
                  >
                    <option value="">Select Nurse {i + 1}</option>
                    {nurses.map((nurse) => (
                      <option key={nurse.nurseId} value={nurse.nurseId}>
                        {nurse.name}
                      </option>
                    ))}
                  </select>
                ))}

                <input
                  type="datetime-local"
                  value={fromDate}
                  onChange={(e) => this.setState({ fromDate: e.target.value })}
                  style={styles.input}
                  required
                />

                <textarea
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => this.setState({ notes: e.target.value })}
                  style={{ ...styles.input, height: "80px" }}
                />

                <button type="submit" style={styles.button}>
                  Book Nurse(s)
                </button>
              </form>

              {message && <p style={styles.message}>{message}</p>}

              {/* Current Nurses */}
              <h3 style={{ marginTop: "30px", color: "#2d5d8c" }}>
                Current Assigned Nurses
              </h3>
              {currentNurses.length === 0 ? (
                <p>No nurses currently assigned.</p>
              ) : (
                currentNurses.map((n) => (
                  <div key={n.nurseId} style={styles.currentItem}>
                    <span>
                      {n.name} (ID: {n.nurseId})
                    </span>
                    <button
                      style={styles.dischargeButton}
                      onClick={() => this.handleDischarge(n.nurseId)}
                    >
                      Discharge
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Segoe UI, sans-serif",
  },
  navbar: {
    height: "60px",
    backgroundColor: "#1a2a3a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    color: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  navLeft: { display: "flex", alignItems: "center", fontSize: "20px", fontWeight: "bold" },
  navTitle: { marginLeft: "8px" },
  navRight: { display: "flex", alignItems: "center", gap: "15px" },
  navEmail: { fontSize: "14px", opacity: 0.85 },
  logoutBtn: {
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#f05454",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.3s",
  },
  contentWrapper: { flex: 1, display: "flex", backgroundColor: "#f0f4f8" },
  sidebar: {
    width: "220px",
    backgroundColor: "#243447",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    boxShadow: "2px 0 6px rgba(0,0,0,0.15)",
  },
  sidebarTitle: {
    fontSize: "14px",
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: "10px",
    paddingLeft: "20px",
  },
  navItem: { padding: "12px 20px", cursor: "pointer", transition: "0.3s" },
  activeNavItem: { backgroundColor: "#2d5d8c" },
  mainContent: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  card: {
    width: "450px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    textAlign: "center",
    border: "1px solid #e0e6ed",
  },
  heading: { color: "#2d5d8c", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccd6e3",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    background: "#2d5d8c",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  message: { marginTop: "15px", color: "#2d5d8c", fontWeight: "bold" },
  currentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fbff",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "10px",
    border: "1px solid #d0e3f0",
  },
  dischargeButton: {
    padding: "5px 10px",
    background: "#f05454",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default withRouter(BookingPage);
