using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace FriendyFy.Messaging
{
    public class SendGridEmailSender : IEmailSender
    {
        private readonly SendGridClient client;


        public SendGridEmailSender(string apiKey)
        {
            client = new SendGridClient(apiKey);
        }

        public async Task SendEmailAsync(string from, string fromName, string to, string subject, string htmlContent, IEnumerable<EmailAttachment> attachments = null)
        {
            if (string.IsNullOrWhiteSpace(subject) && string.IsNullOrWhiteSpace(htmlContent))
            {
                throw new ArgumentException("Subject and message should be provided.");
            }

            var message = GetMessageWithData(from, to, fromName, subject, htmlContent);

            if (attachments?.Any() == true)
            {
                foreach (var attachment in attachments)
                {
                    message.AddAttachment(attachment.FileName, Convert.ToBase64String(attachment.Content), attachment.MimeType);
                }
            }

            await client.SendEmailAsync(message);
        }


        private SendGridMessage GetMessageWithData(string from, string to, string fromName, string subject, string htmlContent = null)
        {
            var fromAddress = new EmailAddress(from, fromName);
            var toAddress = new EmailAddress(to);
            var message = MailHelper.CreateSingleEmail(fromAddress, toAddress, subject, null, htmlContent);
            return message;
        }
    }
}
