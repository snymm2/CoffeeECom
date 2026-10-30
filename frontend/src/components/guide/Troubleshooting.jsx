import { Table } from "react-bootstrap";

export default function Troubleshooting({ items }) {
    return (
    <section className="brew-section">
        <div className="brew-section__heading">
            <span className="brew-eyebrow">
                Make adjustments
            </span>
            <h2>Troubleshooting</h2>
            <p>
                Use these as starting points. 
                Change one variable at a time and taste the difference.
            </p>
        </div>

        <div className="table-responsive brew-troubleshooting">
            <Table hover className="align-middle mb-0">
                <thead>
                    <tr>
                        <th>What you notice</th>
                        <th>What to try</th>
                    </tr>
                </thead>
                
                <tbody>
                    {items.map(([problem, solution]) => 
                    <tr key={problem}>
                        <th scope="row">{problem}</th>
                        <td>{solution}</td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
        
    </section>
    );
}
