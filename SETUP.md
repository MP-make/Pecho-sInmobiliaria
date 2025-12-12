# 🏠 Inmobiliaria Pecho's - Guía de Configuración

## ✅ Funcionalidades Implementadas

### 1. **Sistema de Autenticación Completo**
- ✅ Login protegido con JWT
- ✅ Middleware que protege rutas `/admin/*`
- ✅ Gestión de usuarios admin
- ✅ Botón de logout

### 2. **Nuevos Campos en Propiedades**
- ✅ `whatsappNumber` - Número de WhatsApp por propiedad
- ✅ `mapUrl` - Link directo de Google Maps (en lugar de coordenadas)

### 3. **Panel Admin Mejorado**
- ✅ **Mensajes (Leads)** - Ver todos los mensajes de contacto
- ✅ **Usuarios** - Crear y gestionar usuarios admin
- ✅ Navegación mejorada con logout

### 4. **Mejoras en la Vista de Propiedades**
- ✅ Botón de WhatsApp por propiedad
- ✅ Integración con Google Maps

---

## 🚀 Pasos para Inicializar

### 1. Asegúrate de que el servidor esté corriendo
```bash
npm run dev
```

### 2. Inicializar el Usuario Admin
Opción A - **Desde el navegador:**
- Ve a: `http://localhost:3000/api/admin/init`
- O usa Postman/Thunder Client para hacer POST a esa URL

Opción B - **Desde la terminal (PowerShell):**
```powershell
Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/admin/init"
```

Esto creará el usuario admin con las siguientes credenciales:
- **Email:** `mp@mp.com`
- **Contraseña:** `mp`

### 3. Acceder al Panel Admin
1. Ve a: `http://localhost:3000/admin/login`
2. Ingresa las credenciales:
   - Email: `mp@mp.com`
   - Contraseña: `mp`
3. ¡Listo! Ya puedes acceder al panel admin

---

## 📝 Uso del Sistema

### **Gestionar Propiedades**
1. Ve a **Propiedades** en el menú del admin
2. Al crear/editar una propiedad, ahora puedes:
   - Agregar un **número de WhatsApp** específico para esa propiedad
   - Agregar un **link de Google Maps** directo (ej: `https://maps.google.com/?q=-13.7098,-76.2067`)

**Cómo obtener el link de Google Maps:**
1. Ve a Google Maps
2. Busca la dirección de la propiedad
3. Haz clic derecho en el marcador
4. Selecciona "Copiar enlace"
5. Pega ese enlace en el campo "URL del Mapa"

### **Ver Mensajes de Contacto (Leads)**
1. Ve a **Mensajes** en el menú del admin
2. Verás todos los mensajes recibidos desde el formulario de contacto
3. Incluye: nombre, email, teléfono, fechas de entrada/salida, mensaje

### **Gestionar Usuarios Admin**
1. Ve a **Usuarios** en el menú del admin
2. Haz clic en **"+ Nuevo Usuario"**
3. Completa el formulario:
   - Nombre
   - Email
   - Contraseña (mínimo 4 caracteres)
4. El nuevo usuario podrá acceder al panel admin con sus credenciales

### **Cerrar Sesión**
- Haz clic en el botón **"Salir"** en el menú del admin

---

## 🔒 Seguridad

- ✅ Todas las rutas `/admin/*` están protegidas por autenticación
- ✅ Las contraseñas se encriptan con bcrypt
- ✅ Los tokens JWT tienen una duración de 7 días
- ✅ Si intentas acceder al admin sin estar autenticado, serás redirigido al login

---

## 🎨 Características del Cliente

### **Vista de Propiedad Individual**
- El botón de WhatsApp ahora usa el número específico de cada propiedad
- Si una propiedad tiene estado "RENTED" o "MAINTENANCE", mostrará un mensaje de no disponibilidad
- El mapa de Google Maps se mostrará si la propiedad tiene un `mapUrl` configurado

---

## 📱 Contacto por WhatsApp

Cada propiedad puede tener su propio número de WhatsApp. El mensaje predeterminado incluye:
- Nombre de la propiedad
- Tipo de alquiler seleccionado (por días o por meses)

Formato del número: `51987654321` (código de país + número sin espacios ni símbolos)

---

## 🐛 Solución de Problemas

### El usuario admin ya existe
Si al ejecutar `/api/admin/init` ves el mensaje "Usuario admin ya existe", significa que ya está creado. Solo inicia sesión con las credenciales.

### No puedo acceder al admin
1. Verifica que el servidor esté corriendo: `npm run dev`
2. Asegúrate de haber creado el usuario admin
3. Verifica que estás usando las credenciales correctas: `mp@mp.com` / `mp`
4. Borra las cookies del navegador e intenta de nuevo

### Error en la base de datos
Si hay errores de base de datos, ejecuta:
```bash
npx prisma generate
npx prisma db push
```

---

## 🎯 Próximos Pasos Sugeridos

1. Cambiar la contraseña del usuario admin por defecto
2. Agregar números de WhatsApp a todas las propiedades
3. Agregar links de Google Maps a todas las propiedades
4. Crear usuarios admin adicionales si es necesario

---

**¡Listo! El sistema está completamente configurado y protegido.** 🎉
