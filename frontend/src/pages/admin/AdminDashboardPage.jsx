import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Dropdown, Form, InputGroup, Modal, Pagination, Row, Spinner, Table } from "react-bootstrap";
import { FiCoffee, FiEdit2, FiLogOut, FiPackage, FiPlus, FiRefreshCw, FiSearch, FiSlash, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router";

import { authApi, productsApi } from "../../services/authService";
import { ProductFormModal } from "../../components/admin/ProductFormModal";
import { resolveProductImageUrl } from "../../helpers/ResolveImageUrl";

import "./admin.css";

const PAGE_SIZE = 8;

const idOf = p => p?._id ?? p?.id;

const parseProducts = d => 
    Array.isArray(d) 
        ? d
        : Array.isArray(d?.products)
            ? d.products
            : Array.isArray(d?.data)
                ? d.data
                : [];


const formattedPrice = price => new Intl.NumberFormat("en-NP", {
    currency: "NPR",
    style: "currency",
    maximumFractionDigits: 2
}).format(Number(price || 0));

export function AdminDashboardPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");

    const [notice, setNotice] = useState(null)
    const [query, setQuery] = useState("")
    const [category, setCategory] = useState("all")
    const [status, setStatus] = useState("all")
    const [page, setPage] = useState(1);

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [busyDelete, setBusyDelete] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false);

    const navigate = useNavigate();

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            setProducts(parseProducts(await productsApi.list()));
        } catch (err) {
            if (err.status === 401 || err.status === 403) {
                navigate("/admin/login", { replace: true });
            } else {
                setError(err.message || "Could not Load Products.");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => { setPage(1); }, [query, category, status]);

    const filtered = useMemo(() => products.filter(p => {
        const q = query.trim().toLowerCase();
        const textMatch = !q || [p.name, p.sku, p.brand, p.type].some(v => String(v || "").toLowerCase().includes(q));
        return textMatch && (category === "all" || p.category === category) && (status === "all" || (status === "active" ? p.isActive !== false : p.isActive === false));
    }), [products, query, category, status]);

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const active = products.filter(p => p.isActive !== false).length;
    const low = products.filter(p => Number(p.stock ?? 0) <= 5).length;

    async function save(payload) {
        setSaving(true);
        setNotice(null);

        try {
            if (editing) {
                await productsApi.update(idOf(editing), payload);
            } else {
                await productsApi.create(payload);
            }

            setFormOpen(false);
            setEditing(null);
            setNotice({ type: "success", text: editing ? "Product updated." : "Product created." });

            await load();
        } finally { setSaving(false); }
    }

    async function toggle(p) {
        try {
            await productsApi.setActive(idOf(p), p.isActive === false);
            setNotice({ type: "success", text: p.isActive === false ? "Product activated." : "Product deactivated." });
            await load();
        } catch (e) {
            setNotice({ type: "danger", text: e.message || "Could not update status." });
        }
    }

    async function remove() {
        setBusyDelete(true);
        try {
            await productsApi.remove(idOf(deleting));
            setDeleting(null);
            setNotice({ type: "success", text: "Product deleted." });

            await load();
        } catch (e) {
            setNotice({ type: "danger", text: e.message || "Could not delete product." });
        } finally {
            setBusyDelete(false);
        }
    }

    async function logout() {
        setLoggingOut(true);
        try {
            await authApi.logout();
        } finally {
            navigate("/admin/login", { replace: true });
            setLoggingOut(false);
        }
    }

    console.log()

    return (
    <div className="admin-shell">
        <aside className="admin-sidebar">
            <a
                className="sidebar-brand"
                href="/admin"
                onClick={e => { e.preventDefault(); navigate("/admin"); }}>

                <span className="brand-icon"><FiCoffee /></span>
                <span>Code-n-Coffee<small>ADMIN WORKSPACE</small></span>
            </a>
            <div className="side-label">MANAGEMENT</div>
            <div className="side-link active"><FiPackage /> Products</div>
            <div className="sidebar-tip">
                <FiCoffee />
                <strong>From farm to cup.</strong>
                <p>Keep every product story and stock count up to date.</p>
            </div>
            <div className="sidebar-user">
                <span className="avatar">A</span>
                <span><b>Administrator</b><small>Store manager</small></span>
                <Button
                    variant="link"
                    onClick={logout}
                    disabled={loggingOut}
                    aria-label="Log out">
                    <FiLogOut />
                </Button>
            </div>
        </aside>

        <main className="admin-main">
            <header className="topbar">
                <span className="muted">
                    Admin <span className="crumb">/</span>
                    <b>Products</b>
                </span>

                <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={logout}
                    disabled={loggingOut}>

                    <FiLogOut className="me-2" />
                    {loggingOut ? "Signing out…" : "Log out"}
                </Button>
            </header>

            <Container fluid className="admin-content">
                <div className="page-heading">
                    <div>
                        <span className="eyebrow">YOUR CATALOGUE</span>
                        <h1>Product management</h1>
                        <p>Manage products, pricing, and inventory in one place.</p>
                    </div>

                    <Button
                        className="coffee-button"
                        onClick={() => { setEditing(null); setFormOpen(true); }}>

                        <FiPlus className="me-2" />
                        Add product
                    </Button>
                </div>

                {notice &&
                    <Alert
                        variant={notice.type}
                        dismissible
                        onClose={() => setNotice(null)}>{notice.text}</Alert>}

                {error &&
                    <Alert
                        variant="danger"
                        dismissible
                        onClose={() => setError("")}>{error}

                        <Button
                            variant="link"
                            onClick={load}>Try again
                        </Button>
                    </Alert>}

                <Row className="g-3 mb-4">
                    <Col sm={6} xl={4}>
                        <Card className="stat-card">
                            <Card.Body>
                                <span>Total products</span>
                                <strong>{products.length}</strong>
                                <small>Across the full catalogue</small>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={6} xl={4}>
                        <Card className="stat-card">
                            <Card.Body>
                                <span>Active products</span>
                                <strong>{active}</strong>
                                <small>Visible to customers</small>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={6} xl={4}>
                        <Card className="stat-card">
                            <Card.Body>
                                <span>Low stock (5 or fewer)</span>
                                <strong>{low}</strong>
                                <small>Products needing attention</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card className="catalogue-card">
                    <div className="catalogue-heading">
                        <div>
                            <h2>All products</h2>
                            <p>Search and update your product listings.</p>
                        </div>

                        <Button
                            variant="outline-secondary"
                            size="sm" onClick={load}
                            disabled={loading}>

                            <FiRefreshCw className={loading ? "spin" : ""} />
                            Refresh
                        </Button
                        ></div>

                    <div className="filters">
                        <InputGroup>
                            <InputGroup.Text><FiSearch /></InputGroup.Text>
                            <Form.Control
                                aria-label="Search products"
                                placeholder="Search name, SKU, brand…"
                                value={query}
                                onChange={e => setQuery(e.target.value)} />
                        </InputGroup>

                        <Form.Select
                            aria-label="Category filter"
                            value={category}
                            onChange={e => setCategory(e.target.value)}>

                            <option value="all">All categories</option>
                            <option value="coffee">Coffee</option>
                            <option value="equipment">Equipment</option>
                            <option value="merch">Merchandise</option>
                        </Form.Select>

                        <Form.Select
                            aria-label="Status filter"
                            value={status}
                            onChange={e => setStatus(e.target.value)}>

                            <option value="all">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </div>

                    <div className="table-responsive">
                        <Table hover className="products-table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading
                                    ? <tr>
                                        <td
                                            colSpan="7"
                                            className="table-state">
                                            <Spinner size="sm" className="me-2" />Loading products…
                                        </td>
                                    </tr>
                                    : visible.length === 0
                                        ? <tr>
                                            <td
                                                colSpan="7"
                                                className="table-state">

                                                <FiPackage />
                                                <b>No products found</b>
                                                <span>Try changing your filters or add a product.</span>
                                            </td>
                                        </tr>
                                        : visible.map(p =>
                                            <tr key={String(idOf(p))}>
                                                <td>
                                                    <div className="product-name">
                                                        <span className="product-thumb">
                                                            {p.imageUrl
                                                                ? <img
                                                                    src={resolveProductImageUrl(p.imageUrl)}
                                                                    alt=""
                                                                    onError={e => { e.currentTarget.style.display = "none"; }} />
                                                                : <FiCoffee />}
                                                        </span>
                                                        <span>
                                                            <b>{p.name || "Untitled product"}</b>
                                                            <small>
                                                                {p.brand || "No brand"}
                                                                {p.isFeatured ? " · Featured" : ""}
                                                            </small>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <code>{p.sku || "—"}</code>
                                                </td>
                                                <td>
                                                    <span className="category-pill">
                                                        {p.category || "—"}</span>
                                                </td>
                                                <td>
                                                    <b>{formattedPrice(p.price)}</b>
                                                </td>
                                                <td>
                                                    <span className={Number(p.stock ?? 0) <= 5 ? "low-stock" : ""}>{p.stock ?? 0}</span>
                                                </td>
                                                <td>
                                                    <Badge pill bg={p.isActive === false ? "secondary" : "success"}>
                                                        {p.isActive === false ? "Inactive" : "Active"}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <div className="actions">
                                                        <Button
                                                            size="sm"
                                                            variant="light"
                                                            aria-label={`Edit ${p.name}`}
                                                            onClick={() => { setEditing(p); setFormOpen(true); }}>
                                                            <FiEdit2 />
                                                        </Button>

                                                        <Dropdown align="end">
                                                            <Dropdown.Toggle
                                                                size="sm"
                                                                variant="light"
                                                                className="more-toggle"
                                                                aria-label={`More actions for ${p.name}`}>
                                                                •••
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={() => toggle(p)}>
                                                                    <FiSlash className="me-2" />
                                                                    {p.isActive === false ? "Activate" : "Deactivate"}
                                                                </Dropdown.Item>

                                                                <Dropdown.Divider />

                                                                <Dropdown.Item
                                                                    className="text-danger"
                                                                    onClick={() => setDeleting(p)}>
                                                                    <FiTrash2 className="me-2" />Delete
                                                                </Dropdown.Item>

                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="table-footer">
                        <span>
                            Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}
                            –
                            {Math.min(page * PAGE_SIZE, filtered.length)}
                            of {filtered.length} products
                        </span>

                        <Pagination className="mb-0">
                            <Pagination.Prev
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))} />

                            {Array.from({ length: pages }, (_, i) => i + 1).map(n =>
                                <Pagination.Item
                                    key={n}
                                    active={n === page}
                                    onClick={() => setPage(n)}>{n}
                                </Pagination.Item>)}

                            <Pagination.Next
                                disabled={page === pages}
                                onClick={() => setPage(p => Math.min(pages, p + 1))} />
                        </Pagination>
                    </div>

                </Card>
            </Container>
        </main>

        <ProductFormModal
            show={formOpen}
            product={editing}
            saving={saving}
            onHide={() => { if (!saving) { setFormOpen(false); setEditing(null); } }}
            onSave={save} />

        <Modal
            show={!!deleting}
            onHide={() => !busyDelete && setDeleting(null)}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>Delete product?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Delete <b>{deleting?.name}</b>?
                </p>
                <p className="muted small mb-0">
                    This cannot be undone.
                    If orders reference this product,
                    consider deactivating it instead.
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={() => setDeleting(null)}
                    disabled={busyDelete}>Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={remove}
                    disabled={busyDelete}>

                    {busyDelete
                        ? <><Spinner size="sm" className="me-2" />Deleting…</>
                        : "Delete product"}
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
    )
}
    
    
