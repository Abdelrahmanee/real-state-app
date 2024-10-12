export const emailTemplateCompany = ({ name, email, phoneNum, message, subject, link, linkData }) => {
    return `<!DOCTYPE html>
         <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <style type="text/css">
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .email-wrapper {
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #630E2B;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header img {
                width: 80px;
                height: 80px;
            }
            .content {
                padding: 30px;
            }
            .content h1 {
                color: #630E2B;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .content p {
                color: #333333;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            .content table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .content table th, .content table td {
                text-align: left;
                padding: 8px;
                border: 1px solid #ddd;
            }
            .content table th {
                background-color: #f2f2f2;
            }
            .button {
                display: inline-block;
                background-color: #630E2B;
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 4px;
                text-decoration: none;
                font-size: 16px;
                margin-top: 20px;
            }
            .footer {
                background-color: #f9f9f9;
                color: #666666;
                text-align: center;
                padding: 20px;
                font-size: 14px;
                border-top: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-wrapper">
                <div class="header">
                    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" alt="Logo" />
                </div>
                <div class="content">
                    <h1>${subject}</h1>
                    <p>Here are the details of the new customer:</p>
                    <table>
                        <tr>
                            <th>Company Name</th>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <th>Company Email</th>
                            <td>${email}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td>${phoneNum}</td>
                        </tr>
                        <tr>
                            <th>Note</th>
                            <td>${message}</td>
                        </tr>
                    </table>
                    </div>
                    <div class="footer">
                    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${linkData}</a>

                </div>
            </div>
        </div>
    </body>
    </html>`;
};
