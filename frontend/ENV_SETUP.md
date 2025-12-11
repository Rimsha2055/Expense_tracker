# Environment Configuration Guide

## MongoDB FLE API URL Configuration

Har environment ke liye MongoDB FLE API URL configure karne ke liye `.env` file ka use karein.

### Setup Instructions

1. **Frontend folder mein jaayein:**
   ```bash
   cd frontend
   ```

2. **`.env` file create karein** (agar nahi hai toh):
   ```bash
   copy .env.example .env
   ```

3. **Environment ke according `.env` file mein configuration add karein:**

#### Development Environment
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MONGODB_FLE_API_URL=https://gopi-dev.netcorein.com/get_user_attributes
REACT_APP_ENV=development
```

#### Staging 1 (stg1)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MONGODB_FLE_API_URL=https://gopi-stg1.netcorein.com/get_user_attributes
REACT_APP_ENV=stg1
```

#### Pod 2
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MONGODB_FLE_API_URL=https://gopi-pod2.netcorein.com/get_user_attributes
REACT_APP_ENV=pod2
```

#### Pre-production (preprod)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MONGODB_FLE_API_URL=https://gopi-preprod.netcorein.com/get_user_attributes
REACT_APP_ENV=preprod
```

#### Production - India (prod_ind)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MONGODB_FLE_API_URL=https://gopi-prod-ind.netcorein.com/get_user_attributes
REACT_APP_ENV=prod_ind
```

#### Production - US (prod_us)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MONGODB_FLE_API_URL=https://gopi-prod-us.netcorein.com/get_user_attributes
REACT_APP_ENV=prod_us
```

#### Production - EU (prod_eu)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MONGODB_FLE_API_URL=https://gopi-prod-eu.netcorein.com/get_user_attributes
REACT_APP_ENV=prod_eu
```

### Usage in Code

```javascript
import { MONGODB_FLE_API_URL } from '../config/environment';

// Use MongoDB FLE API URL
const response = await axios.post(MONGODB_FLE_API_URL, { data });
```

### Automatic Environment Detection

Agar `REACT_APP_MONGODB_FLE_API_URL` set nahi hai, toh environment automatically detect kiya jayega:

1. `REACT_APP_ENV` check hoga
2. Agar nahi hai, toh `NODE_ENV` use hoga
3. Default: development environment

### Important Notes

- `.env` file ko git mein commit mat karein (already in .gitignore)
- Her environment ke liye separate `.env` file maintain karein
- Development server restart karein `.env` changes apply karne ke liye

### Quick Setup Commands

**Development:**
```bash
cp .env.example .env
# Edit .env and set REACT_APP_ENV=development
npm start
```

**Staging 1:**
```bash
cp .env.example .env.stg1
# Edit .env.stg1 and set REACT_APP_ENV=stg1
# Then set REACT_APP_ENV=stg1 before npm start
```

### Build for Specific Environment

Production build ke liye:
```bash
REACT_APP_ENV=prod_ind npm run build
```

Ya `.env` file mein set karein aur phir build run karein.

