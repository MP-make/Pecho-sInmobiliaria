import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendLeadNotificationParams {
  leadName: string
  leadDNI: string
  leadPhone: string
  leadEmail?: string
  propertyTitle: string
  propertyId: string
  message?: string
}

export async function sendLeadNotification(params: SendLeadNotificationParams) {
  const {
    leadName,
    leadDNI,
    leadPhone,
    leadEmail,
    propertyTitle,
    propertyId,
    message
  } = params

  const adminEmail = process.env.ADMIN_EMAIL || 'yones314315@gmail.com'

  try {
    const { data, error } = await resend.emails.send({
      from: 'Pecho\'s Inmobiliaria <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `🏠 Nuevo Lead: ${leadName} interesado en ${propertyTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Courier New', monospace;
                background-color: #F2EFE9;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border: 4px solid #2C2621;
                padding: 0;
              }
              .header {
                background-color: #2C2621;
                color: white;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .content {
                padding: 30px;
              }
              .alert {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin-bottom: 20px;
              }
              .info-box {
                background-color: #F2EFE9;
                border: 2px solid #2C2621;
                padding: 20px;
                margin: 20px 0;
              }
              .info-row {
                display: flex;
                padding: 10px 0;
                border-bottom: 1px solid #2C2621;
              }
              .info-row:last-child {
                border-bottom: none;
              }
              .info-label {
                font-weight: bold;
                color: #2C2621;
                width: 140px;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 1px;
              }
              .info-value {
                color: #2C2621;
                flex: 1;
              }
              .button {
                display: inline-block;
                background-color: #25D366;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                text-transform: uppercase;
                font-weight: bold;
                letter-spacing: 2px;
                margin: 20px 0;
                border: 2px solid #2C2621;
              }
              .footer {
                background-color: #2C2621;
                color: white;
                padding: 20px;
                text-align: center;
                font-size: 12px;
              }
              .security-badge {
                background-color: #d4edda;
                border-left: 4px solid #28a745;
                padding: 15px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔒 Nuevo Lead Verificado</h1>
              </div>
              
              <div class="content">
                <div class="alert">
                  <strong>⚠️ ACCIÓN REQUERIDA:</strong> Un usuario ha completado el formulario de seguridad y está esperando tu contacto.
                </div>

                <div class="security-badge">
                  <strong>✓ Verificación de Seguridad Completada</strong><br>
                  <small>El usuario proporcionó su DNI y acepta ser verificado antes del contacto.</small>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2C2621; text-transform: uppercase; font-size: 14px; letter-spacing: 2px;">Datos del Lead</h3>
                  
                  <div class="info-row">
                    <div class="info-label">Nombre:</div>
                    <div class="info-value">${leadName}</div>
                  </div>
                  
                  <div class="info-row">
                    <div class="info-label">DNI:</div>
                    <div class="info-value"><strong>${leadDNI}</strong></div>
                  </div>
                  
                  <div class="info-row">
                    <div class="info-label">WhatsApp:</div>
                    <div class="info-value"><strong>${leadPhone}</strong></div>
                  </div>
                  
                  ${leadEmail ? `
                  <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">${leadEmail}</div>
                  </div>
                  ` : ''}
                  
                  <div class="info-row">
                    <div class="info-label">Propiedad:</div>
                    <div class="info-value">${propertyTitle}</div>
                  </div>
                  
                  ${message ? `
                  <div class="info-row">
                    <div class="info-label">Mensaje:</div>
                    <div class="info-value">${message}</div>
                  </div>
                  ` : ''}
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://wa.me/51${leadPhone}?text=${encodeURIComponent(`Hola ${leadName}, te contacto desde Pecho's Inmobiliaria sobre tu interés en: ${propertyTitle}`)}" class="button">
                    💬 Contactar por WhatsApp
                  </a>
                </div>

                <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 3px solid #2C2621;">
                  <strong style="color: #2C2621;">📋 Próximos pasos:</strong><br>
                  <ol style="margin: 10px 0; padding-left: 20px; color: #2C2621;">
                    <li>Verifica que el nombre coincida con el DNI</li>
                    <li>Contacta al lead por WhatsApp</li>
                    <li>Marca el lead como "Contactado" en el panel de admin</li>
                    <li>Si es fraudulento, bloquea el DNI</li>
                  </ol>
                </div>

                <p style="color: #6c757d; font-size: 12px; text-align: center;">
                  También puedes gestionar este lead desde tu panel de administración:<br>
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/leads" style="color: #2C2621;">Ver Panel de Leads</a>
                </p>
              </div>

              <div class="footer">
                Pecho's Inmobiliaria - Sistema de Seguridad Activado 🔒<br>
                Fecha: ${new Date().toLocaleString('es-PE', { dateStyle: 'full', timeStyle: 'short' })}
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Error enviando email:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Email enviado exitosamente:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error al enviar notificación por email:', error)
    return { success: false, error: 'Error al enviar email' }
  }
}