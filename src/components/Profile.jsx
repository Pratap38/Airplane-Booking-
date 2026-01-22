    import React, { useEffect, useState } from "react";
    import api from "../api/api";

    const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
        const token = localStorage.getItem("access");
        if (!token) return;

        try {
            const res = await api.get("/auth/profile/", {
            headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
        };

        fetchProfile();
    }, []);

    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
    };

    export default Profile;
