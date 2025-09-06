import React, { useEffect, useState } from "react";
import axios from "axios";

const Flights = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // নতুন অ্যাকাউন্ট ফর্মের জন্য state
  const [newAccount, setNewAccount] = useState({
    username: "",
    formId: 1,
    form: "",
    inactive: false,
    offset: 0,
    entryId: "123",
    agentId: "456",
    gsaId: "789",
    gsa: "",
    date: new Date().toISOString(),
  });

  // ✅ GET request - সব account list আনা
  useEffect(() => {
    axios
      .get("https://ota-api.a4aero.com/api/accounts/list")
      .then((res) => {
        console.log("Accounts List:", res.data);
        setAccounts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching accounts:", err);
        setLoading(false);
      });
  }, []);

  // ✅ POST request - নতুন account save করা
  const handleSaveAccount = (e) => {
    e.preventDefault();

    axios
      .post("https://ota-api.a4aero.com/api/accounts/save", newAccount)
      .then((res) => {
        console.log("Account Saved:", res.data);
        setAccounts((prev) => [...prev, res.data]); // নতুন অ্যাকাউন্ট লিস্টে যোগ হবে
        // ফর্ম reset
        setNewAccount({
          username: "",
          formId: 1,
          form: "",
          inactive: false,
          offset: 0,
          entryId: "123",
          agentId: "456",
          gsaId: "789",
          gsa: "",
          date: new Date().toISOString(),
        });
      })
      .catch((err) => {
        console.error("Error saving account:", err);
      });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Accounts List</h2>
      <ul className="space-y-2 mb-6">
        {accounts.map((acc, index) => (
          <li
            key={index}
            className="p-3 border rounded-md shadow-sm bg-gray-50"
          >
            👤 Username: {acc.username || "N/A"} <br />
            📄 Form: {acc.form || "N/A"}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-2">➕ Add New Account</h2>
      <form onSubmit={handleSaveAccount} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={newAccount.username}
          onChange={(e) =>
            setNewAccount({ ...newAccount, username: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="text"
          placeholder="Form Name"
          value={newAccount.form}
          onChange={(e) =>
            setNewAccount({ ...newAccount, form: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="text"
          placeholder="GSA Name"
          value={newAccount.gsa}
          onChange={(e) =>
            setNewAccount({ ...newAccount, gsa: e.target.value })
          }
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
        >
          Save Account
        </button>
      </form>
    </div>
  );
};

export default Flights;
