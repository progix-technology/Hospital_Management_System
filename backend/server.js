import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Connect to database
connectDB();

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Rate Limiters
import { 
  globalLimiter, 
  authLimiter, 
  contactLimiter, 
  appointmentLimiter 
} from './middleware/rateLimiter.js';

const app = express();

// Trust reverse proxy for accurate IP extraction (Render, Cloudflare, Nginx, etc.)
app.set('trust proxy', 1);

// Middleware with increased payload size limits for PDF base64 uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Apply Global Rate Limiting across all /api routes
app.use('/api', globalLimiter);

// Mount Routes with specific security limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/appointments', appointmentLimiter, appointmentRoutes);
app.use('/api/users', userRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
