import { Contact, User } from "types/auth";
import { useState, useEffect } from "react";
import api from "../../../utils/axios";

type SellerDashboardProps = {
  user: User;
};

export const SellerDashboard = ({ user }: SellerDashboardProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        <span className="text-gray-700">Welcome, {user?.name}</span>
      </h2>
      <p className="text-gray-600 mb-6">
        Welcome to your seller dashboard. Here you can manage your products and
        view customer inquiries.
      </p>
    </div>
  );
};
