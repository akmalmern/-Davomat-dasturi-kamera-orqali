const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const smenaRoutes = require('./routes/smenaRoutes');
const davomatRoutes = require('./routes/davomatRoutes');
const { loadModels } = require('./utils/face.utils');
const cors = require('cors');
// middl
app.use(
	cors({
		origin: 'http://localhost:5173', // Frontend manzili
		credentials: true, // Cookie’lar uchun
	})
);
connectDB();
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ------------------------
app.use('/api/smena', smenaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/davomat', davomatRoutes);
app.use(errorHandler);
const port = process.env.PORT || 5000;

app.listen(port, async () => {
	await loadModels();
	console.log(`${port}-portda ishladi`);
});
