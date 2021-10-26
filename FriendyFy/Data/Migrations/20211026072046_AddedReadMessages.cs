using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class AddedReadMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Message_MessageId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_MessageId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "MessageId",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "ApplicationUserMessage",
                columns: table => new
                {
                    ReadMessagesId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SeenById = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserMessage", x => new { x.ReadMessagesId, x.SeenById });
                    table.ForeignKey(
                        name: "FK_ApplicationUserMessage_AspNetUsers_SeenById",
                        column: x => x.SeenById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserMessage_Message_ReadMessagesId",
                        column: x => x.ReadMessagesId,
                        principalTable: "Message",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserMessage_SeenById",
                table: "ApplicationUserMessage",
                column: "SeenById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationUserMessage");

            migrationBuilder.AddColumn<string>(
                name: "MessageId",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_MessageId",
                table: "AspNetUsers",
                column: "MessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Message_MessageId",
                table: "AspNetUsers",
                column: "MessageId",
                principalTable: "Message",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
