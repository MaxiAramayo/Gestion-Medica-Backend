# 📑 Especificación de Endpoints: Auth y Users

---

## 🔐 AUTH MODULE

### 1. POST /api/auth/login

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

- Success (200):

```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "string",
  "user": {
    "id": number,
    "email": "string",
    "name": "string",
    "role": "string",
    "isActive": boolean,
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
}
```

- Error (401/400):

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

### 2. POST /api/auth/register

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "role": "string"
}
```

**Response:**

- Success (201):

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": number,
    "email": "string",
    "name": "string",
    "role": "string",
    "isActive": boolean,
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
}
```

- Error (400):

```json
{
  "success": false,
  "message": "Error al registrar usuario"
}
```

---

### 3. GET /api/auth/me

**Headers:** `Authorization: Bearer <token>`
**Response:**

- Success (200):

```json
{
  "success": true,
  "user": {
    "id": number,
    "email": "string",
    "name": "string",
    "role": "string",
    "isActive": boolean,
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
}
```

- Error (401):

```json
{
  "success": false,
  "message": "No autorizado"
}
```

---

### 4. POST /api/auth/logout

**Headers:** `Authorization: Bearer <token>`
**Response:**

- Success (200):

```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

---

## 👤 USERS MODULE

### 1. GET /api/users

**Query params (opcional):**

- `page`: number
- `limit`: number
- `search`: string
  **Response:**
- Success (200):

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "email": "string",
      "name": "string",
      "role": "string",
      "isActive": boolean,
      "createdAt": "ISODate",
      "updatedAt": "ISODate"
    }
    // ...más usuarios
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

---

### 2. GET /api/users/:id

**Params:** `id` (number)
**Response:**

- Success (200):

```json
{
  "success": true,
  "data": {
    "id": number,
    "email": "string",
    "name": "string",
    "role": "string",
    "isActive": boolean,
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
}
```

- Error (404):

```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

### 3. POST /api/users

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "role": "string"
}
```

**Response:**

- Success (201):

```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": number,
    "email": "string",
    "name": "string",
    "role": "string",
    "isActive": boolean,
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
}
```

- Error (400):

```json
{
  "success": false,
  "message": "Error al crear usuario"
}
```

---

### 4. PUT /api/users/:id

**Params:** `id` (number)
**Request Body:**

```json
{
  "email": "string",
  "name": "string",
  "role": "string",
  "isActive": boolean
}
```

**Response:**

- Success (200):

```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": number,
    "email": "string",
    "name": "string",
    "role": "string",
    "isActive": boolean,
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
}
```

- Error (404/400):

```json
{
  "success": false,
  "message": "Usuario no encontrado o error de validación"
}
```

---

### 5. DELETE /api/users/:id

**Params:** `id` (number)
**Response:**

- Success (200):

```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

- Error (404):

```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

## 🧩 INTERFACE SUGERIDA PARA USUARIO (Frontend TypeScript)

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string; // ISODate
  updatedAt: string; // ISODate
}
```
