import { useState } from 'react';

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [tax, setTax] = useState(19);
  const [total, setTotal] = useState(0);
  const [productName, setProductName] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [cnp, setCnp] = useState('');
  const [gender, setGender] = useState('m');

  const calculateTotal = () => {
    const calculatedTotal = parseFloat(amount) + (parseFloat(amount) * (parseFloat(tax) / 100));
    setTotal(isNaN(calculatedTotal) ? 0 : calculatedTotal);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateTotal();

    const data = {
      amount: parseFloat(amount),
      tax: parseFloat(tax),
      total: parseFloat(total),
      productName,
      buyerName,
      cnp,
      gender
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'order.pdf'); // Numele fișierului PDF
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        alert('Formularul a fost trimis și PDF-ul a fost generat cu succes!');
      } else {
        const errorData = await response.json();
        alert('Eroare la trimiterea formularului: ' + errorData.message);
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('A apărut o eroare la trimiterea formularului.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Formular Electronic</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Buyer Name:</label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>CNP:</label>
          <input
            type="text"
            value={cnp}
            onChange={(e) => setCnp(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Sex (m/f):</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Suma:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>TVA (%):</label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button type="button" onClick={calculateTotal} style={{ padding: '10px', width: '100%' }}>
            Calculate Total
          </button>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Total:</strong> {total.toFixed(2)} RON</p>
        </div>
        <button type="submit" style={{ padding: '10px', width: '100%' }}>Submit</button>
      </form>
    </div>
  );
}
