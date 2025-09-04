import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3001;
const DOCUMENSO_API_URL = process.env.DOCUMENSO_API_URL;
const DOCUMENSO_API_KEY = process.env.DOCUMENSO_API_KEY;
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_BUCKET = process.env.S3_BUCKET;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const S3_REGION = process.env.S3_REGION || 'us-east-1';
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL; // e.g. http://localhost:9000

// Helper to generate a unique filename
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// --- INITIALIZATION ---
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// S3 Client Setup for MinIO
const s3Client = new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
    },
    forcePathStyle: true, // Required for MinIO
});

// Documenso Axios instance for API calls
const documensoApi = axios.create({
    baseURL: DOCUMENSO_API_URL,
    headers: {
        'X-API-KEY': DOCUMENSO_API_KEY,
        'Content-Type': 'application/json',
    },
});

// --- MIDDLEWARE ---
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend dev server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API ROUTE ---
app.post('/api/create-document', upload.single('document'), async (req, res) => {
    console.log('Received request to create document...');

    try {
        const { signer1Name, signer1Email, signer2Name, signer2Email } = req.body;
        const documentFile = req.file;

        if (!documentFile) {
            return res.status(400).json({ error: 'Document file is required.' });
        }

        const requiredEnv = {
            DOCUMENSO_API_URL,
            DOCUMENSO_API_KEY,
            S3_ENDPOINT,
            S3_BUCKET,
            S3_ACCESS_KEY,
            S3_SECRET_KEY,
            MINIO_PUBLIC_URL,
        };
        const missingEnv = Object.entries(requiredEnv)
            .filter(([, value]) => !value)
            .map(([key]) => key);

        if (missingEnv.length) {
            const message = `Missing environment variables: ${missingEnv.join(', ')}`;
            console.error(message);
            return res.status(500).json({ error: message });
        }

        // 1. Upload file to MinIO (S3)
        const fileName = generateFileName() + path.extname(documentFile.originalname);
        const putObjectParams = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Body: documentFile.buffer,
            ContentType: documentFile.mimetype,
        };

        console.log(`Uploading ${fileName} to bucket ${S3_BUCKET}...`);
        await s3Client.send(new PutObjectCommand(putObjectParams));
        const documentUrl = `${MINIO_PUBLIC_URL}/${S3_BUCKET}/${fileName}`;
        console.log(`File uploaded successfully. URL: ${documentUrl}`);

        // 2. Create Document in Documenso
        console.log('Creating document in Documenso...');
        const createDocResponse = await documensoApi.post('/api/v1/documents', {
            document_path: documentUrl,
            name: `PoC - ${documentFile.originalname}`,
        });
        const { id: documentId } = createDocResponse.data;
        console.log(`Documenso document created with ID: ${documentId}`);
        
        // 3. Add Recipients to the Document
        console.log('Adding recipients...');
        const recipients = [
            { name: signer1Name, email: signer1Email },
            { name: signer2Name, email: signer2Email },
        ];

        const recipientPromises = recipients.map(recipient =>
            documensoApi.post(`/api/v1/documents/${documentId}/recipients`, {
                name: recipient.name,
                email: recipient.email,
            })
        );
        const recipientResponses = await Promise.all(recipientPromises);
        const createdRecipients = recipientResponses.map(r => r.data);
        const primaryRecipientId = createdRecipients[0].id; // Get the ID of the first signer
        console.log(`Added ${createdRecipients.length} recipients. Primary recipient ID: ${primaryRecipientId}`);


        // 4. Send the document for signing
        console.log('Sending document for signing...');
        await documensoApi.post(`/api/v1/documents/${documentId}/send`);
        console.log('Document sent.');

        // 5. Generate a signing token for the primary recipient
        console.log('Generating signing token for primary recipient...');
        const tokenResponse = await documensoApi.post(`/api/v1/recipients/${primaryRecipientId}/token`);
        const { token } = tokenResponse.data;
        console.log('Token generated successfully.');
        
        // 6. Send token back to the frontend
        res.json({ token });

    } catch (error) {
        console.error('An error occurred during the process:');
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            return res.status(500).json({ error: 'An API error occurred.', details: error.response.data });
        } else if (error.request) {
            console.error('Request:', error.request);
            return res.status(500).json({ error: 'The request was made but no response was received.' });
        } else {
            console.error('Error', error.message || error);
            return res.status(500).json({ error: 'An unexpected error occurred.', details: error.message || String(error) });
        }
    }
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log('Ensure your Documenso and MinIO instances are running.');
});
