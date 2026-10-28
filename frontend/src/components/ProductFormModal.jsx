import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";

const emptyProduct = {
    sku: "",
    name: "",
    brand: "",
    category: "",
    type: "", 
    price: "", 
    discountPercent: 0, 
    imageUrl: "", 
    stock: 0, 
    isFeatured: false, 
    isActive: true, 
    coffeeType: "", 
    roastLevel: "", 
    origin: "", 
    tastingNotes: "", 
    grind: ""
}

const details = {
    coffee: [
        { k: "coffeeType", l: "Coffee type", p: "Arabica" }, 
        { k: "roastLevel", l: "Roast level", select: ["Light", "Medium", "Medium-Dark", "Dark"] }, 
        { k: "origin", l: "Origin", p: "Lamjung, Nepal" }, 
        { k: "tastingNotes", l: "Tasting notes", p: "Floral, citrus, chocolate" }, 
        { k: "grind", l: "Grind option", p: "Whole bean / Ground" }
    ],
    equipment: [
        { k: "material", l: "Material", p: "Stainless steel, glass" }, 
        { k: "capacity", l: "Capacity", p: "1000 ml" }, 
        { k: "power", l: "Power", p: "1500 W" }],

    merch: [
        { k: "size", l: "Size", p: "M, L, XL" }, 
        { k: "color", l: "Color", p: "Earth brown" }, 
        { k: "material", l: "Material", p: "Cotton" }],
};

