import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { amount, tax, productName, buyerName, cnp, gender } = req.body;

  if (![amount, tax, productName, buyerName, cnp, gender].every(value => value)) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!/^\d{13}$/.test(cnp)) {
    return res.status(400).json({ message: 'CNP must be a 13-digit number.' });
  }

  try {
    const tva = (amount * (tax / 100));
    const total = amount + tva;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontSize = 12;

    const text = `
      Order Details:
      -------------------------
      Product Name: ${productName}
      Buyer Name: ${buyerName}
      CNP: ${cnp}
      Gender: ${gender.toUpperCase()}
      -------------------------
      Amount: ${amount.toFixed(2)} RON
      VAT (${tax}%): ${tva.toFixed(2)} RON
      Total: ${total.toFixed(2)} RON
    `;

    page.drawText(text, {
      x: 50,
      y: 350,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const xmlData = `
      <Order>
        <ProductName>${productName}</ProductName>
        <BuyerName>${buyerName}</BuyerName>
        <CNP>${cnp}</CNP>
        <Gender>${gender.toUpperCase()}</Gender>
        <Amount>${amount.toFixed(2)}</Amount>
        <Tax>${tax.toFixed(2)}</Tax>
        <VAT>${tva.toFixed(2)}</VAT>
        <Total>${total.toFixed(2)}</Total>
      </Order>
    `.trim();

    const order = await prisma.order.create({
      data: {
        amount,
        tax,
        total,
        productName,
        buyerName,
        cnp,
        gender,
        xmlData,
      },
    });

    console.log('Order saved to the database:', order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="order.pdf"');
    
    res.status(200).send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
