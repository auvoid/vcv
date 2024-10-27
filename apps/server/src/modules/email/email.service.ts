import { Inject, Injectable, forwardRef } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { User } from '../../entities';
import { createJsonWebToken } from '../../utils';
import jwt from 'jsonwebtoken';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_KEY);
  }

  async sendUserEmailVerification({ user }: { user: User }) {
    const logoPath = new URL(
      '/images/Logo.png',
      process.env.PUBLIC_CLIENT_URI,
    ).toString();
    const token = jwt.sign(
      {
        scope: 'email-verification',
        userId: user.id,
        context: 'user',
      },
      process.env.SESSION_SECRET,
      {
        expiresIn: '1h',
      },
    );
    const verificationLink = `
      ${process.env.PUBLIC_CLIENT_URI}/verify-email?token=${token}
    `;
    const message = {
      from: 'Auvo ID <no-reply@auvo.io>',
      to: user.email,
      subject: `Email Verification Request for AuvoID`,
      html: `
      <html>
      <body>
      <div style="background: #f2f2f2; padding: 20px; font-family: sans-serif; text-align: center">
        <div style="text-align: center; padding: 20px;">
          <img src="${logoPath}" style="height: 65px; width: 65px; object-fit: cover; border-radius: 5px;" />
        </div>
        <h2>AuvoID</h2>
        <h1>Hello!</h1>
        <p>Please verify your Email by clicking the link below!</p>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center;">
              <center>
                <a href="${verificationLink}" style="text-decoration: none">
                  <button style="padding: 12px 25px; display: block; text-decoration: none; color: #3d3d3d; background: #DEC071; width: fit-content; border-radius: 5px; border: none;"> Verify Email</button>
                </a>
              </center>
            </td>
          </tr>
        </table>
        <p>If the button does not work, please click on the link below</p>
        <p>${verificationLink}</p>
      </div>
      </body>
      </html>
      `,
    };
    await sgMail.send(message);
  }

  async sendDeferredStepActionEmail(email: string) {
    const logoPath = new URL(
      '/images/Logo.png',
      process.env.PUBLIC_CLIENT_URI,
    ).toString();
    const token = createJsonWebToken(
      {
        scope: 'flow-credential-application',
      },
      '30d',
    );
    const url = new URL(
      `/apply/applications/`,
      process.env.PUBLIC_CLIENT_URI,
    ).toString();

    const msg = {
      from: 'AuvoID <no-reply@auvo.io>',
      to: email,
      subject: `Your Application is now being reviwed by `,
      html: `
                      <div style="background: #f2f2f2; padding: 20px; font-family: sans-serif; text-align: center">
			<div style="text-align: center; padding: 20px;">
				<img src="${logoPath}" style="height: 65px; width: 65px; object-fit: cover; border-radius: 5px;" />
			</div>
                      <h2>Your application foris being reviewed</h2>
			<h1>Hello!</h1>
                      <p>Your application for </p>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="text-align: center;">
                          <center>
                            <a href="${url}" style="text-decoration: none">
                              <button style="padding: 12px 25px; display: block; text-decoration: none; color: #3d3d3d; background: #DEC071; width: fit-content; border-radius: 5px; border: none;">View Application</button>
                            </a>
                          </center>
                        </td>
                      </tr>
                    </table
                      </div>
                      `,
    };
    await sgMail.send(msg);
  }
}
