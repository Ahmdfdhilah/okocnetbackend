export function emailTemplate(title: string, body: string, actionUrl: string, actionText: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            margin: 0 auto;
            padding: 20px;
            max-width: 600px;
            text-align: center;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4A90E2;
            padding: 30px 0;
            border-radius: 8px 8px 0 0;
            position: relative;
        }
        .header .checkmark-circle {
            display: inline-block;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #fff;
            position: relative;
            animation: pop-up 0.5s ease-in-out;
            font-size: 50px;
            color: #4A90E2;
            line-height: 50px;
        }
        .header .checkmark-circle:before {
            content: '\\2713';
        }
        @keyframes pop-up {
            0% {
                transform: scale(0);
            }
            100% {
                transform: scale(1);
            }
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            font-size: 24px;
            color: #333333;
            animation: pop-up 0.5s ease-in-out;
        }
        .content p {
            font-size: 16px;
            color: #666666;
            line-height: 1.5;
        }
        .content .button {
            margin-top: 20px;
        }
        .content .button a {
            background-color: #4A90E2;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #666666;
        }
        .footer a {
            color: #4A90E2;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="checkmark-circle">✓</div>
        </div>
        <div class="content">
            <h1>${title}</h1>
            <p>${body}</p>
            <div class="button">
                <a href="${actionUrl}">${actionText}</a>
            </div>
        </div>
        <div class="footer">
            <p>If you have any questions, please email us at <a href="mailto:ahmad.fadilah0210@gmail.com">ahmdfdhilah@gmail.com</a> or visit our FAQS. You can also chat with a real live human during our operating hours. They can answer questions about your account.</p>
            <p>You have received this email as a registered user of <a href="https://okoce.net">okoce.net</a></p>
        </div>
    </div>
</body>
</html>
  `;
}
