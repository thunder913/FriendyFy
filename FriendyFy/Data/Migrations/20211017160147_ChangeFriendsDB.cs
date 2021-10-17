using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class ChangeFriendsDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrentUserId",
                table: "UserFriends",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserFriends_CurrentUserId",
                table: "UserFriends",
                column: "CurrentUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFriends_AspNetUsers_CurrentUserId",
                table: "UserFriends",
                column: "CurrentUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFriends_AspNetUsers_CurrentUserId",
                table: "UserFriends");

            migrationBuilder.DropIndex(
                name: "IX_UserFriends_CurrentUserId",
                table: "UserFriends");

            migrationBuilder.DropColumn(
                name: "CurrentUserId",
                table: "UserFriends");
        }
    }
}
