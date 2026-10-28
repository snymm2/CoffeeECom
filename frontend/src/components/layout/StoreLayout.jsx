import { Outlet } from "react-router";
import SiteNavbar from "./SiteNavbar";
import SiteFooter from "./SiteFooter";

function StoreLayout() {
    return (
    <div className="store-layout">
        <SiteNavbar />
        <main className="store-main">
            <Outlet />
        </main>
        <SiteFooter />
    </div>
    )
}

export default StoreLayout;