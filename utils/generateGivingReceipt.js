import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';

const API_URL = 'https://content.lifereachchurch.org';

async function loadImageToBase64(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

export async function generateGivingReceipt({
                                                tx_ref,
                                                amount,
                                                currency = 'ZMW',
                                                customer, // { name, phone, email }
                                                category, // Tithe, Seed, etc.
                                                meta = {}
                                            }) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const width = doc.internal.pageSize.width;
    const height = doc.internal.pageSize.height;
    const margin = 40;

    // --- LIFE REACH BRAND COLORS ---
    const colorPrimary = [234, 88, 12]; // Orange-600 (#ea580c)
    const colorSecondary = [17, 24, 39]; // Dark Gray/Black (#111827)
    const colorLight = [156, 163, 175];  // Gray-400

    let y = 50;

    // --- LOGO & HEADER ---
    const logoBase64 = await loadImageToBase64('/logo.png');
    if (logoBase64) {
        doc.addImage(logoBase64, 'JPEG', margin, 40, 60, 60);
    }

    doc.setFontSize(22).setTextColor(...colorPrimary).setFont("helvetica", "bold");
    doc.text('DONATION RECEIPT', width - margin, 60, { align: 'right' });

    doc.setFontSize(10).setTextColor(...colorSecondary).setFont("helvetica", "bold");
    doc.text(`[ OFFICIAL RECORD ]`, width - margin, 80, { align: 'right' });

    doc.setFontSize(9).setTextColor(...colorLight).setFont("helvetica", "normal");
    doc.text(`Ref: ${tx_ref}`, width - margin, 95, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, width - margin, 108, { align: 'right' });

    y = 140;
    doc.setDrawColor(243, 244, 246);
    doc.line(margin, y, width - margin, y);
    y += 30;

    // --- GIVER & FUND INFO ---
    doc.setFontSize(8).setTextColor(...colorLight).setFont("helvetica", "bold");
    doc.text('BILLED TO', margin, y);
    doc.text('GIVING DETAILS', margin + 250, y);
    y += 15;

    doc.setFontSize(10).setTextColor(...colorSecondary).setFont("helvetica", "normal");
    doc.text(customer.name || 'Anonymous Giver', margin, y);
    doc.text(customer.phone || '', margin, y + 14);
    doc.text(customer.email || '', margin, y + 28);

    doc.text(`Fund: ${category}`, margin + 250, y);
    doc.text(`Method: ${meta.method || 'Online'}`, margin + 250, y + 14);
    doc.text(`Status: Completed`, margin + 250, y + 28);

    y += 70;

    // --- TABLE SECTION ---
    doc.setFillColor(...colorSecondary);
    doc.rect(margin, y, width - (margin * 2), 30, 'F');

    doc.setFontSize(9).setTextColor(255, 255, 255).setFont("helvetica", "bold");
    doc.text('DESCRIPTION', margin + 15, y + 19);
    doc.text('AMOUNT', width - margin - 15, y + 19, { align: 'right' });

    y += 30;
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, y, width - (margin * 2), 40, 'F');

    doc.setTextColor(...colorSecondary).setFont("helvetica", "bold");
    doc.text(`${category} Contribution`, margin + 15, y + 24);
    doc.setFontSize(12).setTextColor(...colorPrimary);
    doc.text(`${currency} ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, width - margin - 15, y + 24, { align: 'right' });

    // --- FOOTER SECTION ---
    const footerY = height - 100;
    const qrDataUrl = await QRCode.toDataURL(`https://lifereach.org/verify?ref=${tx_ref}`);
    doc.addImage(qrDataUrl, 'PNG', margin, footerY, 60, 60);

    doc.setFontSize(11).setTextColor(...colorSecondary).setFont("helvetica", "bold");
    doc.text('LIFE REACH CHURCH', margin + 70, footerY + 20);

    doc.setFontSize(8).setTextColor(...colorLight).setFont("helvetica", "normal");
    doc.text('Lusaka, Zambia | +260 972 338 115', margin + 70, footerY + 35);
    doc.text('Thank you for your generosity. Your giving reaches souls.', margin + 70, footerY + 48);

    // --- OUTPUT & UPLOAD ---
    doc.autoPrint();
    const localBlobUrl = doc.output('bloburl');
    window.open(localBlobUrl, '_blank');

    // Background Process
    await (async () => {
        try {
            const pdfBase64 = doc.output('datauristring').split(',')[1];

            // 1. Save to your local Church API
            await axios.post(`${API_URL}/giving/upload_receipt.php`, {
                reference: tx_ref,
                pdf_base64: pdfBase64,
                email: customer.email,
                name: customer.name
            });

            // 2. WhatsApp Prompt
            const message = `Shalom ${customer.name}, your giving of ${currency} ${amount} has been received. Download receipt: ${API_URL}/uploads/receipts/receipt_${tx_ref}.pdf`;
            const waLink = `https://wa.me/${customer.phone?.replace('+', '')}?text=${encodeURIComponent(message)}`;

            toast.success("Receipt generated and sent!", {
                icon: '🙌',
                duration: 5000
            });

            // Optional: WhatsApp Trigger like your code
        } catch (e) {
            console.error("Upload failed", e);
        }
    })();

    return { success: true, url: localBlobUrl };
}