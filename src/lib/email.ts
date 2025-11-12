import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.EMAIL_FROM || "PawCare <noreply@pawcare.app>";

export async function sendVaccinationReminder(
  to: string,
  petName: string,
  vaccineName: string,
  daysUntilDue: number
) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: `${petName}'s ${vaccineName} is due soon`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Vaccination Reminder</h2>
          <p>Hi there,</p>
          <p>
            This is a friendly reminder that <strong>${petName}</strong>'s
            <strong>${vaccineName}</strong> vaccination is due in
            <strong>${daysUntilDue} day${daysUntilDue > 1 ? "s" : ""}</strong>.
          </p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard"
               style="background-color: #4CAF50; color: white; padding: 10px 20px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View Pet Profile
            </a>
          </p>
          <p>Don't forget to schedule an appointment with your vet!</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            You're receiving this email because you have vaccination reminders enabled
            for ${petName}. You can manage your notification preferences in settings.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending vaccination reminder:", error);
    throw error;
  }
}

export async function sendMedicationReminder(
  to: string,
  petName: string,
  medicationName: string,
  dosage: string,
  time: string
) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Time for ${petName}'s ${medicationName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Medication Reminder</h2>
          <p>Hi there,</p>
          <p>
            It's time to give <strong>${petName}</strong> their
            <strong>${medicationName}</strong> (${dosage}).
          </p>
          <p>Scheduled time: ${time}</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard"
               style="background-color: #4CAF50; color: white; padding: 10px 20px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Mark as Given
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending medication reminder:", error);
    throw error;
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Verify your PawCare account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to PawCare!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <p>
            <a href="${verifyUrl}"
               style="background-color: #4CAF50; color: white; padding: 10px 20px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${verifyUrl}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Reset your PawCare password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <p>
            <a href="${resetUrl}"
               style="background-color: #4CAF50; color: white; padding: 10px 20px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}
