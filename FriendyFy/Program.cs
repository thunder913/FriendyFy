using System;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using FriendyFy.Data;
using FriendyFy.Messaging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FriendyFy
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
            .ConfigureAppConfiguration((context, config) =>
            {
                var buildConfiguration = config.Build();

                string kvURL = buildConfiguration["KeyVaultConfig:KVUrl"];
                string tenantId = buildConfiguration["KeyVaultConfig:TenantId"];
                string clientId = buildConfiguration["KeyVaultConfig:ClientId"];
                string clientSecret = buildConfiguration["KeyVaultConfig:ClientSecretId"];

                var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
                var client = new SecretClient(new Uri(kvURL), credential);
                config.AddAzureKeyVault(client, new AzureKeyVaultConfigurationOptions());
            });

        public static void ConfigureServices(ServiceCollection services)
        {
            services.AddScoped(typeof(IDeletableEntityRepository<>), typeof(EfDeletableEntityRepository<>));
            services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));

            services.AddTransient<IEmailSender, SendGridEmailSender>();
        }
    }
}
