import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 image uploads
app.use(express.json({ limit: "25mb" }));

// Lazy initialize Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Image Analysis endpoint
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64, imageUrl, mimeType = "image/png", fileName } = req.body;

    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ error: "No image payload provided" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.warn("GEMINI_API_KEY not configured, returning fallback mock response.");
      return res.json(getFallbackScanResponse(fileName || "Scanned Document", imageUrl));
    }

    // Build parts for Gemini API
    const parts: any[] = [];

    if (imageBase64) {
      // strip data:image/...;base64, prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: cleanBase64,
        },
      });
    }

    const promptText = `
You are SnapAction AI, an advanced document OCR and action extraction system.
Analyze the provided image carefully and extract all text, key details, and actionable items.

Classify the document into one of these types:
- 'receipt': Expenses, store receipts, invoices with items and total.
- 'whiteboard': Meeting notes, diagrams, brainstorming session action items.
- 'business_card': Contact cards, name, email, phone, company.
- 'invoice': Payments due, bill statements, freelancer invoices.
- 'document': Mixed documents, flyers, delivery slips, workshop announcements.
- 'other': General images.

Identify and extract ALL actionable items, categorized as:
1. 'event': Calendar invites, workshops, meetings (extract date, time, location).
2. 'delivery': Package tracking slips, shipping confirmations (extract tracking number, carrier, est delivery date, delivery status).
3. 'payment': Invoices, bills, totals (extract amount, vendor/client, due date, description).
4. 'contact': Business cards, personal contacts (extract name, role, company, email, phone).
5. 'task': Specific action items or to-dos found in text or whiteboards (extract priority, description, assignees).

Return a structured JSON object.
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentTitle: { type: Type.STRING, description: "Short descriptive title for the document (e.g. Grocery Receipt, Design Workshop Flyer)" },
            documentType: { type: Type.STRING, description: "receipt, whiteboard, business_card, invoice, document, or other" },
            summary: { type: Type.STRING, description: "Concise summary of findings (e.g. Extracted 3 action items including event and payment)" },
            extractedItemsCount: { type: Type.INTEGER, description: "Total number of actionable items extracted" },
            extractedText: { type: Type.STRING, description: "Full raw OCR text extracted from image" },
            statusBadge: { type: Type.STRING, description: "Status badge label e.g. PROCESSED or CONTACT ADDED" },
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "event, delivery, payment, contact, or task" },
                  title: { type: Type.STRING, description: "Action title (e.g. Design System Workshop, FedEx Priority Box, $450.00)" },
                  subtitle: { type: Type.STRING, description: "Action subtitle or category" },
                  statusBadge: { type: Type.STRING, description: "Status badge e.g. EVENT, In Transit, Due Soon, CONTACT ADDED, ACTION ITEM" },
                  primaryActionLabel: { type: Type.STRING, description: "Primary CTA e.g. Add to Calendar, Track Package, Copy Details, Save Contact" },
                  details: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      time: { type: Type.STRING },
                      location: { type: Type.STRING },
                      trackingNumber: { type: Type.STRING },
                      carrier: { type: Type.STRING },
                      estimatedDelivery: { type: Type.STRING },
                      deliveryStatus: { type: Type.STRING },
                      amount: { type: Type.STRING },
                      vendor: { type: Type.STRING },
                      dueDate: { type: Type.STRING },
                      description: { type: Type.STRING },
                      name: { type: Type.STRING },
                      email: { type: Type.STRING },
                      phone: { type: Type.STRING },
                      company: { type: Type.STRING },
                      role: { type: Type.STRING },
                      priority: { type: Type.STRING },
                    },
                  },
                },
                required: ["type", "title"],
              },
            },
          },
          required: ["documentTitle", "documentType", "summary", "actions"],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response from Gemini vision model");
    }

    const parsedData = JSON.parse(textOutput);

    // Add generated IDs
    const resultRecord = {
      id: "scan-" + Date.now(),
      documentTitle: parsedData.documentTitle || "Scanned Image",
      documentType: parsedData.documentType || "document",
      summary: parsedData.summary || "Document processed successfully.",
      extractedItemsCount: parsedData.extractedItemsCount || (parsedData.actions ? parsedData.actions.length : 0),
      extractedText: parsedData.extractedText || "",
      timestamp: "Just now",
      imageUrl: imageUrl || (imageBase64 ? `data:${mimeType};base64,${imageBase64.replace(/^data:image\/\w+;base64,/, "")}` : ""),
      statusBadge: parsedData.statusBadge || "PROCESSED",
      actions: (parsedData.actions || []).map((act: any, idx: number) => ({
        id: `act-${Date.now()}-${idx}`,
        type: act.type || "task",
        title: act.title || "Action Item",
        subtitle: act.subtitle || "",
        statusBadge: act.statusBadge || act.type?.toUpperCase() || "PROCESSED",
        primaryActionLabel: act.primaryActionLabel || "View Action",
        completed: false,
        details: act.details || {},
      })),
    };

    return res.json(resultRecord);
  } catch (err: any) {
    console.error("Error analyzing image with Gemini:", err);
    // If Gemini call fails, return error payload so client can trigger Screen 4 (Processing Failed View) or fallback
    return res.status(500).json({
      error: "Processing Failed",
      message: err?.message || "Could not process the image. Please ensure the image is clear and try again.",
    });
  }
});

function getFallbackScanResponse(title: string, imageUrl?: string) {
  return {
    id: "scan-" + Date.now(),
    documentTitle: title || "Desk Document Scan",
    documentType: "document",
    summary: "We found 3 actionable items from your image.",
    extractedItemsCount: 3,
    extractedText: "Design System Workshop Oct 24, 2023. FedEx tracking 1Z9999W99999999999. Invoice $450.00 Acme Corp LLC.",
    timestamp: "Just now",
    imageUrl: imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCGxTvg_cW97Bvo6hNvFkKTG6CDLf-mNkoL7ZvwTyjYqH80u5lU612RXKLApmbnND4FU4S-1kvsMv43Bt_vB1kCXYK-IBlzb2FvLeyEJw6ONaZQRfO0jgwghelVnRanm6mOUFJg-bZkWqFrBfI9rRrs6ka_YiEX0v9ifFwnxMFTSv2_9nyeXG7Na_FaeXrBPlpjQlhdCoF-nZ2oNMr1KY7AFGeoHnEdcgVx9hIJu6zTWaFrvNIZFCMqBw",
    statusBadge: "PROCESSED",
    actions: [
      {
        id: `act-${Date.now()}-1`,
        type: "event",
        title: "Design System Workshop",
        subtitle: "Workshop Event",
        statusBadge: "EVENT",
        primaryActionLabel: "Add to Calendar",
        completed: false,
        details: {
          date: "Oct 24, 2023",
          time: "2:00 PM - 4:00 PM",
          location: "Studio 4B, NY",
        },
      },
      {
        id: `act-${Date.now()}-2`,
        type: "delivery",
        title: "FedEx Priority Box",
        subtitle: "FedEx Tracking",
        statusBadge: "In Transit",
        primaryActionLabel: "Track Package",
        completed: false,
        details: {
          trackingNumber: "1Z9999W99999999999",
          carrier: "FedEx Ground",
          estimatedDelivery: "Est: Tomorrow by 8PM",
          deliveryStatus: "In Transit",
        },
      },
      {
        id: `act-${Date.now()}-3`,
        type: "payment",
        title: "$450.00",
        subtitle: "Freelance Design Services",
        statusBadge: "Due Soon",
        primaryActionLabel: "Copy Details",
        completed: false,
        details: {
          amount: "$450.00",
          vendor: "Acme Corp LLC",
          dueDate: "Due: Oct 20, 2023",
          description: "Freelance Design Services",
        },
      },
    ],
  };
}

async function startServer() {
  // Vite middleware for development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

//startServer();
if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;
