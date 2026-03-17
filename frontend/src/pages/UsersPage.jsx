import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

export default function UsersPage() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u.user_id}>
                            <td className="p-2">{u.user_id}</td>
                            <td className="p-2">{u.user_name}</td>
                            <td className="p-2">{u.user_email}</td>
                            <td className="p-2">{u.user_role}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}