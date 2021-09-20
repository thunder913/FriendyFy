using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class ChangeHowFriendsWork : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFriends_AspNetUsers_UserOneId",
                table: "UserFriends");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFriends_AspNetUsers_UserTwoId",
                table: "UserFriends");

            migrationBuilder.DropIndex(
                name: "IX_UserFriends_UserOneId",
                table: "UserFriends");

            migrationBuilder.DropColumn(
                name: "UserOneId",
                table: "UserFriends");

            migrationBuilder.RenameColumn(
                name: "UserTwoId",
                table: "UserFriends",
                newName: "FriendId1");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "UserFriends",
                newName: "FriendId");

            migrationBuilder.RenameIndex(
                name: "IX_UserFriends_UserTwoId",
                table: "UserFriends",
                newName: "IX_UserFriends_FriendId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFriends_AspNetUsers_FriendId1",
                table: "UserFriends",
                column: "FriendId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFriends_AspNetUsers_FriendId1",
                table: "UserFriends");

            migrationBuilder.RenameColumn(
                name: "FriendId1",
                table: "UserFriends",
                newName: "UserTwoId");

            migrationBuilder.RenameColumn(
                name: "FriendId",
                table: "UserFriends",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_UserFriends_FriendId1",
                table: "UserFriends",
                newName: "IX_UserFriends_UserTwoId");

            migrationBuilder.AddColumn<string>(
                name: "UserOneId",
                table: "UserFriends",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserFriends_UserOneId",
                table: "UserFriends",
                column: "UserOneId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFriends_AspNetUsers_UserOneId",
                table: "UserFriends",
                column: "UserOneId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFriends_AspNetUsers_UserTwoId",
                table: "UserFriends",
                column: "UserTwoId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
