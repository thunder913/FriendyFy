using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FriendyFy.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakePostLikeKeyCommposite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostLike_AspNetUsers_LikedById",
                table: "PostLike");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLike_Posts_PostId",
                table: "PostLike");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostLike",
                table: "PostLike");

            migrationBuilder.DropIndex(
                name: "IX_PostLike_LikedById_PostId",
                table: "PostLike");

            migrationBuilder.AlterColumn<string>(
                name: "PostId",
                table: "PostLike",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LikedById",
                table: "PostLike",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "PostLike",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostLike",
                table: "PostLike",
                columns: new[] { "LikedById", "PostId" });

            migrationBuilder.AddForeignKey(
                name: "FK_PostLike_AspNetUsers_LikedById",
                table: "PostLike",
                column: "LikedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostLike_Posts_PostId",
                table: "PostLike",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostLike_AspNetUsers_LikedById",
                table: "PostLike");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLike_Posts_PostId",
                table: "PostLike");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostLike",
                table: "PostLike");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "PostLike",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PostId",
                table: "PostLike",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "LikedById",
                table: "PostLike",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostLike",
                table: "PostLike",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PostLike_LikedById_PostId",
                table: "PostLike",
                columns: new[] { "LikedById", "PostId" },
                unique: true,
                filter: "[LikedById] IS NOT NULL AND [PostId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_PostLike_AspNetUsers_LikedById",
                table: "PostLike",
                column: "LikedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostLike_Posts_PostId",
                table: "PostLike",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id");
        }
    }
}
