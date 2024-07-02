export function emailTemplate(title: string, body: string, actionUrl: string, actionText: string): string {
    const logoUrl = 'https://trust-d4cbc4aea2b1.herokuapp.com/public/upload/products/logookoce.png';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div class="container" style="background-color: #ffffff; margin: 0 auto; padding: 20px; max-width: 600px; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div class="header" style="background-color: #4A90E2; padding: 30px 0; border-radius: 8px 8px 0 0; position: relative;">
            <div style="background-image: url(${logoUrl}); background-size: contain; background-repeat: no-repeat; background-position: center; width: 50px; height: 50px; margin: 0 auto;"></div>
        </div>
        <div class="content" style="padding: 20px;">
            <h1 style="font-size: 24px; color: #333333;">${title}</h1>
            <p style="font-size: 16px; color: #666666; line-height: 1.5;">${body}</p>
            <div class="button" style="margin-top: 20px;">
                <a href="${actionUrl}" style="background-color: #4A90E2; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">${actionText}</a>
            </div>
        </div>
        <div class="footer" style="margin-top: 30px; font-size: 14px; color: #666666;">
            <p>If you have any questions, please email us at <a href="mailto:ahmad.fadilah0210@gmail.com" style="color: #4A90E2; text-decoration: none;">ahmdfdhilah@gmail.com</a> or visit our FAQS. You can also chat with a real live human during our operating hours. They can answer questions about your account.</p>
            <p>You have received this email as a registered user of <a href="https://okoce.net" style="color: #4A90E2; text-decoration: none;">okoce.net</a></p>
        </div>
    </div>
</body>
</html>
    `;
}