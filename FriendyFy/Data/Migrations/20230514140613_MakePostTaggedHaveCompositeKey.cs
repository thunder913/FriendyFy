using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FriendyFy.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakePostTaggedHaveCompositeKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostTagged_AspNetUsers_UserId",
                table: "PostTagged");

            migrationBuilder.DropForeignKey(
                name: "FK_PostTagged_Posts_PostId",
                table: "PostTagged");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostTagged",
                table: "PostTagged");

            migrationBuilder.DropIndex(
                name: "IX_PostTagged_UserId",
                table: "PostTagged");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PostTagged");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "PostTagged",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PostId",
                table: "PostTagged",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostTagged",
                table: "PostTagged",
                columns: new[] { "UserId", "PostId" });

            migrationBuilder.AddForeignKey(
                name: "FK_PostTagged_AspNetUsers_UserId",
                table: "PostTagged",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostTagged_Posts_PostId",
                table: "PostTagged",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostTagged_AspNetUsers_UserId",
                table: "PostTagged");

            migrationBuilder.DropForeignKey(
                name: "FK_PostTagged_Posts_PostId",
                table: "PostTagged");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostTagged",
                table: "PostTagged");

            migrationBuilder.AlterColumn<string>(
                name: "PostId",
                table: "PostTagged",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "PostTagged",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "PostTagged",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostTagged",
                table: "PostTagged",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PostTagged_UserId",
                table: "PostTagged",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostTagged_AspNetUsers_UserId",
                table: "PostTagged",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostTagged_Posts_PostId",
                table: "PostTagged",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id");
        }
    }
}