export function ProductFormModal({show, product, saving, onHide, onSave}) {
    const [form, setForm] = useState(blank); 
    const [error, setError] = useState("");

    useEffect(() => { 
        if (show) { 
            setError(""); 
            setForm(product 
                ? { ...blank, ...product, price: product.price ?? "", stock: product.stock ?? 0, discountPercent: product.discountPercent ?? 0 } 
                : { ...blank }); 
        } 
    }, [show, product]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    async function submit(e) {
        e.preventDefault(); 
        setError("");

        const price = Number(form.price)
        const stock = Number(form.stock)
        const discountPercent = Number(form.discountPercent);

        if (!form.sku.trim() || !form.name.trim()) return setError("SKU and product name are required.");

        if (!Number.isFinite(price) || price < 0) return setError("Enter a valid non-negative price.");

        if (!Number.isSafeInteger(stock) || stock < 0) return setError("Stock must be a non-negative whole number.");

        if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 1) return setError("Discount must be between 0 and 1 (0.1 = 10%).");

        const payload = { 
            ...form, 
            sku: form.sku.trim(), 
            name: form.name.trim(), 
            brand: form.brand.trim(), 
            type: form.type.trim(), 
            price, 
            stock, 
            discountPercent, 
            isFeatured: Boolean(form.isFeatured), 
            isActive: Boolean(form.isActive) 
        };

        try { 
            await onSave(payload); 
        } catch (err) { 
            setError(err.message || "Unable to save product."); 
        }
    }

    return (
    <Modal 
        show={show} 
        onHide={onHide} 
        size="lg" 
        centered 
        scrollable>

        <Form onSubmit={submit}>
            <Modal.Header closeButton={!saving}>
                <div>
                    <span className="eyebrow">
                        {product ? "UPDATE CATALOGUE" : "GROW YOUR CATALOGUE"}
                    </span>
                    
                    <Modal.Title>
                        {product ? "Edit product" : "Add a product"}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Modal.Body>
                {error && 
                    <Alert variant="danger">{error}</Alert>}

                <h6 className="form-section">Basic information</h6>

                <Row className="g-3">
                    <Col md={6}>
                        <Form.Label>SKU *</Form.Label>
                        <Form.Control 
                            value={form.sku} 
                            onChange={e => set("sku", e.target.value)} 
                            maxLength={80} 
                            required 
                            disabled={saving} />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Product name *</Form.Label>
                        <Form.Control 
                            value={form.name} 
                            onChange={e => set("name", e.target.value)} 
                            maxLength={180} 
                            required 
                            disabled={saving} />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control 
                            value={form.brand} 
                            onChange={e => set("brand", e.target.value)} 
                            disabled={saving} />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Category</Form.Label>
                        <Form.Select 
                            value={form.category} 
                            onChange={e => set("category", e.target.value)} 
                            disabled={saving}>

                            <option value="coffee">Coffee</option>
                            <option value="equipment">Equipment</option>
                            <option value="merch">Merchandise</option>
                        </Form.Select>
                    </Col>

                    <Col md={6}>
                        <Form.Label>Product type</Form.Label>
                        <Form.Control 
                            value={form.type} 
                            onChange={e => set("type", e.target.value)} 
                            placeholder="Coffee Beans, Grinder…" 
                            disabled={saving} />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Image URL / path</Form.Label>
                        <Form.Control value={form.imageUrl} 
                        onChange={e => set("imageUrl", e.target.value)} 
                        placeholder="/storefront/product.jpg" 
                        disabled={saving} />
                        <Form.Text muted>
                            Use a path served by your storefront or a full URL.
                        </Form.Text>
                    </Col>
                </Row>

                <h6 className="form-section mt-4">Pricing & inventory</h6>

                <Row className="g-3">
                    <Col sm={4}>
                        <Form.Label>Price (NPR) *</Form.Label>
                        <Form.Control 
                            type="number" 
                            min="0" 
                            step=".01" 
                            value={form.price} 
                            onChange={e => set("price", e.target.value)} 
                            required 
                            disabled={saving} />
                    </Col>

                    <Col sm={4}>
                        <Form.Label>Discount (0–1)</Form.Label>
                        <Form.Control 
                            type="number" 
                            min="0" 
                            max="1" 
                            step=".01" 
                            value={form.discountPercent} 
                            onChange={e => set("discountPercent", e.target.value)} 
                            disabled={saving} />
                        <Form.Text muted>0.1 = 10%</Form.Text>
                    </Col>

                    <Col sm={4}>
                        <Form.Label>Stock *</Form.Label>
                        <Form.Control 
                            type="number" 
                            min="0" 
                            step="1" 
                            value={form.stock} 
                            onChange={e => set("stock", e.target.value)} 
                            required 
                            disabled={saving} />
                    </Col>
                </Row>

                <h6 className="form-section mt-4">Category details</h6>
                <Row className="g-3">
                    {(details[form.category] || []).map(f => 
                    
                    <Col md={6} key={f.k}>
                        <Form.Label>{f.l}</Form.Label>
                        {f.select 
                            ?   <Form.Select 
                                    value={form[f.k] || ""} 
                                    onChange={e => set(f.k, e.target.value)} 
                                    disabled={saving}>
                                    
                                    <option value="">Select…</option>
                                    {f.select.map(o => <option key={o}>{o}</option>)}
                                </Form.Select> 

                            : <Form.Control 
                                value={form[f.k] || ""} 
                                onChange={e => set(f.k, e.target.value)} 
                                placeholder={f.p} 
                                disabled={saving} />}
                    </Col>)}
                </Row>

                <h6 className="form-section mt-4">Store display</h6>
                <Row>
                    <Col md={6}>
                        <Form.Check 
                            type="switch" 
                            label="Active and visible to customers" 
                            checked={!!form.isActive} 
                            onChange={e => set("isActive", e.target.checked)} 
                            disabled={saving} />
                    </Col>
                    
                    <Col md={6}>
                        <Form.Check 
                            type="switch" 
                            label="Featured product" 
                            checked={!!form.isFeatured} 
                            onChange={e => set("isFeatured", e.target.checked)} 
                            disabled={saving} />
                    </Col>
                </Row>
            </Modal.Body>
            
            <Modal.Footer>
                <Button 
                    variant="outline-secondary" 
                    onClick={onHide} 
                    disabled={saving}>
                        Cancel
                </Button>
                
                <Button 
                    className="coffee-button" 
                    type="submit" 
                    disabled={saving}>
                        
                        {saving 
                            ?   <><Spinner size="sm" className="me-2" />Saving…</> 
                            : product ? "Save changes" : "Create product"}
                </Button>
            </Modal.Footer>

        </Form>
    </Modal>
    )
}