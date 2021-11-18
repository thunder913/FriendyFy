using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class MadeUserLikesUniqueLiker : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PostLike_LikedById",
                table: "PostLike");

            migrationBuilder.CreateIndex(
                name: "IX_PostLike_LikedById",
                table: "PostLike",
                column: "LikedById",
                unique: true,
                filter: "[LikedById] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PostLike_LikedById",
                table: "PostLike");

            migrationBuilder.CreateIndex(
                name: "IX_PostLike_LikedById",
                table: "PostLike",
                column: "LikedById");
        }
    }
}
