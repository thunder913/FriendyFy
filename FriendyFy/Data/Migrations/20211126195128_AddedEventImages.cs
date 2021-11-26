using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class AddedEventImages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EventId",
                table: "Image",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageId",
                table: "Events",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Image_EventId",
                table: "Image",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_ProfileImageId",
                table: "Events",
                column: "ProfileImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Image_ProfileImageId",
                table: "Events",
                column: "ProfileImageId",
                principalTable: "Image",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Image_Events_EventId",
                table: "Image",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Image_ProfileImageId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_Image_Events_EventId",
                table: "Image");

            migrationBuilder.DropIndex(
                name: "IX_Image_EventId",
                table: "Image");

            migrationBuilder.DropIndex(
                name: "IX_Events_ProfileImageId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Image");

            migrationBuilder.DropColumn(
                name: "ProfileImageId",
                table: "Events");
        }
    }
}
