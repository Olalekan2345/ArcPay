import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function onboardingEmail({
  employeeName,
  employeeEmail,
  role,
  department,
  employerName,
  portalUrl,
}: {
  employeeName: string
  employeeEmail: string
  role: string
  department: string
  employerName: string
  portalUrl: string
}) {
  const firstName = employeeName.split(' ')[0]

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ArcPay</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo / Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:12px;width:44px;height:44px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:20px;font-weight:700;line-height:44px;">⚡</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="font-size:18px;font-weight:700;color:#0f172a;">ArcPay</span>
                    <span style="display:block;font-size:11px;color:#94a3b8;margin-top:1px;">Confidential AI Payroll</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

              <!-- Gradient banner -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:32px 40px;text-align:center;">
                    <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:56px;">👋</div>
                    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 8px;">Welcome, ${firstName}!</h1>
                    <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">You've been added to <strong>${employerName}</strong>'s payroll on ArcPay</p>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 40px;">

                    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
                      Hi <strong style="color:#0f172a;">${firstName}</strong>, your employer has set up your payroll account. You can now access your personal employee dashboard to view attendance, salary details, and payment history.
                    </p>

                    <!-- Details card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          ${[
                            ['Full Name', employeeName],
                            ['Email', employeeEmail],
                            ['Role', role],
                            ['Department', department],
                          ].map(([label, value], i) => `
                          <table width="100%" cellpadding="0" cellspacing="0" style="${i > 0 ? 'border-top:1px solid #e2e8f0;' : ''}">
                            <tr>
                              <td style="padding:10px 0;color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;width:40%;">${label}</td>
                              <td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:500;">${value}</td>
                            </tr>
                          </table>`).join('')}
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td align="center">
                          <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;box-shadow:0 4px 14px rgba(37,99,235,0.3);">
                            Access Employee Dashboard →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color:#94a3b8;font-size:13px;text-align:center;margin:0 0 4px;">
                      Click the button above, then enter <strong style="color:#64748b;">${employeeEmail}</strong> to log in.
                    </p>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                      <tr><td style="border-top:1px solid #f1f5f9;"></td></tr>
                    </table>

                    <!-- Arcium privacy note -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;margin-bottom:8px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="vertical-align:top;padding-right:12px;font-size:18px;">🔒</td>
                              <td>
                                <p style="color:#1d4ed8;font-size:13px;font-weight:600;margin:0 0 4px;">Your salary is confidential</p>
                                <p style="color:#3b82f6;font-size:12px;margin:0;line-height:1.5;">
                                  Your salary is encrypted using <strong>Arcium MPC</strong> (Multi-Party Computation). Only you can reveal it by signing with your wallet inside your dashboard. No transaction is required.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="color:#cbd5e1;font-size:12px;margin:0 0 4px;">
                Powered by <strong>Arc Network Testnet</strong> · Salaries computed by <strong>Arcium MPC</strong>
              </p>
              <p style="color:#e2e8f0;font-size:11px;margin:0;">
                You received this because your employer added you to ArcPay. Questions? Contact your employer directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return html
}

export async function POST(req: NextRequest) {
  try {
    const { employeeName, employeeEmail, role, department, employerName } = await req.json()

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }

    const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://arcpay.vercel.app'}/employee`

    const { data, error } = await resend.emails.send({
      from: 'ArcPay <onboarding@resend.dev>',
      to: [employeeEmail],
      subject: `Welcome to ${employerName}'s payroll on ArcPay`,
      html: onboardingEmail({ employeeName, employeeEmail, role, department, employerName, portalUrl }),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
