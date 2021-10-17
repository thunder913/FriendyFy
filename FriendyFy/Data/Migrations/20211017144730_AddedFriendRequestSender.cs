using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class AddedFriendRequestSender : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequestSenderId",
                table: "UserFriends",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestSenderId",
                table: "UserFriends");
        }
    }
}
