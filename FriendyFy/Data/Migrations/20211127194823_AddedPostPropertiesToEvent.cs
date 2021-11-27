using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class AddedPostPropertiesToEvent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EventId",
                table: "Posts",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventId",
                table: "PostLike",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventId",
                table: "PostComment",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Posts_EventId",
                table: "Posts",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLike_EventId",
                table: "PostLike",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_PostComment_EventId",
                table: "PostComment",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostComment_Events_EventId",
                table: "PostComment",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PostLike_Events_EventId",
                table: "PostLike",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Events_EventId",
                table: "Posts",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostComment_Events_EventId",
                table: "PostComment");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLike_Events_EventId",
                table: "PostLike");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Events_EventId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_EventId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_PostLike_EventId",
                table: "PostLike");

            migrationBuilder.DropIndex(
                name: "IX_PostComment_EventId",
                table: "PostComment");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "PostLike");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "PostComment");
        }
    }
}
