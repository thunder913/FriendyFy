using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class AddedSomeChatVariables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Chat_ChatId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ChatId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ChatId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "ChatType",
                table: "Chat",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ApplicationUserChat",
                columns: table => new
                {
                    ChatsId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UsersId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserChat", x => new { x.ChatsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserChat_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserChat_Chat_ChatsId",
                        column: x => x.ChatsId,
                        principalTable: "Chat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserChat_UsersId",
                table: "ApplicationUserChat",
                column: "UsersId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationUserChat");

            migrationBuilder.DropColumn(
                name: "ChatType",
                table: "Chat");

            migrationBuilder.AddColumn<string>(
                name: "ChatId",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ChatId",
                table: "AspNetUsers",
                column: "ChatId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Chat_ChatId",
                table: "AspNetUsers",
                column: "ChatId",
                principalTable: "Chat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
