const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OtpService {
    /**
     * Generates a 6-digit OTP for the given phone number, stores it, and logs it.
     * @param {string} phone - The phone number to generate OTP for.
     * @returns {Promise<string>} The generated OTP.
     */
    async generateOtp(phone) {
        // Generate a random 6 digit number
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiration to 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Save strictly valid logic depending on previous logic handling resends
        // We can just add a new row every time
        await prisma.otpCode.create({
            data: {
                phone,
                code,
                expiresAt,
                used: false
            }
        });

        // Mock SMS provider by logging to console
        console.log(`[OTP SERVICE] OTP for ${phone}: ${code}`);

        return code;
    }

    /**
     * Verifies the provided OTP for the given phone number.
     * @param {string} phone - The phone number to verify.
     * @param {string} code - The OTP code to verify.
     * @returns {Promise<boolean>} True if valid, false otherwise.
     */
    async verifyOtp(phone, code) {
        // Note: added detailed logging to debug 'Invalid or expired OTP' issue
        console.log(`[OTP DEBUG] Verifying code: '${code}' for phone: '${phone}' at ${new Date().toISOString()}`);
        
        const otpRecord = await prisma.otpCode.findFirst({
            where: {
                phone: phone,
                code: String(code).trim(), // ensure string and trim
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!otpRecord) {
            console.log(`[OTP DEBUG] No record found for phone ${phone} with code ${code}`);
            return false;
        }

        if (otpRecord.used) {
            console.log(`[OTP DEBUG] OTP record ${otpRecord.id} is already marked as USED.`);
            return false;
        }

        if (new Date() > otpRecord.expiresAt) {
            console.log(`[OTP DEBUG] OTP record ${otpRecord.id} is EXPIRED. expiresAt: ${otpRecord.expiresAt.toISOString()}, now: ${new Date().toISOString()}`);
            return false;
        }

        console.log(`[OTP DEBUG] OTP record ${otpRecord.id} matches and is valid! Updating to used...`);
        // Mark as used
        await prisma.otpCode.update({
            where: { id: otpRecord.id },
            data: { used: true }
        });

        return true;
    }
}

module.exports = new OtpService();
