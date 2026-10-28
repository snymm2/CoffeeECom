import { Outlet } from "react-router";

function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}